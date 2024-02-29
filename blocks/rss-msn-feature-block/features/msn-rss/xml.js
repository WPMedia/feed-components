import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import moment from 'moment'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { BuildContent } from '@wpmedia/feeds-content-elements'
import { BuildPromoItems } from '@wpmedia/feeds-promo-items'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import { buildResizerURL } from '@wpmedia/feeds-resizer'
import URL from 'url'
import jmespath from 'jmespath'

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
    itemCredits,
    itemCategory,
    includeContent,
    promoItemsJmespath,
    requestPath,
    resizerURL,
    resizerWidth,
    resizerHeight,
    videoSelect,
    domain,
    feedTitle,
    channelLanguage,
    msnBuildContent,
    PromoItems,
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
    '@xmlns:media': 'http://search.yahoo.com/mrss/',
    '@xmlns:dcterms': 'https://purl.org/dc/terms/',

    '@version': '2.0',
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
      ...(channelLanguage &&
        channelLanguage.toLowerCase() !== 'exclude' && {
          language: channelLanguage,
        }),
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
        const url = `${domain}${s.website_url || s.canonical_url || ''}`
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
          channelTitle,
          feedTitle,
        })
        return {
          ...(itemTitle && {
            title: { $: jmespath.search(s, itemTitle) || '' },
          }),
          link: url,
          guid: {
            '@isPermaLink': false,
            '#': s._id,
          },
          ...(itemCredits &&
            (author = jmespath.search(s, itemCredits)) &&
            author.length && {
              'dc:creator': { $: author.join(', ') },
            }),
          ...(itemDescription && {
            description: { $: jmespath.search(s, itemDescription) || '' },
          }),
          pubDate: moment
            .utc(s[pubDate])
            .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
          'dcterms:modified': s.last_updated_date,
          ...(itemCategory &&
            (category = jmespath.search(s, itemCategory)) &&
            category && { category: category }),
          ...(includeContent !== 0 &&
            (body = msnBuildContent.parse(
              s.content_elements || [],
              includeContent,
              domain,
              resizerKey,
              resizerURL,
              resizerWidth,
              resizerHeight,
              videoSelect,
            )) &&
            body && {
              'content:encoded': {
                $: body,
              },
            }),
          ...(img && {
            '#': img,
          }),
        }
      }),
    },
  },
})

export function MsnRss({ globalContent, customFields, arcSite, requestUri }) {
  const {
    resizerURL = '',
    feedDomainURL = 'http://localhost.com',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)
  const channelLanguage = customFields.channelLanguage || feedLanguage
  const { width = 0, height = 0 } = customFields.resizerKVP || {}
  const requestPath = new URL.URL(requestUri, feedDomainURL).pathname

  function MsnPromoItems() {
    BuildPromoItems.call(this)

    this.mediaTag = (options) => {
      const { channelTitle, feedTitle } = options
      let imgs = this.parse(options)
      if (!imgs) return
      if (imgs && !Array.isArray(imgs)) imgs = [imgs]

      return imgs.map((img) => ({
        'media:content': {
          '@url': img.url,
          '@type': img.type,
          ...(img.duration && {
            '@duration': img.duration,
          }),
          ...(img.bitrate && {
            '@bitrate': img.bitrate,
          }),
          ...(img.height && {
            '@height': img.height,
          }),
          ...(img.width && {
            '@width': img.width,
          }),
          ...(img.filesize && {
            '@fileSize': img.filesize,
          }),
          ...(img.caption && {
            'media:description': { '@type': 'plain', $: img.caption },
          }),
          ...(img.title && {
            'media:title': { $: img.title },
          }),
          ...(img.credits && {
            'media:credit': {
              '@role': 'author',
              '@scheme': 'urn:ebu',
              '#': img.credits.join(','),
            },
          }),
          ...(img.thumbnail && {
            'media:thumbnail': {
              '@url': img.thumbnail,
            },
          }),
          'media:text': `${channelTitle || feedTitle}`,
        },
      }))
    }
  }
  const PromoItems = new MsnPromoItems()

  function MsnBuildContent() {
    BuildContent.call(this)

    this.image = (
      element,
      resizerKey,
      resizerURL,
      resizerWidth,
      resizerHeight,
    ) => {
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
                element,
              ),
              alt: element.caption || '',
              ...(element.height && {
                height: resizerHeight || element.height,
              }),
              ...(element.width && { width: resizerWidth || element.width }),
            },
          },
          ...(element.caption && { figcaption: element.caption }),
        },
      }
    }
  }

  const msnBuildContent = new MsnBuildContent()

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(globalContent.content_elements || [], {
    ...customFields,
    requestPath,
    resizerURL,
    resizerWidth: width,
    resizerHeight: height,
    domain: feedDomainURL,
    feedTitle,
    channelLanguage,
    msnBuildContent,
    PromoItems,
  })
}

MsnRss.propTypes = {
  customFields: PropTypes.shape({
    ...generatePropsForFeed('rss', PropTypes, ['includePromo']),
  }),
}

MsnRss.label = 'RSS MSN'
MsnRss.icon = 'arc-rss'
export default Consumer(MsnRss)
