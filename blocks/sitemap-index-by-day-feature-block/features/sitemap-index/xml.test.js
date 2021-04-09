// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { SitemapIndexByDay } from './xml'

it('returns template with default values', () => {
  const sitemapindex = SitemapIndexByDay({
    arcSite: 'demo',
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap-by-day/',
      feedName: '/sitemap-index-by-day/',
      feedParam: 'outputType=xml',
      numberOfDays: '7',
    },
    requestUri: '/sitemap-index-by-day/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})

it('returns template with set end date', () => {
  const sitemapindex = SitemapIndexByDay({
    arcSite: 'demo',
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap-by-day/',
      feedName: '/sitemap-index-by-day/',
      feedParam: 'outputType=xml',
      numberOfDays: '2021-04-01',
    },
    requestUri: '/sitemap-index-by-day/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})
