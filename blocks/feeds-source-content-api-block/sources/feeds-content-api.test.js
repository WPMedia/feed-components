// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
const resolver = require('./feeds-content-api')

it('validate schemaName', () => {
  expect(resolver.default.schemaName).toBe('feeds')
})

it('validate params', () => {
  expect(resolver.default.params).toStrictEqual({
    Section: 'text',
    Author: 'text',
    Keywords: 'text',
    'Tags-Text': 'text',
    'Tags-Slug': 'text',
    'Include-Terms': 'text',
    'Exclude-Terms': 'text',
    'Exclude-Sections': 'text',
    'Feed-Size': 'text',
    'Feed-Offset': 'text',
    Sort: 'text',
    'Source-Exclude': 'text',
    'Source-Include': 'text',
    'Sitemap-at-root': 'text',
    'Include-Distributor-Name': 'text',
    'Exclude-Distributor-Name': 'text',
    'Include-Distributor-Category': 'text',
    'Exclude-Distributor-Category': 'text',
  })
})

it('returns query with default values', () => {
  const query = resolver.default.resolve({
    Section: '',
    Author: '',
    Keywords: '',
    'Tags-Text': '',
    'Tags-Slug': '',
    'arc-site': 'demo',
    'Include-Terms': '',
    'Exclude-Terms': '',
    'Exclude-Sections': '',
    'Feed-Size': '',
    'Feed-Offset': '',
    Sort: '',
    'Source-Exclude': '',
    'Source-Include': '',
    'Sitemap-at-root': '',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query with parameter values', () => {
  const query = resolver.default.resolve({
    Section: '',
    Author: '',
    Keywords: '',
    'Tags-Text': '',
    'Tags-Slug': '',
    'arc-site': 'demo',
    'Include-Terms': '',
    'Exclude-Terms': '',
    'Exclude-Sections': '',
    'Feed-Size': '25',
    'Feed-Offset': '3',
    Sort: 'display_date:asc',
    'Source-Exclude': 'content_elements,taxonomy',
    'Source-Include': 'source,owner',
    'Sitemap-at-root': '',
    'Include-Distributor-Name': 'AP',
    'Exclude-Distributor-Name': 'paid',
    'Include-Distributor-Category': 'promotions',
    'Exclude-Distributor-Category': 'wires',
  })
  expect(query).toContain('&size=25')
  expect(query).toContain('&from=3')
  expect(query).toContain('_sourceExclude=taxonomy&')
  expect(query).toContain(',source,owner')
  expect(query).not.toContain('content_elements')
  expect(query).toContain('&include_distributor_name=AP')
  expect(query).not.toContain('paid')
  expect(query).not.toContain('promotions')
  expect(query).not.toContain('wires')
})

it('returns query by section', () => {
  const query = resolver.default.resolve({
    Section: 'sports/',
    Author: '',
    Keywords: '',
    'Tags-Text': '',
    'Tags-Slug': '',
    'arc-site': 'demo',
    'Include-Terms': '',
    'Exclude-Terms': '',
    'Exclude-Sections': '',
    'Feed-Size': '',
    'Feed-Offset': '',
    Sort: '',
    'Source-Exclude': '',
    'Source-Include': '',
    'Sitemap-at-root': '',
  })
  expect(query).toContain('%22taxonomy.sections._id%22:%5B%22/sports%22')
})

it('returns query by Exclude-Sections', () => {
  const query = resolver.default.resolve({
    Section: '',
    Author: '',
    Keywords: '',
    'Tags-Text': '',
    'Tags-Slug': '',
    'arc-site': 'demo',
    'Include-Terms': '',
    'Exclude-Terms': '',
    'Exclude-Sections': '/food,politics',
    'Feed-Size': '',
    'Feed-Offset': '',
    Sort: '',
    'Source-Exclude': '',
    'Source-Include': '',
    'Sitemap-at-root': '',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22taxonomy.sections._website%22:%22demo%22%7D%7D%5D%7D%7D%7D%7D%5D,%22must_not%22:%5B%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22terms%22:%7B%22taxonomy.sections._id%22:%5B%22/food%22,%22/politics%22%5D%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by section and Exclude-Sections', () => {
  const query = resolver.default.resolve({
    Section: '/sports/,/news/',
    'arc-site': 'demo',
    'Exclude-Sections': '/food,politics/',
    'Sitemap-at-root': 'false',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22taxonomy.sections._website%22:%22demo%22%7D%7D,%7B%22terms%22:%7B%22taxonomy.sections._id%22:%5B%22/sports%22,%22/news%22%5D%7D%7D%5D%7D%7D%7D%7D%5D,%22must_not%22:%5B%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22terms%22:%7B%22taxonomy.sections._id%22:%5B%22/food%22,%22/politics%22%5D%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by author', () => {
  const query = resolver.default.resolve({
    Author: 'John Smith',
    'arc-site': 'demo',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22term%22:%7B%22credits.by._id%22:%22John%20Smith%22%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by author with slash', () => {
  const query = resolver.default.resolve({
    Author: '/John /Smith/',
    'arc-site': 'demo',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22term%22:%7B%22credits.by._id%22:%22John%20Smith%22%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by keywords', () => {
  const query = resolver.default.resolve({
    Keywords: 'washington football,sports',
    'arc-site': 'demo',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22simple_query_string%22:%7B%22query%22:%22%5C%22washington%20football%5C%22%20%7C%20%5C%22sports%5C%22%22,%22fields%22:%5B%22taxonomy.seo_keywords%22%5D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by tags text', () => {
  const query = resolver.default.resolve({
    'Tags-Text': 'football,sports',
    'arc-site': 'demo',
  })
    expect(query).toBe(
      'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22bool%22:%7B%22should%22:%5B%7B%22terms%22:%7B%22taxonomy.tags.text.raw%22:%5B%22football%22,%22sports%22%5D%7D%7D,%7B%22nested%22:%7B%22ignore_unmapped%22:true,%22path%22:%22variations.variants%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22variations.variants.websites%22:%22demo%22%7D%7D,%7B%22nested%22:%7B%22ignore_unmapped%22:true,%22path%22:%22variations.variants.content.taxonomy.tags%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22terms%22:%7B%22variations.variants.content.taxonomy.tags.text.raw%22:%5B%22football%22,%22sports%22%5D%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo'
  )
})

it('returns query by tags slug', () => {
  const query = resolver.default.resolve({
    'Tags-Slug': '/football,/sports/',
    'arc-site': 'demo',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22bool%22:%7B%22minimum_should_match%22:1,%22should%22:%5B%7B%22terms%22:%7B%22taxonomy.tags.slug%22:%5B%22football%22,%22sports%22%5D%7D%7D,%7B%22nested%22:%7B%22ignore_unmapped%22:true,%22path%22:%22variations.variants%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22variations.variants.websites%22:%22demo%22%7D%7D,%7B%22nested%22:%7B%22ignore_unmapped%22:true,%22path%22:%22variations.variants.content.taxonomy.tags%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22terms%22:%7B%22variations.variants.content.taxonomy.tags.slug%22:%5B%22football%22,%22sports%22%5D%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo'
  )
})

it('returns query by Include-Terms', () => {
  const query = resolver.default.resolve({
    'Include-Terms': '[{"term":{"type":"video"}}]',
    'arc-site': 'demo',
  })
  expect(query).not.toContain('%22term%22:%7B%22type%22:%22story%22')
  expect(query).toContain('%22term%22:%7B%22type%22:%22video%22')
})

it('returns query by Exclude-Terms', () => {
  const query = resolver.default.resolve({
    'arc-site': 'demo',
    'Exclude-Terms': '[{"term":{"subtype":"premium"}}]',
  })
  expect(query).toContain('%22term%22:%7B%22type%22:%22story%22')
  expect(query).toContain('%22term%22:%7B%22subtype%22:%22premium%22')
})

it('returns query by Exclude-Terms', () => {
  const query = resolver.default.resolve({
    'Include-Distributor-Name': 'AP',
  })
  expect(query).toContain('include_distributor_name=AP')
  expect(query).not.toContain('exclude_distributor_name=AP')
})

it('Sitemap at Root replace the slashes', () => {
  const query = resolver.default.resolve({
    Section: 'sports-football,news',
    'arc-site': 'demo',
    'Exclude-Sections': 'ffg-homepage',
    'Sitemap-at-root': 'X',
  })
  expect(query).toContain(encodeURI('["/sports/football","/news"]'))
  expect(query).toContain(encodeURI('["/ffg-homepage"]'))
})