import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
const source = require('./feeds-content-api')

// Mock Axios
jest.mock('axios')

beforeEach(() => {
  // Reset Axios mocks before each test
  axios.mockClear()
})

it('validate schemaName', () => {
  expect(source.default.schemaName).toBe('feeds')
})

it('validate params', () => {
  expect(source.default.params).toStrictEqual({
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

it('returns query with default values', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
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
    },
    { cachedCall: {} },
  )

  expect(axios).toHaveBeenCalledTimes(1)
  expect(axios).toHaveBeenCalledWith({
    url: expect.stringContaining(`/content/v4/search/published`), // Check base URL
    method: 'GET',
    headers: expect.objectContaining({
      'content-type': 'application/json',
      Authorization: expect.stringContaining('Bearer '),
    }),
  })

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query with parameter values', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
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
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  const queryParams = new URLSearchParams(callUrl.split('?')[1])
  expect(queryParams.has('content_elements')).not.toBeTruthy()
  expect(queryParams.has('paid')).not.toBeTruthy()
  expect(queryParams.has('promotions')).not.toBeTruthy()
  expect(queryParams.has('wires')).not.toBeTruthy()
  expect(queryParams.get('size')).toBe('25')
  expect(queryParams.get('from')).toBe('3')
  expect(queryParams.get('_sourceExclude')).toBe('taxonomy')
  expect(queryParams.get('_sourceInclude')).toBe(
    'canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,websites.demo,source,owner',
  )
  expect(queryParams.get('include_distributor_name')).toBe('AP')
})

it('returns query by section', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
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
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toContain('%22taxonomy.sections._id%22:%5B%22/sports%22')
})

it('returns query by Exclude-Sections', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
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
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22taxonomy.sections._website%22:%22demo%22%7D%7D%5D%7D%7D%7D%7D%5D,%22must_not%22:%5B%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22terms%22:%7B%22taxonomy.sections._id%22:%5B%22/food%22,%22/politics%22%5D%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by section and Exclude-Sections', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
      Section: '/sports/,/news/',
      'arc-site': 'demo',
      'Exclude-Sections': '/food,politics/',
      'Sitemap-at-root': 'false',
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22taxonomy.sections._website%22:%22demo%22%7D%7D,%7B%22terms%22:%7B%22taxonomy.sections._id%22:%5B%22/sports%22,%22/news%22%5D%7D%7D%5D%7D%7D%7D%7D%5D,%22must_not%22:%5B%7B%22nested%22:%7B%22path%22:%22taxonomy.sections%22,%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22terms%22:%7B%22taxonomy.sections._id%22:%5B%22/food%22,%22/politics%22%5D%7D%7D%5D%7D%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by author', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
      Author: 'John Smith',
      'arc-site': 'demo',
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22term%22:%7B%22credits.by._id%22:%22John%20Smith%22%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by author with slash', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
      Author: '/John /Smith/',
      'arc-site': 'demo',
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22term%22:%7B%22credits.by._id%22:%22John%20Smith%22%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by keywords', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
      Keywords: 'washington football,sports',
      'arc-site': 'demo',
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22simple_query_string%22:%7B%22query%22:%22%5C%22washington%20football%5C%22%20%7C%20%5C%22sports%5C%22%22,%22fields%22:%5B%22taxonomy.seo_keywords%22%5D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by tags text', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
      'Tags-Text': 'football,sports',
      'arc-site': 'demo',
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22terms%22:%7B%22taxonomy.tags.text.raw%22:%5B%22football%22,%22sports%22%5D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by tags slug', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
      'Tags-Slug': '/football,/sports/',
      'arc-site': 'demo',
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%22now-2d%22,%22lte%22:%22now%22%7D%7D%7D,%7B%22terms%22:%7B%22taxonomy.tags.slug%22:%5B%22football%22,%22sports%22%5D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&sort=publish_date:desc&_sourceInclude=canonical_url,canonical_website,created_date,credits,description,display_date,duration,first_publish_date,headlines,last_updated_date,promo_image,promo_items,publish_date,streams,subheadlines,subtitles,subtype,taxonomy.primary_section,taxonomy.seo_keywords,taxonomy.tags,type,video_type,content_elements,websites.demo',
  )
})

it('returns query by Include-Terms', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
      'Include-Terms': '[{"term":{"type":"video"}}]',
      'arc-site': 'demo',
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).not.toContain('%22term%22:%7B%22type%22:%22story%22')
  expect(callUrl).toContain('%22term%22:%7B%22type%22:%22video%22')
})

it('returns query by Exclude-Terms', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
      'arc-site': 'demo',
      'Exclude-Terms': '[{"term":{"subtype":"premium"}}]',
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toContain('%22term%22:%7B%22type%22:%22story%22')
  expect(callUrl).toContain('%22term%22:%7B%22subtype%22:%22premium%22')
})

it('returns query by Exclude-Terms', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
      'Include-Distributor-Name': 'AP',
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toContain('include_distributor_name=AP')
  expect(callUrl).not.toContain('exclude_distributor_name=AP')
})

it('Sitemap at Root replace the slashes', async () => {
  const mockData = { data: 'response' }
  axios.mockResolvedValue(mockData)

  await source.default.fetch(
    {
      Section: 'sports-football,news',
      'arc-site': 'demo',
      'Exclude-Sections': 'ffg-homepage',
      'Sitemap-at-root': 'X',
    },
    { cachedCall: {} },
  )

  const callUrl = axios.mock.calls[0][0].url
  expect(callUrl).toContain(encodeURI('["/sports/football","/news"]'))
  expect(callUrl).toContain(encodeURI('["/ffg-homepage"]'))
})
