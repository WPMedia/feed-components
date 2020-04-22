import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import buildURL from '../resizerUrl'
import formatSearchObject from '../searchHelper'
const jmespath = require('jmespath')

const sitemapTemplate = (
  elements,
  {
    lastMod,
    videoKeywords,
    videoTitle,
    domain,
    sitemapVideoSelect,
    resizerURL,
  },
) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    '@xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1',
    url: elements.map((v) => {
      // Get promo image object to determine thumbnail_loc
      const img =
        v.promo_items && (v.promo_items.basic || v.promo_items.lead_art)

      // Based on VideoKeywords customField determine what should be used as a value for keywords
      let keywords
      if (videoKeywords === 'tags') {
        keywords = (jmespath.search(v, 'taxonomy.tags[*].text') || []).join(',')
      } else {
        keywords = (jmespath.search(v, 'taxonomy.seo_keywords[*]') || []).join(
          ',',
        )
      }

      // Set video title
      const title = jmespath.search(v, videoTitle)

      // Find content_loc based on searchObject site property.
      const searchArray = formatSearchObject(sitemapVideoSelect)

      let contentLoc = jmespath.search(
        v,
        `streams[?${searchArray.join('&&')}]`,
      )[0]

      contentLoc = contentLoc ? contentLoc.url : ''

      return {
        loc: `${domain}${v.website_url || v.canonical_url}`,
        'video:video': {
          ...(contentLoc && { 'video:content_loc': contentLoc }),
          ...(v.duration && { 'video:duration': v.duration / 1000 }),
          ...(img &&
            img.url && {
              'video:thumbnail_loc': buildURL(img.url, resizerKey, resizerURL),
            }),
          ...(title && {
            'video:title': { $: title },
          }),
          ...(v.description ||
            (v.subheadlines &&
              v.subheadlines.basic && {
                'video:description': {
                  $: v.description || v.subheadlines.basic,
                },
              })),
          ...(keywords && {
            'video:tags': { $: keywords },
          }),
          ...(v.taxonomy &&
            v.taxonomy.primary_section &&
            v.taxonomy.primary_section.name && {
              'video:category': v.taxonomy.primary_section.name,
            }),
        },
        ...{ lastmod: v[lastMod] },
      }
    }),
  },
})

export function VideoSitemap({ globalContent, customFields, arcSite }) {
  const {
    resizerURL = '',
    feedDomainURL = '',
    sitemapVideoSelect = { bitrate: 5400, stream_type: 'mp4' },
  } = getProperties(arcSite)

  // can't return null for xml return type, must return valid xml template
  return sitemapTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    domain: feedDomainURL,
    sitemapVideoSelect,
    resizerURL,
  })
}

VideoSitemap.propTypes = {
  customFields: PropTypes.shape({
    videoTitle: PropTypes.string.tag({
      label: 'Video Title',
      group: 'Format',
      description: 'Which field should be used from headline',
      defaultValue: 'headlines.basic',
    }),
    videoKeywords: PropTypes.oneOf(['seo_keywords', 'tags']).tag({
      label: 'keywords',
      group: 'Format',
      description: 'Which field should be used from taxonomy',
      defaultValue: 'seo_keywords',
    }),
    lastMod: PropTypes.oneOf([
      'created_date',
      'display_date',
      'first_publish_date',
      'last_updated_date',
      'publish_date',
    ]).tag({
      label: 'Last Modified Date',
      group: 'Format',
      description: 'Which date field should be used in the sitemap',
      defaultValue: 'last_updated_date',
    }),
  }),
}
VideoSitemap.label = 'Video Sitemap'
export default Consumer(VideoSitemap)
