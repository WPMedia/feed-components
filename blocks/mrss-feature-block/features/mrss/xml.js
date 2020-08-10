import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
import moment from 'moment'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { BuildContent } from '@wpmedia/feeds-content-elements'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import { buildResizerURL } from '@wpmedia/feeds-resizer'

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
    itemCredits,
    itemCategory,
    includeContent,
    resizerURL,
    domain,
    feedTitle,
    feedLanguage,
    videoInfo,
    mrssBuildContent,
  },
) => ({
  rss: {
    '@xmlns:atom': 'http://www.w3.org/2005/Atom',
    '@version': '2.0',
    '@xmlns:media': 'http://search.yahoo.com/mrss/',
    channel: {
      title: `${channelTitle || feedTitle + ' Videos'}`,
      link: domain,
      'atom:link': {
        '@href': `${domain}${channelPath}`,
        '@rel': 'self',
        '@type': 'application/rss+xml',
      },
      description: channelDescription || feedTitle,
      pubDate: moment.utc(Date.now()).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      ...(channelLogo && {
        image: {
          url: buildResizerURL(channelLogo, resizerKey, resizerURL),
          title: `${channelTitle || feedTitle + ' Videos'}`,
          link: domain,
          width: '144',
          height: '43',
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
          ...((jmespath.search(img, imageCredits) || []).length && {
            'media:credit': {
              '@role': 'producer',
              $: jmespath.search(img, imageCredits).join(','),
            },
          }),
          ...(itemDescription && {
            description: jmespath.search(s, itemDescription),
          }),
          guid: {
            '@isPermaLink': false,
            '#': url,
          },
          referenceid: s._id,

          pubDate: moment
            .utc(s[pubDate])
            .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
          ...(img &&
            img.url && {
              'media:content': {
                '@': {
                  isDefault: 'true',
                  ...(s.duration && {
                    duration: Math.trunc(s.duration / 1000),
                  }),
                  ...(videoInfo && {
                    ...(videoInfo.url && { url: videoInfo.url }),
                    ...(videoInfo.height && { height: videoInfo.height }),
                    ...(videoInfo.width && { width: videoInfo.width }),
                    ...(videoInfo.bitrate && { bitrate: videoInfo.bitrate }),
                    ...(videoInfo.stream_type && {
                      type: videoInfo.stream_type,
                    }),
                  }),
                },
                'media:keywords': (
                  jmespath.search(s, 'taxonomy.seo_keywords[*]') || []
                ).join(','),
                ...(jmespath.search(img, imageCaption) && {
                  'media:caption': jmespath.search(img, imageCaption),
                }),
                'media:transcript': s.transcript,
                'media:category': itemCategory,
                'media:thumbnail': {
                  '@url': buildResizerURL(img.url, resizerKey, resizerURL),
                },
              },
            }),
        }
      }),
    },
  },
})

export function Mrss({ globalContent, customFields, arcSite }) {
  const {
    resizerURL = '',
    feedDomainURL = '',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)

  function MrssBuildContent() {
    BuildContent.call(this)
  }
  const mrssBuildContent = new MrssBuildContent()

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    resizerURL,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    mrssBuildContent,
  })
}

Mrss.propTypes = {
  customFields: PropTypes.shape({
    channelPath: PropTypes.string.tag({
      label: 'Path',
      group: 'Channel',
      description:
        'Path to the feed, excluding the domain, defaults to /arcio/mrss',
      defaultValue: '/arcio/mrss/',
    }),
    videoInfo: PropTypes.kvp.tag({
      label: 'Information about the video',
      group: 'Video',
      description: '',
      defaultValue: {
        url: '',
        height: '',
        width: '',
        bitrate: 5400,
        stream_type: 'mp4',
      },
    }),
    ...generatePropsForFeed('rss', PropTypes),
  }),
}
Mrss.label = 'MRSS'
export default Consumer(Mrss)
