// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { SitemapIndexByDay } from './xml'

jest
  .useFakeTimers('modern')
  .setSystemTime(new Date('2021-04-09T20:15:39.543Z').getTime())

it('returns template with default values', () => {
  const sitemapindex = SitemapIndexByDay({
    arcSite: 'demo',
    customFields: {
      feedPath: {},
      feedName: '/sitemap-index/',
      feedParam: 'outputType=xml',
      numberOfDays: '',
      feedDates2Split: {},
    },
    requestUri: '/sitemap-index/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})

it('returns template without outputType', () => {
  const sitemapindex = SitemapIndexByDay({
    arcSite: 'demo',
    customFields: {
      feedPath: { 0: '/sitemap/' },
      feedName: '/sitemap-index/',
      feedParam: '',
      numberOfDays: '',
      feedDates2Split: {},
    },
    requestUri: '/sitemap-index/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})

it('returns template with set end date 2021-04-01', () => {
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

it('invalid date format, should return 2', () => {
  const sitemapindex = SitemapIndexByDay({
    arcSite: 'demo',
    customFields: {
      feedPath: {
        0: '/arc/outboundfeeds/sitemap-news/',
      },
      feedName: '/sitemap-news-index/',
      feedParam: 'outputType=xml',
      numberOfDays: '4/5/21',
      feedDates2Split: {},
    },
    requestUri: '/sitemap-news-index/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})

it('invalid date, should return 2', () => {
  const sitemapindex = SitemapIndexByDay({
    arcSite: 'demo',
    customFields: {
      feedPath: {
        0: '/arc/outboundfeeds/sitemap-news/',
      },
      feedName: '/sitemap-news-index/',
      feedParam: 'outputType=xml',
      numberOfDays: '1234-56-78',
      feedDates2Split: {},
    },
    requestUri: '/sitemap-news-index/?outputType=xml',
  })
  expect(sitemapindex).toMatchSnapshot()
})

it('returns template with empty values', () => {
  const sitemapindex = SitemapIndexByDay({
    requestUri: '/sitemap-news-index/?outputType=xml',
    arcSite: 'demo',
    customFields: {
      feedPath: {},
      feedName: '',
      feedParam: '',
      numberOfDays: '',
      feedDates2Split: {},
    },
  })
  expect(sitemapindex).toMatchSnapshot()
})
