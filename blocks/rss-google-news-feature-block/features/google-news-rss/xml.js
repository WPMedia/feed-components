import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
import moment from 'moment'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import {
  buildContentCorrection,
  buildContentEndorsement,
  buildContentGallery,
  buildContentLinkList,
  buildContentList,
  buildContentListElement,
  buildContentNumericRating,
  buildContentTable,
  buildContentText,
  buildContentInterstitial,
  buildContentOembed,
  buildContentQuote,
  buildContentVideo,
} from '@wpmedia/feeds-content-elements'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import { buildResizerURL } from '@wpmedia/feeds-resizer'
import { fragment } from 'xmlbuilder2'

const jmespath = require('jmespath')

const rssTemplate = (
  elements,
  {
    channelTitle,
    channelDescription,
    channelPath,
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
    '@xmlns:media': 'http://search.yahoo.com/mrss/',
    '@version': '2.0',
    channel: {
      title: `${channelTitle || feedTitle}`,
      link: `${domain}`,
      'atom:link': {
        '@href': `${domain}${channelPath}`,
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
          url: buildResizerURL(channelLogo, resizerKey, resizerURL),
          title: `${channelTitle || feedTitle}`,
          link: `${domain}`,
        },
      }),

      item: elements.map((s) => {
        let author, body, category
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
          ...(itemCategory &&
            (category = jmespath.search(s, itemCategory)) &&
            category && { category: category }),
          ...(includeContent !== '0' &&
            (body = buildContent(
              s.content_elements,
              includeContent,
              domain,
              resizerKey,
              resizerURL,
            )) &&
            body && {
              'content:encoded': {
                $: body,
              },
            }),
          ...(img &&
            img.url && {
              'media:content': {
                '@type': 'image/jpeg',
                '@url': buildResizerURL(img.url, resizerKey, resizerURL),
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

export function GoogleNewsRss({ globalContent, customFields, arcSite }) {
  const {
    resizerURL = '',
    feedDomainURL = '',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)

  const buildContent = (
    contentElements,
    numRows,
    domain,
    resizerKey,
    resizerURL,
  ) => {
    let item
    const body = []
    const maxRows = numRows === 'all' ? 9999 : parseInt(numRows)
    contentElements.map((element) => {
      if (body.length <= maxRows) {
        switch (element.type) {
          case 'blockquote':
            item = buildContentText(element)
            break
          case 'correction':
            item = buildContentCorrection(element)
            break
          case 'code':
          case 'custom_embed':
          case 'divider':
          case 'element_group':
          case 'story':
            item = ''
            break
          case 'endorsement':
            item = buildContentEndorsement(element)
            break
          case 'gallery':
            item = buildContentGallery(element, resizerKey, resizerURL)
            break
          case 'header':
            item = buildContentText(element)
            break
          case 'image':
            item = buildContentImage(element, resizerKey, resizerURL)
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
            item = buildContentNumericRating(element)
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

        // empty array breaks xmlbuilder2, but empty '' is OK
        if (Array.isArray(item) && item.length === 0) {
          item = ''
        }
        item && body.push(item)
      }
    })
    return body.length ? fragment(body).toString() : ''
  }

  const buildContentImage = (element, resizerKey, resizerURL) => {
    return {
      figure: {
        img: {
          '@': {
            src: buildResizerURL(element.url, resizerKey, resizerURL),
            alt: element.caption || '',
            ...(element.height && { height: element.height }),
            ...(element.width && { width: element.width }),
          },
        },
        ...(element.caption && { figcaption: element.caption }),
      },
    }
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

GoogleNewsRss.propTypes = {
  customFields: PropTypes.shape({
    channelPath: PropTypes.string.tag({
      label: 'Path',
      group: 'Channel',
      description:
        'Path to the feed excluding the domain, defaults to /arcio/google-news-feed',
      defaultValue: '/arcio/google-news-feed/',
    }),
    ...generatePropsForFeed('rss', PropTypes, ['channelPath', 'includePromo']),
  }),
}

GoogleNewsRss.label = 'Google News RSS'
export default Consumer(GoogleNewsRss)
