import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import moment from 'moment'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { BuildPromoItems } from '@wpmedia/feeds-promo-items'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import { buildResizerURL } from '@wpmedia/feeds-resizer'
import URL from 'url'

const jmespath = require('jmespath')

const rssTemplate = (
  elements,
  {
    channelTitle,
    channelDescription,
    channelLogo,
    imageTitle,
    imageCaption,
    imageCredits,
    itemTitle,
    itemDescription,
    pubDate,
    requestPath,
    promoItemsJmespath,
    selectVideo,
    resizerURL,
    resizerWidth,
    resizerHeight,
    domain,
    feedTitle,
    channelLanguage,
    PromoItems,
  },
) => ({
  rss: {
    '@xmlns:atom': 'http://www.w3.org/2005/Atom',
    '@version': '2.0',
    '@xmlns:media': 'http://search.yahoo.com/mrss/',
    channel: {
      title: channelTitle || `${feedTitle} Videos`,
      link: domain,
      'atom:link': {
        '@href': `${domain}${requestPath}`,
        '@rel': 'self',
        '@type': 'application/rss+xml',
      },
      description: channelDescription || feedTitle,
      pubDate: moment.utc(Date.now()).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      ...(channelLanguage &&
        channelLanguage.toLowerCase() !== 'exclude' && {
          language: channelLanguage,
        }),
      ...(channelLogo && {
        image: {
          url: buildResizerURL(channelLogo, resizerKey, resizerURL),
          title: channelTitle || `${feedTitle} Videos`,
          link: domain,
        },
      }),

      item: elements.map((s) => {
        const url = `${domain}${s.website_url || s.canonical_url || ''}`
        const img = PromoItems.mediaTag({
          ans: s,
          promoItemsJmespath: '@',
          resizerKey,
          resizerURL,
          resizerWidth,
          resizerHeight,
          imageTitle,
          imageCaption,
          imageCredits,
          videoSelect: selectVideo,
        })

        return {
          ...(itemTitle && {
            title: { $: jmespath.search(s, itemTitle) || '' },
          }),
          link: url,
          ...(itemDescription && {
            description: { $: jmespath.search(s, itemDescription) || '' },
          }),
          guid: {
            '@isPermaLink': false,
            '#': url,
          },
          referenceid: s._id,
          pubDate: moment
            .utc(s[pubDate])
            .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
          '#': img,
        }
      }),
    },
  },
})

export function Mrss({ globalContent, customFields, arcSite, requestUri }) {
  const {
    resizerURL = '',
    feedDomainURL = 'http://localhost.com',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)
  const channelLanguage = customFields.channelLanguage || feedLanguage
  const { width = 0, height = 0 } = customFields.resizerKVP || {}
  const requestPath = new URL.URL(requestUri, feedDomainURL).pathname

  function MrssPromoItems() {
    /*
    Using feeds-promo-items to generate the media:content tag
    hard coded promoItemsJmespath:@ so it matches the entire
    ANS instead of it just looking at promo_items.basic

    Added primary_section, category and @isDefault  
    */
    BuildPromoItems.call(this)

    this.mediaTag = (options) => {
      const { ans } = options
      let primarySection
      let imgs = this.parse(options)
      if (!imgs) return
      if (imgs && !Array.isArray(imgs)) imgs = [imgs]

      return imgs.map((img) => ({
        'media:content': {
          '@isDefault': 'true',
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
          'media:keywords': (
            jmespath.search(ans, 'taxonomy.seo_keywords[*]') || []
          ).join(','),
          ...(ans.transcript && { 'media:transcript': ans.transcript }),
          ...((primarySection = jmespath.search(
            ans,
            'taxonomy.primary_section.name',
          )) &&
            primarySection && {
              'media:category': primarySection,
            }),
        },
      }))
    }
  }
  const PromoItems = new MrssPromoItems()

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(
    jmespath.search(globalContent, 'playlistItems || content_elements || []') ||
      [],
    {
      ...customFields,
      requestPath,
      resizerURL,
      resizerWidth: width,
      resizerHeight: height,
      domain: feedDomainURL,
      feedTitle,
      channelLanguage,
      PromoItems,
    },
  )
}

Mrss.propTypes = {
  customFields: PropTypes.shape({
    selectVideo: PropTypes.kvp.tag({
      label: 'Select video using',
      group: 'Video',
      description:
        'This criteria is used to filter videos encoded in the streams array',
      defaultValue: {
        bitrate: 5400,
        stream_type: 'mp4',
      },
    }),
    ...generatePropsForFeed('rss', PropTypes, [
      'videoSelect',
      'channelCopyright',
      'channelTTL',
      'channelUpdatePeriod',
      'channelUpdateFrequency',
      'channelCategory',
      'itemCredits',
      'itemCategory',
      'includeContent',
      'promoItemsJmespath',
    ]),
  }),
}
Mrss.label = 'MRSS'
Mrss.icon = 'arc-rss'
export default Consumer(Mrss)
