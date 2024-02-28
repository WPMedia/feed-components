import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { BuildPromoItems } from '@wpmedia/feeds-promo-items'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import jmespath from 'jmespath'

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
    publicationName,
    newsTitle,
    domain,
    feedTitle,
    newsLanguage,
    resizerURL,
    resizerWidth,
    resizerHeight,
    newsKeywordsJmespath,
    PromoItems,
  },
) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    '@xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
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
      const keywords = (jmespath.search(s, newsKeywordsJmespath) || []).join(
        ',',
      )
      const title = newsTitle && jmespath.search(s, newsTitle)

      return {
        loc: `${domain}${s.website_url || s.canonical_url}`,
        ...{ lastmod: s[lastMod] },
        ...(changeFreq !== 'Exclude from sitemap' &&
          changeFreq !== 'Exclude field' && {
            changefreq: changeFreq,
          }),
        ...(priority !== 'Exclude from sitemap' &&
          priority !== 'Exclude field' && { priority: priority }),
        'news:news': {
          'news:publication': {
            'news:name': publicationName || feedTitle,
            ...(newsLanguage &&
              newsLanguage.toLowerCase() !== 'exclude' && {
                'news:language': newsLanguage,
              }),
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
        ...(img && {
          '#': img,
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
  const newsLanguage = customFields.newsLanguage || feedLanguage
  const newsKeywordsJmespath =
    customFields.newsKeywords === 'tags'
      ? 'taxonomy.tags[*].text'
      : 'taxonomy.seo_keywords[*]'

  const PromoItems = new BuildPromoItems()

  // can't return null for xml return type, must return valid xml template
  return sitemapTemplate(globalContent.content_elements || [], {
    ...customFields,
    domain: feedDomainURL,
    feedTitle,
    newsLanguage,
    resizerURL,
    resizerWidth: width,
    resizerHeight: height,
    newsKeywordsJmespath,
    PromoItems,
  })
}

GoogleSitemap.propTypes = {
  customFields: PropTypes.shape({
    imageTitle: PropTypes.string.tag({
      label: 'ANS image title key',
      group: 'Featured Media',
      description:
        'ANS value for associated story used for the <image:title> sitemap tag',
      defaultValue: 'title',
    }),
    imageCaption: PropTypes.string.tag({
      label: 'ANS image caption key',
      group: 'Featured Media',
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
    newsLanguage: PropTypes.string.tag({
      label: 'Language',
      group: 'Field Mapping',
      description:
        'ISO-639 Language code, if blank uses value from feedLanguage in blocks.json. Use Exclude to remove this field.',
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
      group: 'Field Mapping',
      description: 'Which field should be used from taxonomy',
      defaultValue: 'seo_keywords',
    }),
    ...generatePropsForFeed('sitemap', PropTypes),
  }),
}
GoogleSitemap.label = 'Sitemap News'
GoogleSitemap.icon = 'browser-page-hierarchy'
export default Consumer(GoogleSitemap)
