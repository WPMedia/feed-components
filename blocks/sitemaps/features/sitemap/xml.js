import PropTypes from 'prop-types'
import Consumer from 'fusion:consumer'

/**
 * xmlbuilder object template for standard sitemaps
 * @param {ANS} elements list of content elements
 */
const sitemapTemplate = (elements, { changeFreq, includePromo, priority }) => {
  return {
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      ...(includePromo && {
        '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
      }),
      url: elements.map((s) => {
        const img =
          s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)

        return {
          loc: s.canonical_url,
          ...(changeFreq && { changefeq: 'always' }),
          ...(s.last_updated_date && { lastmod: s.last_updated_date }),
          ...(s.title && { title: s.title }),
          ...(priority && { priority: '0.5' }),
          ...(includePromo &&
            img && {
              'image:image': {
                'image:loc': img.url,
                ...(img.caption && { 'image:caption': { $: img.caption } }),
                ...(img.title && { 'image:title': { $: img.title } }),
              },
            }),
        }
      }),
    },
  }
}

function Sitemap({ customFields, globalContent, ...props }) {
  const elements = globalContent ? globalContent.content_elements : []
  return sitemapTemplate(elements, customFields)
}

Sitemap.propTypes = {
  customFields: PropTypes.shape({
    changeFreq: PropTypes.boolean.tag({
      label: 'Include <changefreq>?',
      group: 'Field Mapping',
      defaultValue: true,
    }),
    includePromo: PropTypes.boolean.tag({
      label: 'Include promo images?',
      group: 'Field Mapping',
      description: 'Include an image in the sitemap',
      defaultValue: true,
    }),
    priority: PropTypes.boolean.tag({
      label: 'Include <priority>?',
      group: 'Field Mapping',
      defaultValue: true,
    }),
  }),
}

Sitemap.label = 'Standard Sitemap'

export default Consumer(Sitemap)
