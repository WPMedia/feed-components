'use strict'

import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
import moment from 'moment'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import buildURL from '../../resizerUrl'
const jmespath = require('jmespath')
const { fragment } = require('xmlbuilder2')

const rssTemplate = (
  elements,
  {
    channelTitle,
    channelDescription,
    channelCopyright,
    channelTTL,
    channelUpdatePeriod,
    channelUpdateFrequency,
    channelCategory,
    channelLogo,
    imageTitle,
    imageCaption,
    imageCredits,
    itemTitle,
    itemDescription,
    pubDate,
    itemCategory,
    includePromo,
    includeContent,
    resizerURL,
    domain,
    feedTitle,
    feedLanguage,
    buildContent,
  },
) => ({
  rss: {
    '@xmlns:atom': 'http://www.w3.org/2005/Atom',
    '@xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
    '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
    '@version': '2.0',
    ...(includePromo && {
      '@xmlns:media': 'http://search.yahoo.com/mrss/',
    }),
    channel: {
      title: `${channelTitle || feedTitle}`,
      link: `${domain}`,
      'atom:link': {
        '@href': `${domain}`, // TODO Need to include full url
        '@rel': 'self',
        '@type': 'application/rss+xml',
      },
      description: `${channelDescription || feedTitle + ' News Feed'}`,
      lastBuildDate: moment
        .utc(new Date())
        .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      ...(feedLanguage && { language: feedLanguage }),
      ...(channelCategory && { category: channelCategory }),
      ...(channelCopyright && {
        copyright: channelCopyright,
      }), // TODO Add default logic
      ...(channelTTL && { ttl: channelTTL }),
      ...(channelUpdatePeriod && {
        'sy:updatePeriod': channelUpdatePeriod,
      }),
      ...(channelUpdateFrequency && {
        'sy:updateFrequency': channelUpdateFrequency,
      }),
      ...(channelLogo && {
        image: {
          url: buildURL(channelLogo, resizerKey, resizerURL),
          title: `${channelTitle || feedTitle}`,
          link: `${domain}`,
        },
      }),

      item: elements.map((s) => {
        let author, body
        const url = `${domain}${s.website_url || s.canonical_url}`
        const img =
          s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
        return {
          title: `${jmespath.search(s, itemTitle)}`,
          link: url,
          guid: {
            '#': url,
            '@isPermaLink': true,
          },
          ...((author = jmespath.search(s, 'credits.by[].name')) &&
            author && {
              'dc:creator': author.join(','),
            }),
          description: { $: jmespath.search(s, itemDescription) },
          pubDate: moment
            .utc(s[pubDate])
            .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
          ...(includeContent !== '0' &&
            (body = buildContent(s.content_elements, includeContent, domain)) &&
            body && {
              'content:encoded': {
                $: body,
              },
            }),
          ...(includePromo &&
            img &&
            img.url && {
              'media:content': {
                '@type': 'image/jpeg',
                '@url': buildURL(img.url, resizerKey, resizerURL),
                ...(jmespath.search(img, imageCaption) && {
                  'media:description': {
                    '@type': 'plain',
                    $: jmespath.search(img, imageCaption),
                  },
                }),
                ...(jmespath.search(img, imageTitle) && {
                  'media:title': {
                    $: jmespath.search(img, imageTitle),
                  },
                }),
                ...((jmespath.search(img, imageCredits) || []).length && {
                  'media:credit': {
                    '@role': 'author',
                    '@scheme': 'urn:ebu',
                    '#': jmespath.search(img, imageCredits).join(','),
                  },
                }),
              },
            }),
        }
      }),
    },
  },
})

export function Rss({ globalContent, customFields, arcSite }) {
  const {
    resizerURL = '',
    feedDomainURL = '',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)

  const absoluteUrl = (url, domain) => {
    // if url isn't fully qualified, try to make it one
    if (url && url.startsWith('//')) {
      url = `${domain.substring(0, domain.indexOf('//'))}${url}`
    } else if (url && !url.startsWith('http')) {
      url = `${domain}${url}`
    }
    return url
  }

  const buildContentCorrection = (element) => {
    return ''
  }
  const buildContentGallery = (element) => {
    const gallery = []
    element.content_elements.map((image) => {
      gallery.push(buildContentImage(image))
    })
    return gallery
  }

  const buildContentImage = (element) => ({
    img: {
      '@': {
        src: buildURL(element.url, resizerKey, resizerURL),
        ...(element.caption && { alt: element.caption }),
        ...(element.height && { height: element.height }),
        ...(element.width && { width: element.width }),
      },
    },
  })

  const buildContentLinkList = (element) => {
    return ''
  }

  const buildContentList = (element) => {
    const listElement = (element) => {
      const listType = element.list_type === 'ordered' ? 'ol' : 'ul'
      const innerList = {}
      innerList[listType] = { li: [] }
      element.items.map((i) =>
        i.type === 'list'
          ? innerList[listType].li.push(listElement(i))
          : innerList[listType].li.push(i.content),
      )
      return innerList
    }
    const list = []
    list.push(listElement(element))
    return list
  }

  const buildContentListElement = (element) => {
    return ''
  }

  const buildContentListNumericRating = (element) => {
    return ''
  }

  const buildContentTable = (element) => {
    return ''
  }

  const buildContentText = (element) => {
    // handle text, raw_html, header, blockquote
    // all have a string in element.content
    // this is also used by buildContentQuote
    let item
    if (element.content && typeof element.content === 'string') {
      switch (element.type) {
        case 'header':
          item = {}
          item[`h${element.level || 1}`] = element.content
          break
        case 'blockquote':
          item = { q: element.content }
          break
        default:
          item = { p: element.content }
          break
      }
    }
    return item
  }

  const buildContentInterstitial = (element, domain) =>
    element.url && {
      p: {
        a: {
          '@href': absoluteUrl(element.url, domain),
          '#': element.content,
        },
      },
    }

  const buildContentOembed = (element) => {
    let embed = element.raw_oembed.html

    // twitter has <blockquote> + <script> remove the script tag
    if (embed && element.subtype === 'twitter') {
      const idx = embed.indexOf('</blockquote>')
      embed = embed.substring(0, idx + 13)
    }
    return { '#': embed }
  }

  const buildContentQuote = (element) => {
    const quote = []

    element.content_elements.map((quoteItem) => {
      switch (quoteItem.type) {
        case 'list':
          quote.push(buildContentList(quoteItem))
          break
        default:
          quote.push(buildContentText(quoteItem))
      }
    })
    const citation = jmespath.search(element, 'citation.content')
    citation && quote.push({ p: { '@class': 'citation', '#': citation } })

    return quote.length ? { blockquote: { '#': quote } } : ''
  }

  const buildContentVideo = (element) => {
    return ''
  }

  const buildContent = (contentElements, numRows, domain) => {
    let item
    const body = []
    const maxRows = numRows === 'all' ? 9999 : parseInt(numRows)
    contentElements.map((element) => {
      if (body.length <= maxRows) {
        switch (element.type) {
          case 'blockquote':
            item = buildContentText(element)
            break
          case 'code':
            item = ''
            break
          case 'correction':
            item = buildContentCorrection(element)
            break
          case 'custom_embed':
            item = ''
            break
          case 'divider':
            item = ''
            break
          case 'element_group':
            item = ''
            break
          case 'endorsement':
            item = ''
            break
          case 'gallery':
            item = buildContentGallery(element)
            break
          case 'header':
            item = buildContentText(element)
            break
          case 'image':
            item = buildContentImage(element)
            break
          case 'interstitial_link':
            item = buildContentInterstitial(element, domain)
            break
          case 'link_list':
            item = buildContentLinkList(element, domain)
            break
          case 'list':
            item = buildContentList(element)
            break
          case 'list_element':
            item = buildContentListElement(element)
            break
          case 'numeric_rating':
            item = buildContentListNumericRating(element)
            break
          case 'oembed_response':
            item = buildContentOembed(element)
            break
          case 'quote':
            item = buildContentQuote(element)
            break
          case 'raw_html':
            item = buildContentText(element)
            break
          case 'story':
            item = ''
            break
          case 'table':
            item = buildContentTable(element)
            break
          case 'text':
            item = buildContentText(element)
            break
          case 'video':
            item = buildContentVideo(element)
            break
          default:
            item = buildContentText(element)
            break
        }

        console.log(item)
        // empty array breaks xmlbuilder2, but empty '' is OK
        if (Array.isArray(item) && item.length === 0) {
          item = ''
        }
        item && body.push(item)
      }
    })
    return body.length ? fragment(body).toString() : ''
  }

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    resizerURL,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    buildContent,
  })
}

Rss.propTypes = {
  customFields: PropTypes.shape({
    channelTitle: PropTypes.string.tag({
      label: 'RSS Title',
      group: 'Channel',
      description: 'RSS Channel Title, defaults to website name',
      defaultValue: '',
    }),
    channelDescription: PropTypes.string.tag({
      label: 'RSS Description',
      group: 'Channel',
      description:
        'RSS Channel Description, defaults to website name + " News Feed"',
      defaultValue: '',
    }),
    channelCopyright: PropTypes.string.tag({
      label: 'Copyright',
      group: 'Channel',
      description: 'RSS Copyright value otherwise it will be excluded',
      defaultValue: '',
    }),
    channelTTL: PropTypes.string.tag({
      label: 'Time To Live',
      group: 'Channel',
      description:
        'Number of minutes to wait to check for new content, defaults to 1',
      defaultValue: '1',
    }),
    channelUpdatePeriod: PropTypes.oneOf([
      'hourly',
      'daily',
      'weekly',
      'monthly',
      'yearly',
    ]).tag({
      label: 'Update Period',
      group: 'Channel',
      description: 'Which period of time should be used, defaults to hourly',
      defaultValue: 'hourly',
    }),
    channelUpdateFrequency: PropTypes.string.tag({
      label: 'Update Frequency',
      group: 'Channel',
      description:
        'Number of Update Periods to wait to check for new content, defaults to 1',
      defaultValue: '1',
    }),
    channelCategory: PropTypes.string.tag({
      label: 'Category',
      group: 'Channel',
      description:
        'Category that describes this RSS feed, if blank it will be excluded',
      defaultValue: '',
    }),
    channelLogo: PropTypes.string.tag({
      label: 'Logo URL',
      group: 'Channel',
      description: 'URL to the logo for this RSS feed',
      defaultValue: '',
    }),
    itemTitle: PropTypes.string.tag({
      label: 'Title',
      group: 'Item',
      description:
        'ANS fields to use for article title, defaults to headlines.basic',
      defaultValue: 'headlines.basic',
    }),
    itemDescription: PropTypes.string.tag({
      label: 'Description',
      group: 'Item',
      description:
        'ANS fields to use for article description, defaults to description.basic',
      defaultValue: 'description.basic',
    }),
    pubDate: PropTypes.oneOf([
      'created_date',
      'display_date',
      'first_publish_date',
      'last_updated_date',
      'publish_date',
    ]).tag({
      label: 'Publication Date',
      group: 'Item',
      description: 'Which date field should be used, defaults to display_date',
      defaultValue: 'display_date',
    }),
    itemCategory: PropTypes.string.tag({
      label: 'Category',
      group: 'Item',
      description:
        'ANS field to use for article category, if blank will be excluded',
      defaultValue: '',
    }),
    includePromo: PropTypes.boolean.tag({
      label: 'Include promo images?',
      group: 'Featured Image',
      description: 'Include the featured image in RSS?',
      defaultValue: true,
    }),
    imageTitle: PropTypes.string.tag({
      label: 'ANS image title key',
      group: 'Featured Image',
      description:
        'ANS value for associated story used for the <media:title> sitemap tag, defaults to title',
      defaultValue: 'title',
    }),
    imageCaption: PropTypes.string.tag({
      label: 'ANS image caption key',
      group: 'Featured Image',
      description:
        'ANS value for associated story image used for the <media:caption> sitemap tag, defaults to caption',
      defaultValue: 'caption',
    }),
    imageCredits: PropTypes.string.tag({
      label: 'ANS image credits key',
      group: 'Featured Image',
      description:
        'ANS value for associated story image credits for the <media:credits> sitemap tag, defaults to credits.by[].name',
      defaultValue: 'credits.by[].name',
    }),
    includeContent: PropTypes.oneOf([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'all',
    ]).tag({
      label: 'Number of paragraphs to include',
      group: 'Item',
      description: 'Number of paragraphs to include, defaults to all',
      defaultValue: '0',
    }),
  }),
}
Rss.label = 'Standard RSS'
export default Consumer(Rss)
