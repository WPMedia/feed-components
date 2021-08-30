import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import { BuildPromoItems } from '@wpmedia/feeds-promo-items'

const sitemapTemplate = (
  elements,
  {
    changeFreq,
    includePromo,
    promoItemsJmespath,
    priority,
    lastMod,
    imageTitle,
    imageCaption,
    resizerURL,
    domain,
    resizerWidth,
    resizerHeight,
    PromoItems,
  },
) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    ...(includePromo && {
      '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
    }),
    url: elements.map((s) => {
      let img
      if (includePromo) {
        img = PromoItems.imageTag({
          ans: s,
          promoItemsJmespath,
          resizerKey,
          resizerURL,
          resizerWidth,
          resizerHeight,
          imageTitle,
          imageCaption,
        })
      }
      return {
        loc: `${domain}${s.website_url || s.canonical_url}`,
        ...{ lastmod: s[lastMod] },
        ...(changeFreq !== 'Exclude field' &&
          changeFreq !== 'Exclude from sitemap' && {
            changefreq: changeFreq,
          }),
        ...(priority !== 'Exclude field' &&
          changeFreq !== 'Exclude from sitemap' && { priority: priority }),
        ...(img && {
          '#': img,
        }),
      }
    }),
  },
})

export function Sitemap({ globalContent, customFields, arcSite }) {
  const { resizerURL = '', feedDomainURL = '' } = getProperties(arcSite)
  const { width = 0, height = 0 } = customFields.resizerKVP || {}

  const PromoItems = new BuildPromoItems()

  // can't return null for xml return type, must return valid xml template
  return sitemapTemplate(globalContent.content_elements || [], {
    ...customFields,
    resizerURL,
    domain: feedDomainURL,
    resizerWidth: width,
    resizerHeight: height,
    PromoItems,
  })
}

Sitemap.propTypes = {
  customFields: PropTypes.shape({
    imageTitle: PropTypes.string.tag({
      label: 'ANS image title key',
      group: 'Featured Media',
      description: 'ANS value for the <image:title> sitemap tag',
      defaultValue: 'title',
    }),
    imageCaption: PropTypes.string.tag({
      label: 'ANS image caption key',
      group: 'Featured Media',
      description: 'ANS value for the <image:caption> sitemap tag',
      defaultValue: 'caption',
    }),
    ...generatePropsForFeed('sitemap', PropTypes),
  }),
}
Sitemap.label = 'Sitemap Standard'
export default Consumer(Sitemap)
