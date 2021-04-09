// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
const resolver = require('./feeds-content-api-by-day')

it('validate schemaName', () => {
  expect(resolver.default.schemaName).toBe('feeds')
})

it('validate params', () => {
  expect(resolver.default.params).toStrictEqual({
    dateField: 'text',
    dateRange: 'text',
    Section: 'text',
    Author: 'text',
    Keywords: 'text',
    'Tags-Text': 'text',
    'Tags-Slug': 'text',
    'Include-Terms': 'text',
    'Exclude-Terms': 'text',
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
  jest
    .spyOn(global.Date, 'now')
    .mockImplementationOnce(() =>
      new Date('2021-04-08T11:01:58.135Z').valueOf(),
    )
  const query = resolver.default.resolve({
    dateField: 'last_updated_date',
    dateRange: 'latest',
    Section: '',
    Author: '',
    Keywords: '',
    'Tags-Text': '',
    'Tags-Slug': '',
    'arc-site': 'demo',
    'Include-Terms': '',
    'Exclude-Terms': '',
    'Feed-Size': '',
    'Feed-Offset': '',
    Sort: '',
    'Source-Exclude': '',
    'Source-Include': '',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22last_updated_date%22:%7B%22gte%22:%222021-04-07%22,%22lte%22:%22now%22%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&_sourceExclude=related_content&sort=publish_date:desc',
  )
})

it('returns query with dateRange value', () => {
  const query = resolver.default.resolve({
    dateField: 'display_date',
    dateRange: '2021-04-06',
    Section: '',
    Author: '',
    Keywords: '',
    'Tags-Text': '',
    'Tags-Slug': '',
    'arc-site': 'demo',
    'Include-Terms': '',
    'Exclude-Terms': '',
    'Feed-Size': '',
    'Feed-Offset': '',
    Sort: 'display_date:asc',
    'Source-Exclude': 'headlines,description,website_url',
    'Source-Include': 'related_items,content_elements,taxonomy',
    'Include-Distributor-Name': 'AP',
    'Exclude-Distributor-Name': 'paid',
    'Include-Distributor-Category': 'promotions',
    'Exclude-Distributor-Category': 'wires',
  })
  expect(query).toBe(
    'undefined/content/v4/search/published?body=%7B%22query%22:%7B%22bool%22:%7B%22must%22:%5B%7B%22term%22:%7B%22type%22:%22story%22%7D%7D,%7B%22range%22:%7B%22display_date%22:%7B%22gte%22:%222021-04-06%22,%22lte%22:%222021-04-06%22%7D%7D%7D%5D%7D%7D%7D&website=demo&size=100&from=0&_sourceExclude=headlines,description,website_url&sort=display_date:asc&_sourceInclude=related_items,content_elements,taxonomy&include_distributor_name=AP',
  )
})
