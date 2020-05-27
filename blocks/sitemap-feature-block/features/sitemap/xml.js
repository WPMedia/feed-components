import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
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
  },
) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    ...(includePromo && {
      '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
    }),
    url: elements.map((s) => {
      const img =
        s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
      return {
        loc: `${domain}${s.website_url || s.canonical_url}`,
        ...{ lastmod: s[lastMod] },
        ...(changeFreq !== 'Exclude from sitemap' && {
          changefreq: changeFreq,
        }),
        ...(priority !== 'Exclude from sitemap' && { priority: priority }),
        ...(includePromo &&
          img && {
            'image:image': {
              'image:loc': buildResizerURL(img.url, resizerKey, resizerURL),
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

  // can't return null for xml return type, must return valid xml template
  return sitemapTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    resizerURL,
    domain: feedDomainURL,
  })
}

Sitemap.propTypes = {
  customFields: PropTypes.shape({
    imageTitle: PropTypes.string.tag({
      label: 'ANS image title key',
      group: 'Field Mapping',
      description:
        'ANS value for associated story used for the <image:title> sitemap tag',
      defaultValue: 'title',
    }),
    imageCaption: PropTypes.string.tag({
      label: 'ANS image title key',
      group: 'Field Mapping',
      description:
        'ANS value for associated story image used for the <image:caption> sitemap tag',
      defaultValue: 'caption',
    }),
    ...generatePropsForFeed('sitemap', PropTypes),
  }),
}
Sitemap.label = 'Standard Sitemap'
export default Consumer(Sitemap)