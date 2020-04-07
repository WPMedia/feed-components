import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'

const sitemapTemplate = (
  elements,
  {
    changeFreq,
    includePromo,
    priority,
    imageTitle,
    imageCaption,
    getImgURL,
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
        loc: `${domain}${s.canonical_url}`,
        ...(changeFreq && { changefeq: 'always' }),
        ...(s.last_updated_date && { lastmod: s.last_updated_date }),
        ...(s.title && { title: s.title }),
        ...(priority && { priority: '0.5' }),
        ...(includePromo &&
          img && {
            'image:image': {
              'image:loc': getImgURL(s),
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

  const getImgURL = (element) => {
    const buildURL = (_url) => {
      if (typeof window === 'undefined') {
        const Thumbor = require('thumbor-lite')
        const thumbor = new Thumbor(resizerKey, resizerURL)
        let imgSrc = _url.replace(/^http[s]?:\/\//, '').replace(' ', '%20')
        if (imgSrc.includes('?')) {
          imgSrc = imgSrc.replace('?', '%3F')
        }

        return thumbor
          .setImagePath(imgSrc)
          .resize(1200, 630)
          .buildUrl()
      }
      return null
    }

    if (
      element.promo_items &&
      element.promo_items.basic &&
      element.promo_items.basic.url
    ) {
      return buildURL(element.promo_items.basic.url)
    }

    return ''
  }

  // can't return null for xml return type, must return valid xml template
  return sitemapTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    getImgURL,
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
    changeFreq: PropTypes.boolean.tag({
      label: 'Include <changefreq>?',
      group: 'Format',
      description: 'Should this field be included in the sitemap',
      defaultValue: true,
    }),
    includePromo: PropTypes.boolean.tag({
      label: 'Include promo images?',
      group: 'Format',
      description: 'Include an image in the sitemap',
      defaultValue: true,
    }),
    priority: PropTypes.boolean.tag({
      label: 'Include priority?',
      group: 'Format',
      defaultValue: true,
    }),
  }),
}
Sitemap.label = 'Standard Sitemap'
export default Consumer(Sitemap)
