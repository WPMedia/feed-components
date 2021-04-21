import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { buildResizerURL } from '@wpmedia/feeds-resizer'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'

const sitemapTemplate = (
  elements,
  {
    changeFreq,
    includePromo,
    priority,
    lastMod,
    imageTitle,
    imageCaption,
    resizerURL,
    domain,
    resizerWidth,
    resizerHeight,
  },
) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    ...(includePromo && {
      '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
    }),
    url: elements.map((s) => {
      let img = s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
      if (img && !img.url && img.promo_image) img = img.promo_image // video
      return {
        loc: `${domain}${s.website_url || s.canonical_url}`,
        ...{ lastmod: s[lastMod] },
        ...(changeFreq !== 'Exclude from sitemap' && {
          changefreq: changeFreq,
        }),
        ...(priority !== 'Exclude from sitemap' && { priority: priority }),
        ...(includePromo &&
          img &&
          img.url && {
            'image:image': {
              'image:loc': buildResizerURL(
                img.url,
                resizerKey,
                resizerURL,
                resizerWidth,
                resizerHeight,
              ),
              ...(img[imageCaption] && {
                'image:caption': { $: img[imageCaption] },
              }),
              ...(img[imageTitle] && {
                'image:title': { $: img[imageTitle] },
              }),
            },
          }),
      }
    }),
  },
})

export function Sitemap({ globalContent, customFields, arcSite }) {
  const { resizerURL = '', feedDomainURL = '' } = getProperties(arcSite)
  const { width = 0, height = 0 } = customFields.resizerKVP || {}

  // can't return null for xml return type, must return valid xml template
  return sitemapTemplate(globalContent.content_elements || [], {
    ...customFields,
    resizerURL,
    domain: feedDomainURL,
    resizerWidth: width,
    resizerHeight: height,
  })
}

Sitemap.propTypes = {
  customFields: PropTypes.shape({
    imageTitle: PropTypes.string.tag({
      label: 'ANS image title key',
      group: 'Field Mapping',
      description: 'ANS value for the <image:title> sitemap tag',
      defaultValue: 'title',
    }),
    imageCaption: PropTypes.string.tag({
      label: 'ANS image caption key',
      group: 'Field Mapping',
      description: 'ANS value for the <image:caption> sitemap tag',
      defaultValue: 'caption',
    }),
    ...generatePropsForFeed('sitemap', PropTypes),
  }),
}
Sitemap.label = 'Sitemap Standard'
export default Consumer(Sitemap)
