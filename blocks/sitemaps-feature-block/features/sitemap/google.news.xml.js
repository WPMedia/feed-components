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
    lastMod,
    imageTitle,
    imageCaption,
    getImgURL,
    domain,
    feedTitle
  },
) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    '@xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
    ...(includePromo && {
      '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1'
    }),
    '@xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1',

    url: elements.map((s) => {
      const img =
        s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)

      const hasVideos = get(s, 'videos', [])
      const videos = hasVideos.map(v => {
        return {
          'video:video': {
            'video:content_loc': v.content_loc ,
            'video:thumbnail_loc': v.thumbnail_loc,
            'video:title': {$: v.title}
          }
        }
      })
      return {
        loc: `${domain}${s.website_url ||s.canonical_url}`,
        ...({ lastmod: s[lastMod] }),
        ...(changeFreq !== 'Exclude from sitemap' && { changefeq: changeFreq }),
        ...(priority !== 'Exclude from sitemap' && { priority: priority }),
        ...(videos),
        'news:news': {
          'news:publication': {
            'news:name': (s.publication_name || feedTitle),
            ...(s.language && {'news:language': s.language})

          },
          ...(s.access && {'news:access': s.access}),
          'news:publication_date': s.last_updated_date,
          'news:title': {$: s.headlines.basic},
          ...(s.keywords && {'news:keywords': { $: s.keywords.join(',') }}),
          ...(s.stock_tickers && {'news:stock_tickers': s.stock_tickers.join(',') })
        },
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

export function GoogleSitemap({ globalContent, customFields, arcSite }) {
  const { resizerURL = '', feedDomainURL = '', feedTitle = '' } = getProperties(arcSite)
  console.log('getProperties', getProperties(arcSite))

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
  console.log('custome fields are',customFields)
  // can't return null for xml return type, must return valid xml template
  return sitemapTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    getImgURL,
    domain: feedDomainURL,
    feedTitle
  })
}

GoogleSitemap.propTypes = {
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
    lastMod: PropTypes.oneOf([
      'created_date', 'display_date', 'first_publish_date', 'last_updated_date', 'publish_date'
    ]).tag({
      label: 'Last Modified Date',
      group: 'Format',
      description: 'Which date field should be used in the sitemap',
      defaultValue: 'last_updated_date',
    }),
    changeFreq: PropTypes.oneOf([
      'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never', 'Exclude from sitemap'
    ]).tag({
      label: 'change frequency',
      group: 'Format',
      description: 'What is the Change frequency of the sitemap',
      defaultValue: 'always',
    }),
    includePromo: PropTypes.boolean.tag({
      label: 'Include promo images?',
      group: 'Format',
      description: 'Include an image in the sitemap',
      defaultValue: true,
    }),
    priority: PropTypes.oneOf([
      '0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0', 'Exclude from sitemap'
    ]).tag({
      label: 'priority',
      group: 'Format',
      description: 'What is the priority of the sitemap',
      defaultValue: '0.5',
    })
  })
}
GoogleSitemap.label = 'Google News Sitemap'
export default Consumer(GoogleSitemap)