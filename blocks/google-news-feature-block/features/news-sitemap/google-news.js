import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import getImgURL from '../../resizerUrl'

const sitemapTemplate = (
  elements,
  {
    changeFreq,
    includePromo,
    priority,
    lastMod,
    imageTitle,
    imageCaption,
    publicationName,
    newsKeywords,
    domain,
    feedTitle,
    feedLanguage,
    resizerURL

  },
) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    '@xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
    ...(includePromo && {
      '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1'
    }),

    url: elements.map((s) => {
      const img =
        s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
      return {
        loc: `${domain}${s.website_url ||s.canonical_url}`,
        ...({ lastmod: s[lastMod] }),
        ...(changeFreq !== 'Exclude from sitemap' && { changefeq: changeFreq }),
        ...(priority !== 'Exclude from sitemap' && { priority: priority }),
        'news:news': {
          'news:publication': {
            'news:name': (publicationName || feedTitle),
            ...(s.language && {'news:language': s.language || feedLanguage})

          },
          'news:publication_date': s[lastMod],
          'news:title': {$: s.headlines.basic},
          ...(s.keywords && {'news:keywords': newsKeywords === 'seo_keywords' ? { $: s.taxonomy[newsKeywords].join(',') } : { $: s.taxonomy[newsKeywords].text.join(',')}}),
          ...(s.stock_tickers && {'news:stock_tickers': s.stock_symobls.join(',') })
        },
        ...(includePromo &&
          img && {
            'image:image': {
              'image:loc': getImgURL(s,resizerKey, resizerURL),
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
  const { resizerURL = '', feedDomainURL = '', feedTitle = '', feedLanguage = '' } = getProperties(arcSite)
  console.log('getProperties', getProperties(arcSite))


  // can't return null for xml return type, must return valid xml template
  return sitemapTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    resizerURL
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
    publicationName: PropTypes.string.tag({
      label: 'Publication name',
      group: 'Field Mapping',
      description: 'What name should be used in <news:name> news-sitemap tag',
      defaultValue: 'caption',
    }),
    newsTitle: PropTypes.oneOf([
      'basic', 'title'
    ]).tag({
      label: 'publication title',
      group: 'Field Mapping',
      description: 'Which field should be used from headline',
      defaultValue: 'basic',
    }),
    newsKeywords: PropTypes.oneOf([
      'seo_keywords', 'tags'
    ]).tag({
      label: 'keywords',
      group: 'Format',
      description: 'Which field should be used from taxonomy',
      defaultValue: 'seo_keywords',
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