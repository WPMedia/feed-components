import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
import moment from 'moment'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { BuildContent } from '@wpmedia/feeds-content-elements'
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
    includePromo,
    includeContent,
    resizerURL,
    domain,
    feedTitle,
    feedLanguage,
    fbiaBuildContent,
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
        console.log(s._id)
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
            (body = fbiaBuildContent.parse(s, includeContent, domain)) &&
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

export function FbiaRss({ globalContent, customFields, arcSite }) {
  const {
    resizerURL = '',
    feedDomainURL = '',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)

  function FbiaBuildContent(
    domain,
    resizerKey,
    resizeWidth,
    resizeHeight,
    img,
    itemTitle,
    itemDescription,
    articleStyle,
    likesAndComments,
    adPlacement,
    adDensity,
  ) {
    BuildContent.call(this)

    this.buildHTMLHeader = (s, domain) => {
      const url = `${domain}${s.website_url || s.canonical_url}`
      return {
        link: {
          '@rel':
            (s.canonical_url && 'canonical') || (s.website_url && 'website'),
          '@href': url,
        },
        title: `${jmespath.search(s, itemTitle)}`,
        meta: [
          {
            '@property': 'og:title',
            '@content': `${jmespath.search(s, itemTitle)}`,
          },
          {
            '@property': 'og:url',
            '@content': url,
          },
          {
            '@property': 'og:description',
            '@content': `${jmespath.search(s, itemDescription)}`,
          },
          adPlacement.toLowerCase().startsWith('enable')
            ? {
                '@property': 'fb:use_automatic_ad_placement',
                '@content':
                  'enable=true ' + 'ad_density=' + (adDensity || 'default'),
              }
            : {
                '@property': 'fb:use_automatic_ad_placement',
                '@content': 'enable=false',
              },
          {
            '@property': 'op:markup_version', //The version of Instant Articles markup format being used by this article.
            '@content': 'v1.0',
          },
          {
            '@property': 'fb:article_style',
            '@content': articleStyle || 'default',
          },
          {
            '@property': 'og:image',
            '@content':
              (img && buildResizerURL(img.url, resizerKey, resizerURL)) || '',
          },
          {
            '@property': 'fb:likes_and_comments',
            '@content': likesAndComments || 'disable',
          },
        ],
      }
    }
    this.buildHTMLBody = (s, numRows, domain) => {
      let author
      return {
        article: {
          header: {
            h1: `${jmespath.search(s, itemTitle)}`,
            h2: `${jmespath.search(s, itemDescription)}`,
            time: [
              {
                '@': {
                  datetime:
                    moment.utc(new Date()).format('YYYY-MM-DDThh:mm:ss.mmm') +
                    'Z',
                  class: 'op_modified',
                },
                '#':
                  moment.utc(new Date()).format('YYYY-MM-DDThh:mm:ss.mmm') +
                  'Z',
              },
              {
                '@datetime':
                  moment
                    .utc(s[customFields.pubDate])
                    .format('YYYY-MM-DDThh:mm:ss.mmm') + 'Z',
                '@class': 'op_published',
                '#':
                  moment
                    .utc(s[customFields.pubDate])
                    .format('YYYY-MM-DDThh:mm:ss.mmm') + 'Z',
              },
            ],
            address: {
              //a list of authors
              ...((author = jmespath.search(s, 'credits.by[].name')) &&
                author && {
                  a: author.map((s) => s.toUpperCase()),
                }),
            },
            ...(customFields.includePromo && {
              figure: {
                '@class': 'fb-feed-cover',
                img: {
                  '@src': buildResizerURL(
                    customFields.url,
                    customFields.resizerKey,
                    customFields.resizerURL,
                  ),
                },
                ...(customFields.imageCaption && {
                  figcaption: {
                    '@class': 'op-vertical-below op-small',
                    '#': {
                      '#': customFields.imageCaption,
                      cite: {
                        '@class': 'op-small',
                        ...((
                          jmespath.search(img, customFields.imageCredits) || []
                        ).length && {
                          '#': jmespath
                            .search(img, customFields.imageCredits)
                            .join(','),
                        }),
                      },
                    },
                  },
                }),
              },
            }),
          },
        },
        '#': this.buildContentElements(s, numRows, domain),
        footer: {
          small:
            customFields.channelCopyright ||
            '© ' + moment.utc(new Date()).year() + ' ' + feedTitle,
        },
      }
    }
    this.buildContentElements = (s, numRows, domain) => {
      let item
      const body = []
      const maxRows = numRows === 'all' ? 9999 : parseInt(numRows)
      body.push()
      s.content_elements.map((element) => {
        if (body.length <= maxRows) {
          switch (element.type) {
            case 'blockquote':
              item = this.blockquote(element)
              break
            case 'correction':
              item = this.correction(element)
              break
            case 'code':
            case 'custom_embed':
            case 'divider':
            case 'element_group':
            case 'story':
              item = ''
              break
            case 'endorsement':
              item = this.endorsement(element)
              break
            case 'gallery':
              item = this.gallery(
                element,
                resizerKey,
                resizerURL,
                resizeWidth,
                resizeHeight,
              )
              break
            case 'header':
              item = this.header(element)
              break
            case 'image':
              item = this.image(
                element,
                resizerKey,
                resizerURL,
                resizeWidth,
                resizeHeight,
              )
              break
            case 'interstitial_link':
              item = this.interstitial(element, domain)
              break
            case 'link_list':
              item = this.linkList(element, domain)
              break
            case 'list':
              item = this.list(element)
              break
            case 'list_element':
              item = this.listElement(element)
              break
            case 'numeric_rating':
              item = this.numericRating(element)
              break
            case 'oembed_response':
              item = this.oembed(element)
              break
            case 'quote':
              item = this.quote(element)
              break
            case 'raw_html':
              item = this.text(element)
              break
            case 'table':
              item = this.table(element)
              break
            case 'text':
              item = this.text(element)
              break
            case 'video':
              item = this.video(element)
              break
            default:
              item = this.text(element)
              break
          }

          // empty array breaks xmlbuilder2, but empty '' is OK
          if (Array.isArray(item) && item.length === 0) {
            item = ''
          }

          console.log(item)
          item && body.push(item)
        }
      })
      return body.length ? body : ['']
    }
    this.image = (element, resizerKey, resizerURL) => {
      let credits = jmespath.search(element, 'credits.by[].name') || []
      return {
        figure: {
          img: {
            '@': {
              src: buildResizerURL(element.url, resizerKey, resizerURL),
            },
          },
          ...(element.caption && {
            figcaption: {
              '@class': 'op-vertical-below op-small',
              '#': {
                '#': element.caption,
                cite: {
                  '@class': 'op-small',
                  ...(credits.length && {
                    '#': '(' + credits.join(',') + ')',
                  }),
                },
              },
            },
          }),
        },
      }
    }
    this.text = (element) => {
      // handle text, raw_html
      // all have a string in element.content
      // this is also used by buildContentQuote
      let item
      if (element.content && typeof element.content === 'string') {
        item = {
          p: {
            '@id': element._id,
            '#': element.content,
          },
        }
      }
      return item
    }
    this.parse = (s, numRows, domain) => {
      const fbiaContent = {
        html: {
          '@lang': feedLanguage,
          head: this.buildHTMLHeader(s, domain),
          body: this.buildHTMLBody(s, numRows, domain),
        },
      }
      return '<!doctype html>'.concat(fragment(fbiaContent).toString())
    }
  }

  const fbiaBuildContent = new FbiaBuildContent(
    customFields.domain,
    customFields.resizerKey,
    customFields.resizeWidth,
    customFields.resizeHeight,
    customFields.img,
    customFields.itemTitle,
    customFields.itemDescription,
    customFields.articleStyle,
    customFields.likesAndComments,
    customFields.adPlacement,
    customFields.adDensity,
  )

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    resizerURL,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    fbiaBuildContent,
  })
}
//Reference for fb options: https://developers.facebook.com/docs/instant-articles/reference/article/
FbiaRss.propTypes = {
  customFields: PropTypes.shape({
    channelPath: PropTypes.string.tag({
      label: 'Path',
      group: 'Channel',
      description:
        'Path to the feed excluding the domain, defaults to /arcio/fb-ia',
      defaultValue: '/arcio/fb-ia',
    }),
    articleStyle: PropTypes.string.tag({
      label: 'Article Style',
      group: 'Facebook Options',
      description:
        'This parameter is optional and your default style is applied to this article if you do not specify an article style in your markup',
      defaultValue: 'default',
    }),
    likesAndComments: PropTypes.string.tag({
      label: 'Likes and Comments',
      group: 'Facebook Options',
      description: 'Enable or disable',
      defaultValue: 'disable',
    }),
    adPlacement: PropTypes.string.tag({
      label: 'Auto Ad Placement',
      group: 'Facebook Options',
      description:
        'Enables automatic placement of ads within this article. This parameter is optional and defaults to false if you do not specify',
      defaultValue: 'false',
    }),
    adDensity: PropTypes.string.tag({
      label: 'Ad Density',
      group: 'Facebook Options',
      description:
        'How frequently you would like ads to appear in your article: default (<250 word gap), medium (350 word gap), low (>450 word gap)',
      defaultValue: 'default',
    }),
    ...generatePropsForFeed('rss', PropTypes, ['channelPath', 'includePromo']),
  }),
}

FbiaRss.label = 'Facebook IA RSS'
export default Consumer(FbiaRss)
