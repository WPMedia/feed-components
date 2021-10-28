/* eslint-disable camelcase */
import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import moment from 'moment'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { BuildContent } from '@wpmedia/feeds-content-elements'
import { BuildPromoItems } from '@wpmedia/feeds-promo-items'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import { buildResizerURL } from '@wpmedia/feeds-resizer'
import { convert, fragment } from 'xmlbuilder2'
import URL from 'url'
const jmespath = require('jmespath')

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
    itemCredits,
    pubDate,
    itemCategory,
    includePromo,
    includeContent,
    videoSelect,
    requestPath,
    resizerURL,
    resizerWidth,
    resizerHeight,
    domain,
    feedTitle,
    feedLanguage,
    promoItemsJmespath = 'promo_items.basic || promo_items.lead_art',
    PromoItems,
    fbiaBuildContent,
  },
) => ({
  rss: {
    '@xmlns:atom': 'http://www.w3.org/2005/Atom',
    '@xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
    ...(itemCredits && {
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    }),
    ...(channelUpdatePeriod &&
      channelUpdatePeriod !== 'Exclude field' && {
        '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
      }),
    '@version': '2.0',
    ...(includePromo && {
      '@xmlns:media': 'http://search.yahoo.com/mrss/',
    }),
    channel: {
      title: { $: channelTitle || feedTitle },
      link: `${domain}`,
      'atom:link': {
        '@href': `${domain}${requestPath}`,
        '@rel': 'self',
        '@type': 'application/rss+xml',
      },
      description: { $: channelDescription || `${feedTitle} News Feed` },
      lastBuildDate: moment
        .utc(new Date())
        .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      ...(feedLanguage && { language: feedLanguage }),
      ...(channelCategory && { category: channelCategory }),
      ...(channelCopyright && {
        copyright: channelCopyright,
      }), // TODO Add default logic
      ...(channelTTL && { ttl: channelTTL }),
      ...(channelUpdatePeriod &&
        channelUpdatePeriod !== 'Exclude field' && {
          'sy:updatePeriod': channelUpdatePeriod,
        }),
      ...(channelUpdateFrequency &&
        channelUpdatePeriod !== 'Exclude field' && {
          'sy:updateFrequency': channelUpdateFrequency,
        }),
      ...(channelLogo && {
        image: {
          url: buildResizerURL(channelLogo, resizerKey, resizerURL),
          title: channelTitle || feedTitle,
          link: domain,
        },
      }),

      item: elements.map((s) => {
        let author, body, category
        const url = `${domain}${s.website_url || s.canonical_url}`
        const img = PromoItems.mediaTag({
          ans: s,
          promoItemsJmespath,
          resizerKey,
          resizerURL,
          resizerWidth,
          resizerHeight,
          imageTitle,
          imageCaption,
          imageCredits,
          videoSelect,
        })
        return {
          ...(itemTitle && {
            title: { $: jmespath.search(s, itemTitle) || '' },
          }),
          link: url,
          guid: {
            '#': url,
            '@isPermaLink': true,
          },
          ...(itemCredits &&
            (author = jmespath.search(s, itemCredits) || []) &&
            author.length && {
              'dc:creator': { $: author.join(', ') },
            }),
          ...(itemDescription && {
            description: { $: jmespath.search(s, itemDescription) || '' },
          }),
          pubDate: moment
            .utc(s[pubDate])
            .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
          ...(itemCategory &&
            (category = jmespath.search(s, itemCategory)) &&
            category && { category: category }),
          ...(includeContent !== 0 &&
            (body = fbiaBuildContent.buildFBContent(
              s,
              includeContent,
              domain,
              resizerWidth,
              resizerHeight,
              itemCredits,
              videoSelect,
            )) &&
            body && {
              'content:encoded': {
                $: body,
              },
            }),
          ...(includePromo &&
            img && {
              '#': img,
            }),
        }
      }),
    },
  },
})

export function FbiaRss({ globalContent, customFields, arcSite, requestUri }) {
  const {
    resizerURL = '',
    feedDomainURL = 'http://localhost.com',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)
  const { width = 0, height = 0 } = customFields.resizerKVP || {}
  const requestPath = new URL.URL(requestUri, feedDomainURL).pathname
  let metaTags
  try {
    metaTags =
      customFields.metaTags &&
      convert(customFields.metaTags, { format: 'object' })
  } catch {
    metaTags = ''
  }

  function FbiaBuildContent({
    itemTitle,
    itemDescription,
    articleStyle,
    likesAndComments,
    metaTags,
    adPlacement,
    adDensity,
    placementSection,
    iframeHxW = {},
    raw_html_processing = 'exclulde',
  }) {
    BuildContent.call(this)

    this.buildHTMLHead = (s, domain, resizerWidth, resizerHeight) => {
      const img =
        s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
      const url = `${domain}${s.website_url || s.canonical_url || ''}`
      const title = (itemTitle && jmespath.search(s, itemTitle)) || ''
      return {
        link: {
          '@rel': 'canonical',
          '@href': url,
        },
        title: title,
        meta: [
          {
            '@property': 'og:title',
            '@content': title,
          },
          {
            '@property': 'og:url',
            '@content': url,
          },
          {
            '@property': 'og:description',
            '@content': jmespath.search(s, itemDescription || '_blank') || '',
          },
          {
            '@property': 'fb:use_automatic_ad_placement',
            '@content': adPlacement.toLowerCase().startsWith('enable')
              ? `enable=true ad_density=${adDensity || 'default'}`
              : 'enable=false',
          },
          {
            // The version of Instant Articles markup format being used by this article.
            '@property': 'op:markup_version',
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
        ...(metaTags && { '#': metaTags }),
      }
    }
    this.buildHTMLBody = (
      s,
      numRows,
      domain,
      resizerWidth,
      resizerHeight,
      itemCredits,
    ) => {
      const authorDescription = (
        jmespath.search(s, 'credits.by[].description') || []
      ).filter((i) => i)
      const lastUpdatedDate = jmespath.search(s, 'last_updated_date')
      const image =
        s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
      const primarySite =
        jmespath.search(s, 'taxonomy.primary_section.name') || ''
      const header = []
      let description, author
      const adScripts = customFields.adScripts || ''
      if (placementSection)
        header.push({
          section: {
            '@class': 'op-ad-template',
            '#': [placementSection],
          },
        })

      header.push({ h1: jmespath.search(s, itemTitle || '_blank') || '' })

      if (
        itemDescription &&
        (description = jmespath.search(s, itemDescription)) &&
        description
      )
        header.push({ h2: description })

      header.push({
        time: [
          {
            '@': {
              datetime: lastUpdatedDate,
              class: 'op-modified',
            },
            '#': lastUpdatedDate,
          },
          {
            '@datetime': s[customFields.pubDate],
            '@class': 'op-published',
            '#': s[customFields.pubDate],
          },
        ],
      })

      if (
        itemCredits &&
        (author = jmespath.search(s, itemCredits) || []) &&
        author.length
      )
        header.push({
          address: {
            // a list of authors
            a: author.map((s) => s.toUpperCase()),
          },
        })
      if (customFields.includePromo && image && image.url)
        header.push({
          figure: {
            '@class': 'fb-feed-cover',
            img: {
              '@src': buildResizerURL(
                image.url,
                resizerKey,
                resizerURL,
                resizerWidth,
                resizerHeight,
              ),
            },
            ...(customFields.imageCaption &&
              jmespath.search(image, customFields.imageCaption) && {
                figcaption: {
                  '@class': 'op-vertical-below op-small',
                  '#': `${jmespath.search(image, customFields.imageCaption)}`,
                  ...((
                    jmespath.search(
                      image,
                      customFields.imageCredits || '_blank',
                    ) || []
                  ).length && {
                    cite: {
                      '@class': 'op-small',
                      '#': jmespath
                        .search(image, customFields.imageCredits)
                        .join(','),
                    },
                  }),
                },
              }),
          },
        })
      if (primarySite.length)
        header.push({
          h2: {
            '@class': 'op-kicker',
            '#': primarySite,
          },
        })
      return {
        article: {
          header: {
            '#': header,
          },
          '#': ['<tHe_BoDy_GoEs_HeRe/>', ...(adScripts && [adScripts])],
          footer: {
            '#': {
              ...(authorDescription.length && {
                aside: authorDescription.join(','),
              }),
              small:
                customFields.channelCopyright ||
                '© ' + moment.utc(new Date()).year() + ' ' + feedTitle,
            },
          },
        },
      }
    }

    this.image = (
      element,
      resizerKey,
      resizerURL,
      resizerWidth,
      resizerHeight,
    ) => {
      const credits = jmespath.search(element, 'credits.by[].name') || []
      return {
        figure: {
          img: {
            '@': {
              src: buildResizerURL(
                element.url,
                resizerKey,
                resizerURL,
                resizerWidth,
                resizerHeight,
              ),
            },
          },
          ...(element.caption && {
            figcaption: {
              '@class': 'op-vertical-below op-small',
              '#': {
                '#': element.caption,
                ...(credits.length && {
                  cite: {
                    '@class': 'op-small',
                    '#': '(' + credits.join(',') + ')',
                  },
                }),
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
      const { width = 0, height = 0 } = iframeHxW
      if (element.content && typeof element.content === 'string') {
        if (element.type === 'raw_html') {
          switch (raw_html_processing) {
            case 'wrap':
              item = {
                figure: {
                  '@class': 'op-interactive',
                  iframe: {
                    ...(width && { '@width': width }),
                    ...(height && { '@height': height }),
                    '#': element.content,
                  },
                },
              }
              break
            case 'include':
              item = {
                '#': element.content,
              }
              break
          }
        } else {
          item = {
            p: {
              '@id': element._id,
              '#': element.content,
            },
          }
        }
      }
      return item
    }
    // noinspection SpellCheckingInspection
    this.oembed = (element) => {
      const embed = element.raw_oembed.html // wrap in <figure class="op-interactive">
      const { width = 0, height = 0 } = iframeHxW

      return {
        figure: {
          '@class': 'op-interactive',
          iframe: {
            ...(width && { '@width': width }),
            ...(height && { '@height': height }),
            '#': embed,
          },
        },
      }
    }
    this.header = (element) => {
      let item
      if (element.content && typeof element.content === 'string') {
        item = {}
        item[`h${element.level ? (element.level < 2 ? 1 : 2) : 1}`] =
          element.content
      }
      return item
    }

    this.table = (element) => {
      const header = []
      const rows = []
      let row

      element.header &&
        element.header.forEach((headerItem) => {
          header.push(headerItem.content)
        })

      element.rows &&
        element.rows.forEach((tableRows) => {
          row = []
          tableRows.forEach((rowItem) => {
            row.push(rowItem.content)
          })
          rows.push({ tr: { td: row } })
        })

      return {
        figure: {
          table: {
            thead: { tr: { th: header } },
            tbody: { '#': rows },
          },
        },
      }
    }

    this.buildFBContent = (
      s,
      numRows,
      domain,
      resizerWidth,
      resizerHeight,
      itemCredits,
      videoSelect,
    ) => {
      const fbiaContent = {
        html: {
          '@lang': feedLanguage,
          head: this.buildHTMLHead(s, domain, resizerWidth, resizerHeight),
          body: this.buildHTMLBody(
            s,
            numRows,
            domain,
            resizerWidth,
            resizerHeight,
            itemCredits,
            videoSelect,
          ),
        },
      }
      // breaking these up because I'm
      // seeing xml validation fail on <br> without a closing slash
      const htmlBody = '<!doctype html>'.concat(
        fragment(fbiaContent).toString(),
      )
      const parsedBody = this.parse(
        s.content_elements ?? [],
        numRows,
        domain,
        resizerKey,
        resizerURL,
        resizerWidth,
        resizerHeight,
        videoSelect,
      )
      return htmlBody.replace('<tHe_BoDy_GoEs_HeRe/>', parsedBody)
    }
  }

  const fbiaBuildContent = new FbiaBuildContent({
    ...customFields,
    metaTags,
  })

  const PromoItems = new BuildPromoItems()

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(globalContent.content_elements || [], {
    ...customFields,
    requestPath,
    resizerURL,
    resizerWidth: width,
    resizerHeight: height,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    fbiaBuildContent,
    PromoItems,
  })
}
// Reference for fb options: https://developers.facebook.com/docs/instant-articles/reference/article/
FbiaRss.propTypes = {
  customFields: PropTypes.shape({
    articleStyle: PropTypes.string.tag({
      label: 'Article Style',
      group: 'Facebook Options',
      description:
        'This parameter is optional and your default style is applied to this article if you do not specify an article style in your markup',
      defaultValue: 'default',
    }),
    likesAndComments: PropTypes.oneOf(['enable', 'disable']).tag({
      defaultValue: 'disable',
      name: 'Likes and Comments',
      group: 'Facebook Options',
      description: 'Enable or disable likes and comments on the article',
    }),
    metaTags: PropTypes.string.tag({
      label: 'Additional meta tags',
      group: 'Facebook Options',
      description:
        'Enter additonal meta tags here in the format <meta property="prop" content="content"/> ',
      defaultValue: '',
    }),
    adPlacement: PropTypes.oneOf(['enable', 'disable']).tag({
      name: 'Auto Ad Placement',
      group: 'Facebook Options',
      description:
        'Enables automatic placement of ads within this article. Only enable this option if you configure an ad.',
      defaultValue: 'disable',
    }),
    adDensity: PropTypes.oneOf(['default', 'medium', 'low']).tag({
      name: 'Ad Density',
      group: 'Facebook Options',
      description:
        'How frequently you would like ads to appear in your article: default (<250 word gap), medium (350 word gap), low (>450 word gap)',
      defaultValue: 'default',
    }),
    placementSection: PropTypes.string.tag({
      label: 'Facebook Ad',
      group: 'Facebook Options',
      description:
        'Enter Javascript that goes between <section class="op-ad-template"></section> in beginning of the body\'s header for recirculation ads that come from Facebook advertisers; leave blank if not used.',
      defaultValue: '',
    }),
    adScripts: PropTypes.string.tag({
      label: 'Analytic Scripts',
      group: 'Facebook Options',
      description:
        'Javascript wrapped in the <figure class=‘op-tracker’> tag can be added to the article for ads and analytics. Multiple scripts can be included, usually each in the own iframe',
      defaultValue: '',
    }),
    iframeHxW: PropTypes.kvp.tag({
      label: 'oembed iframe height and width',
      group: 'Facebook Options',
      description: 'Height and/or width to use in oembed iframes',
      defaultValue: {
        width: 0,
        height: 0,
      },
    }),
    raw_html_processing: PropTypes.oneOf(['exclude', 'include', 'wrap']).tag({
      label: {
        exclude: 'raw_html elements',
        include: 'raw_html elements',
        wrap: 'wrap in <figure class="op-interactive"> <iframe>',
      },
      group: 'Facebook Options',
      description:
        'Should raw_html elements be excluded, included or wrapped in <figure class="op-interactive"> <iframe> tags. default exclude',
      defaultValue: 'exclude',
    }),
    ...generatePropsForFeed('rss', PropTypes),
  }),
}

FbiaRss.label = 'RSS FBIA'
export default Consumer(FbiaRss)
