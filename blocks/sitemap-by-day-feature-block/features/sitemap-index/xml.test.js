// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { SitemapByDay } from './xml'

it('returns template with default values', () => {
  const sitemapbyday = SitemapByDay({
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
      feedPath: '/arc/outboundfeeds/sitemap',
      feedName: '/sitemap-by-day/',
      feedParam: '&outputType=xml',
      lastMod: 'last_updated_date',
    },
    requestUri: '/sitemap-by-day/2021-04-06/?outputType=xml',
  })
  expect(sitemapbyday).toMatchSnapshot()
})

it('returns template with category in url', () => {
  const sitemapbyday = SitemapByDay({
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
      feedPath: '/arc/outboundfeeds/sitemap',
      feedName: '/sitemap-by-day/',
      feedParam: '&outputType=xml',
      lastMod: 'last_updated_date',
    },
    requestUri:
      '/arc/outboundfeeds/sitemap-by-day/category/sports/2021-04-06?outputType=xml',
  })
  expect(sitemapbyday).toMatchSnapshot()
})

it('returns template with 10000 results ES 7 cap', () => {
  const sitemapbyday = SitemapByDay({
    arcSite: 'the-globe',
    globalContent: {
      count: 10000,
      content_elements: [
        {
          last_updated_date: '2020-04-07T15:02:08.918Z',
          website_url: '/food/2020/04/07/tips-for-safe-hand-washing',
        },
      ],
    },
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap',
      feedName: '/sitemap-by-day/',
      feedParam: '&outputType=xml',
      lastMod: 'last_updated_date',
    },
    requestUri:
      '/arc/outboundfeeds/sitemap-index/category/sports?outputType=xml',
  })
  expect(sitemapbyday).toMatchSnapshot()
})

it('returns template with no content', () => {
  const sitemapbyday = SitemapByDay({
    arcSite: 'the-globe',
    globalContent: {},
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap',
      feedName: '/sitemap-by-day/',
      feedParam: '&outputType=xml',
      lastMod: 'last_updated_date',
    },
    requestUri:
      '/arc/outboundfeeds/sitemap-index/category/sports?outputType=xml',
  })
  expect(sitemapbyday).toMatchSnapshot()
})
