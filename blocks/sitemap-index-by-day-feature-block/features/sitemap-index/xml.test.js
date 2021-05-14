// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { SitemapIndexByDay } from './xml'

jest.useFakeTimers('modern').setSystemTime(new Date('2021-04-09').getTime())

it('returns template with default values', () => {
  const sitemapindex = SitemapIndexByDay({
    arcSite: 'demo',
    customFields: {
      feedPath: {},
      feedName: '/sitemap-index/',
      feedParam: 'outputType=xml',
      numberOfDays: '2',
      feedDates2Split: {},
    },
    requestUri: '/sitemap-index/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})

it('returns template with set end date', () => {
  const sitemapindex = SitemapIndexByDay({
    arcSite: 'demo',
    customFields: {
      feedPath: {
        0: '/arc/outboundfeeds/sitemap/',
        2: '/arc/outboundfeeds/sitemap2/',
        7: '/arc/outboundfeeds/sitemap3/',
      },
      feedName: '/sitemap-index/',
      feedParam: 'outputType=xml',
      numberOfDays: '2021-04-01',
      feedDates2Split: { '2021-04-06': '4' },
    },
    requestUri: '/sitemap-index/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})
