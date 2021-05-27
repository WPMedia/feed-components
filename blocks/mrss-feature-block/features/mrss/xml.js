import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import moment from 'moment'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import { buildResizerURL } from '@wpmedia/feeds-resizer'
import { findVideo } from '@wpmedia/feeds-find-video-stream'

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
    selectVideo,
    resizerURL,
    resizerWidth,
    resizerHeight,
    domain,
    feedTitle,
    feedLanguage,
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
        '@href': `${domain}${channelPath}`,
        '@rel': 'self',
        '@type': 'application/rss+xml',
      },
      description: channelDescription || feedTitle,
      pubDate: moment.utc(Date.now()).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      ...(channelLogo && {
        image: {
          url: buildResizerURL(channelLogo, resizerKey, resizerURL),
          title: channelTitle || `${feedTitle} Videos`,
          link: domain,
        },
      }),

      item: elements.map((s) => {
        const url = `${domain}${s.website_url || s.canonical_url || ''}`
        const img =
          s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
        const videoStream = findVideo(s, selectVideo)
        let caption, primarySection

        return {
          title: { $: jmespath.search(s, itemTitle) || '' },
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

          'media:content': {
            '@': {
              isDefault: 'true',
              ...(s.duration && {
                duration: Math.trunc(s.duration / 1000),
              }),
              ...(videoStream && {
                ...(videoStream.url && { url: videoStream.url }),
                ...(videoStream.height && { height: videoStream.height }),
                ...(videoStream.width && { width: videoStream.width }),
                ...(videoStream.bitrate && { bitrate: videoStream.bitrate }),
                ...((videoStream.stream_type &&
                  videoStream.stream_type === 'mp4' && {
                    type: 'video/mp4',
                  }) ||
                  (videoStream.stream_type === 'ts' && {
                    type: 'video/MP2T',
                  })),
              }),
            },
            ...(itemCredits &&
              (jmespath.search(img, itemCredits) || []).length && {
                'media:credit': {
                  '@role': 'producer',
                  $: jmespath.search(img, itemCredits).join(','),
                },
              }),
            'media:keywords': (
              jmespath.search(s, 'taxonomy.seo_keywords[*]') || []
            ).join(','),
            ...((caption = jmespath.search(
              s,
              'description.basic || subheadlines.basic',
            )) &&
              caption && {
                'media:caption': {
                  $: caption,
                },
              }),
            ...(s.transcript && { 'media:transcript': s.transcript }),

            ...((primarySection = jmespath.search(
              s,
              'taxonomy.primary_section.name',
            )) &&
              primarySection && {
                'media:category': primarySection,
              }),
            ...(img &&
              img.url && {
                'media:thumbnail': {
                  '@url': buildResizerURL(
                    img.url,
                    resizerKey,
                    resizerURL,
                    resizerWidth,
                    resizerHeight,
                  ),
                },
              }),
          },
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
  const { width = 0, height = 0 } = customFields.resizerKVP || {}

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(
    jmespath.search(globalContent, 'playlistItems || content_elements || []') ||
      [],
    {
      ...customFields,
      resizerURL,
      resizerWidth: width,
      resizerHeight: height,
      domain: feedDomainURL,
      feedTitle,
      feedLanguage,
    },
  )
}

Mrss.propTypes = {
  customFields: PropTypes.shape({
    channelPath: PropTypes.string.tag({
      label: 'Path',
      group: 'Channel',
      description:
        'Path to the feed, excluding the domain, defaults to /arc/outboundfeeds/mrss',
      defaultValue: '/arc/outboundfeeds/mrss/',
    }),
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
    ...generatePropsForFeed('rss', PropTypes, ['videoSelect']),
  }),
}
Mrss.label = 'MRSS'
export default Consumer(Mrss)
