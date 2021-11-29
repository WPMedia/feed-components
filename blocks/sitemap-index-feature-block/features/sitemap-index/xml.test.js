// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { SitemapIndex } from './xml'

it('returns template with default values', () => {
  const sitemapindex = SitemapIndex({
    arcSite: 'the-globe',
    globalContent: {
      count: 437,
      content_elements: [
        {
          last_updated_date: '2020-04-07T15:02:08.918Z',
          website_url: '/food/2020/04/07/tips-for-safe-hand-washing',
        },
      ],
    },
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap/',
      feedName: '/sitemap-index/',
      feedParam: '&outputType=xml',
      lastMod: 'last_updated_date',
    },
    requestUri: '/sitemap-index/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})

it('returns template with category in url', () => {
  const sitemapindex = SitemapIndex({
    arcSite: 'the-globe',
    globalContent: {
      count: 437,
      content_elements: [
        {
          last_updated_date: '2020-04-07T15:02:08.918Z',
          website_url: '/food/2020/04/07/tips-for-safe-hand-washing',
        },
      ],
    },
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap/',
      feedName: '/sitemap-index/',
      feedParam: '&outputType=xml',
      lastMod: 'last_updated_date',
    },
    requestUri:
      '/arc/outboundfeeds/sitemap-index/category/sports/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})

it('returns template with no content', () => {
  const sitemapindex = SitemapIndex({
    arcSite: 'the-globe',
    globalContent: {},
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap/',
      feedName: '/sitemap-index/',
      feedParam: '&outputType=xml',
      lastMod: 'last_updated_date',
    },
    requestUri:
      '/arc/outboundfeeds/sitemap-index/category/sports/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})

it('returns template with empty values', () => {
  const sitemapindex = SitemapIndex({
    arcSite: 'the-globe',
    globalContent: {
      count: 437,
      content_elements: [
        {
          last_updated_date: '2020-04-07T15:02:08.918Z',
          website_url: '/food/2020/04/07/tips-for-safe-hand-washing',
        },
      ],
    },
    customFields: {
      feedPath: '',
      feedName: '',
      feedParam: '',
      lastMod: '',
    },
    requestUri: '/sitemap-index/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})
