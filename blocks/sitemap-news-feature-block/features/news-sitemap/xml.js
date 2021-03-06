import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { buildResizerURL } from '@wpmedia/feeds-resizer'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
const jmespath = require('jmespath')

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
    newsTitle,
    domain,
    feedTitle,
    feedLanguage,
    resizerURL,
    resizerWidth,
    resizerHeight,
  },
) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    '@xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
    ...(includePromo && {
      '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
    }),

    url: elements.map((s) => {
      let img = s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
      if (img && !img.url && img.promo_image) img = img.promo_image // video
      let keywords
      if (newsKeywords === 'tags') {
        keywords = (jmespath.search(s, 'taxonomy.tags[*].text') || []).join(',')
      } else {
        keywords = (jmespath.search(s, 'taxonomy.seo_keywords[*]') || []).join(
          ',',
        )
      }

      const title = jmespath.search(s, newsTitle)

      return {
        loc: `${domain}${s.website_url || s.canonical_url}`,
        ...{ lastmod: s[lastMod] },
        ...(changeFreq !== 'Exclude from sitemap' && {
          changefreq: changeFreq,
        }),
        ...(priority !== 'Exclude from sitemap' && { priority: priority }),
        'news:news': {
          'news:publication': {
            'news:name': publicationName || feedTitle,
            ...(feedLanguage && { 'news:language': feedLanguage }),
          },
          'news:publication_date': s[lastMod],
          ...(title && {
            'news:title': { $: title },
          }),
          ...(keywords && {
            'news:keywords': { $: keywords },
          }),
          ...(s.taxonomy &&
            s.taxonomy.stock_symbols && {
              'news:stock_tickers': s.taxonomy.stock_symbols.join(','),
            }),
        },
        ...(includePromo &&
          img &&
          img.url && {
            'image:image': {
              ...(img.url && {
                'image:loc': buildResizerURL(
                  img.url,
                  resizerKey,
                  resizerURL,
                  resizerWidth,
                  resizerHeight,
                ),
              }),
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
  const {
    resizerURL = '',
    feedDomainURL = '',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)
  const { width = 0, height = 0 } = customFields.resizerKVP || {}

  // can't return null for xml return type, must return valid xml template
  return sitemapTemplate(globalContent.content_elements || [], {
    ...customFields,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    resizerURL,
    resizerWidth: width,
    resizerHeight: height,
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
      label: 'ANS image caption key',
      group: 'Field Mapping',
      description:
        'ANS value for associated story image used for the <image:caption> sitemap tag',
      defaultValue: 'caption',
    }),
    publicationName: PropTypes.string.tag({
      label: 'Publication Name',
      group: 'Field Mapping',
      description: 'What name should be used in <news:name> news-sitemap tag',
      defaultValue: '',
    }),
    newsTitle: PropTypes.string.tag({
      label: 'article title',
      group: 'Field Mapping',
      description: 'Which field should be used from headline',
      defaultValue: 'headlines.basic',
    }),
    newsKeywords: PropTypes.oneOf(['seo_keywords', 'tags']).tag({
      label: 'keywords',
      group: 'Format',
      description: 'Which field should be used from taxonomy',
      defaultValue: 'seo_keywords',
    }),
    ...generatePropsForFeed('sitemap', PropTypes),
  }),
}
GoogleSitemap.label = 'Sitemap News'
export default Consumer(GoogleSitemap)
