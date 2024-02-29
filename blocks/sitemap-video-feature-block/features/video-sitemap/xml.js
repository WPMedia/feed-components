import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { buildResizerURL } from '@wpmedia/feeds-resizer'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import { findVideo } from '@wpmedia/feeds-find-video-stream'
import jmespath from 'jmespath'

const sitemapTemplate = (
  elements,
  {
    lastMod,
    promoItemsJmespath = 'promo_items.basic || promo_items.lead_art',
    videoDescription,
    sitemapVideoSelect,
    videoTitle,
    domain,
    resizerURL,
    resizerWidth,
    resizerHeight,
  },
) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    '@xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1',
    url: elements.map((v) => {
      let title, description, category
      // Get promo image object to determine thumbnail_loc
      let img = promoItemsJmespath && jmespath.search(v, promoItemsJmespath)
      if (img && !img.url && img.promo_image) img = img.promo_image // video
      // Find content_loc based on searchObject site property.
      const contentLoc = findVideo(v, sitemapVideoSelect)

      return {
        loc: `${domain}${v.website_url || v.canonical_url}`,
        'video:video': {
          ...(contentLoc && { 'video:content_loc': contentLoc.url }),
          ...(v.duration && {
            'video:duration': Math.trunc(v.duration / 1000),
          }),
          ...(img &&
            img.url && {
              'video:thumbnail_loc': buildResizerURL(
                img.url,
                resizerKey,
                resizerURL,
                resizerWidth,
                resizerHeight,
                img,
              ),
            }),
          ...(videoTitle &&
            (title = jmespath.search(v, videoTitle)) &&
            title && {
              'video:title': { $: title },
            }),
          ...(videoDescription &&
            (description = jmespath.search(v, videoDescription)) &&
            description && {
              'video:description': {
                $: description,
              },
            }),
          ...((category = jmespath.search(
            v,
            'taxonomy.primary_section.name',
          )) &&
            category && {
              'video:category': category,
            }),
        },
        ...{ lastmod: v[lastMod] },
      }
    }),
  },
})

export function VideoSitemap({ globalContent, customFields, arcSite }) {
  const { resizerURL = '', feedDomainURL = '' } = getProperties(arcSite)
  const { width = 0, height = 0 } = customFields.resizerKVP || {}

  // can't return null for xml return type, must return valid xml template
  return sitemapTemplate(globalContent.content_elements || [], {
    ...customFields,
    domain: feedDomainURL,
    resizerURL,
    resizerWidth: width,
    resizerHeight: height,
  })
}

VideoSitemap.propTypes = {
  customFields: PropTypes.shape({
    videoTitle: PropTypes.string.tag({
      label: 'Video Title',
      group: 'Format',
      description:
        'Which ANS field should be used for the title.  Defaults to headlines.basic',
      defaultValue: 'headlines.basic',
    }),
    videoDescription: PropTypes.string.tag({
      label: 'Description',
      group: 'Format',
      description:
        'Which ANS field should be used for the description. Defaults to description.basic || subheadlines.basic',
      defaultValue: 'description.basic || subheadlines.basic',
    }),
    sitemapVideoSelect: PropTypes.kvp.tag({
      label: 'Video Encoding',
      group: 'Format',
      description: 'Which criteria should be used to filter video encodings',
      defaultValue: { bitrate: 5400, stream_type: 'mp4' },
    }),
    ...generatePropsForFeed('sitemap', PropTypes, ['videoSelect']),
  }),
}
VideoSitemap.label = 'Sitemap Video'
VideoSitemap.icon = 'browser-page-hierarchy'
export default Consumer(VideoSitemap)
