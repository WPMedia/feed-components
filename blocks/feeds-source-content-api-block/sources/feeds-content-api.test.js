// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
const resolver = require('./feeds-content-api')

const globalContent = {
  content_elements: [
    {
      taxonomy: {
        tags: [],
      },
      websites: {
        demo: {
          website_url: '/news/test-article-1',
          website_section: {
            _id: '/news',
          },
        },
      },
    },
    {
      taxonomy: {
        tags: [],
        sections: [{ _id: '/sports' }],
      },
      websites: {
        demo: {
          website_url: '/news/test-article-2',
          website_section: {
            _id: '/news',
          },
        },
      },
    },
    {
      websites: {
        demo: {
          website_url: '/news/test-article-3',
          website_section: {
            _id: '/news',
          },
        },
      },
    },
  ],
}

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
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceIncludes=canonical_url,canonical_website,content_elements,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,websites.demo',
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
    'Include-Distributor-Name': 'AP',
    'Exclude-Distributor-Name': 'paid',
    'Include-Distributor-Category': 'promotions',
    'Exclude-Distributor-Category': 'wires',
  })
  expect(query).toContain('&size=25')
  expect(query).toContain('&from=3')
  expect(query).toContain('_sourceExcludes=taxonomy&')
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
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22taxonomy.sections._website%22:%22demo%22%7D%7D%5D%7D%7D%7D%7D%5D,%22must_not%22:%5B%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22terms%22:%7B%22taxonomy.sections._id%22:%5B%22/food%22,%22/politics%22%5D%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceIncludes=canonical_url,canonical_website,content_elements,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,websites.demo',
  )
})

it('returns query by section and Exclude-Sections', () => {
  const query = resolver.default.resolve({
    Section: '/sports/,/news/',
    Author: '',
    Keywords: '',
    'Tags-Text': '',
    'Tags-Slug': '',
    'arc-site': 'demo',
    'Include-Terms': '',
    'Exclude-Terms': '',
    'Exclude-Sections': '/food,politics/',
    'Feed-Size': '',
    'Feed-Offset': '',
    Sort: '',
    'Source-Exclude': '',
    'Source-Include': '',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22taxonomy.sections._website%22:%22demo%22%7D%7D,%7B%22terms%22:%7B%22taxonomy.sections._id%22:%5B%22/sports%22,%22/news%22%5D%7D%7D%5D%7D%7D%7D%7D%5D,%22must_not%22:%5B%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22terms%22:%7B%22taxonomy.sections._id%22:%5B%22/food%22,%22/politics%22%5D%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceIncludes=canonical_url,canonical_website,content_elements,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,websites.demo',
  )
})

it('returns query by author', () => {
  const query = resolver.default.resolve({
    Section: '',
    Author: 'John Smith',
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
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22term%22:%7B%22credits.by._id%22:%22John%20Smith%22%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceIncludes=canonical_url,canonical_website,content_elements,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,websites.demo',
  )
})

it('returns query by author with slash', () => {
  const query = resolver.default.resolve({
    Section: '',
    Author: '/John /Smith/',
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
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22term%22:%7B%22credits.by._id%22:%22John%20Smith%22%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceIncludes=canonical_url,canonical_website,content_elements,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,websites.demo',
  )
})

it('returns query by keywords', () => {
  const query = resolver.default.resolve({
    Section: '',
    Author: '',
    Keywords: 'washington football,sports',
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
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22simple_query_string%22:%7B%22query%22:%22%5C%22washington%20football%5C%22%20%7C%20%5C%22sports%5C%22%22,%22fields%22:%5B%22taxonomy.seo_keywords%22%5D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceIncludes=canonical_url,canonical_website,content_elements,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,websites.demo',
  )
})

it('returns query by tags text', () => {
  const query = resolver.default.resolve({
    Section: '',
    Author: '',
    Keywords: '',
    'Tags-Text': 'football,sports',
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
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22terms%22:%7B%22taxonomy.tags.text.raw%22:%5B%22football%22,%22sports%22%5D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceIncludes=canonical_url,canonical_website,content_elements,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,websites.demo',
  )
})

it('returns query by tags slug', () => {
  const query = resolver.default.resolve({
    Section: '',
    Author: '',
    Keywords: '',
    'Tags-Text': '',
    'Tags-Slug': '/football,/sports/',
    'arc-site': 'demo',
    'Include-Terms': '',
    'Exclude-Terms': '',
    'Exclude-Sections': '',
    'Feed-Size': '',
    'Feed-Offset': '',
    Sort: '',
    'Source-Exclude': '',
    'Source-Include': '',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22terms%22:%7B%22taxonomy.tags.slug%22:%5B%22football%22,%22sports%22%5D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceIncludes=canonical_url,canonical_website,content_elements,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,websites.demo',
  )
})

it('returns query by Include-Terms', () => {
  const query = resolver.default.resolve({
    Section: '',
    Author: '',
    Keywords: '',
    'Tags-Text': '',
    'Tags-Slug': '',
    'arc-site': 'demo',
    'Include-Terms': '[{"term":{"type":"video"}}]',
    'Exclude-Terms': '',
    'Exclude-Sections': '',
    'Feed-Size': '',
    'Feed-Offset': '',
    Sort: '',
    'Source-Exclude': '',
    'Source-Include': '',
  })
  expect(query).not.toContain('%22term%22:%7B%22type%22:%22story%22')
  expect(query).toContain('%22term%22:%7B%22type%22:%22video%22')
})

it('returns query by Exclude-Terms', () => {
  const query = resolver.default.resolve({
    Section: '',
    Author: '',
    Keywords: '',
    'Tags-Text': '',
    'Tags-Slug': '',
    'arc-site': 'demo',
    'Include-Terms': '',
    'Exclude-Terms': '[{"term":{"subtype":"premium"}}]',
    'Exclude-Sections': '',
    'Feed-Size': '',
    'Feed-Offset': '',
    Sort: '',
    'Source-Exclude': '',
    'Source-Include': '',
  })
  expect(query).toContain('%22term%22:%7B%22type%22:%22story%22')
  expect(query).toContain('%22term%22:%7B%22subtype%22:%22premium%22')
})

it('Test transform with empty data', () => {
  const transform = resolver.default.transform(undefined, {
    'arc-site': 'demo',
  })
  expect(transform).toBe(undefined)
})

// Every article should have a website and website_url. Only replace sections if !exist
it('Test transform', () => {
  const transform = resolver.default.transform(globalContent, {
    'arc-site': 'demo',
  })
  expect(transform).toEqual({
    content_elements: [
      {
        taxonomy: { sections: [{ _id: '/news' }], tags: [] },
        website: 'demo',
        website_url: '/news/test-article-1',
        websites: {
          demo: {
            website_section: { _id: '/news' },
            website_url: '/news/test-article-1',
          },
        },
      },
      {
        taxonomy: { sections: [{ _id: '/sports' }], tags: [] },
        website: 'demo',
        website_url: '/news/test-article-2',
        websites: {
          demo: {
            website_section: { _id: '/news' },
            website_url: '/news/test-article-2',
          },
        },
      },
      {
        taxonomy: { sections: [{ _id: '/news' }] },
        website: 'demo',
        website_url: '/news/test-article-3',
        websites: {
          demo: {
            website_section: { _id: '/news' },
            website_url: '/news/test-article-3',
          },
        },
      },
    ],
  })
})
