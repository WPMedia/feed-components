// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { SitemapSectionFrontIndex } from './xml'

it('returns template with sitemap index by section links', () => {
  const sitemapsectionindex = SitemapSectionFrontIndex({
    arcSite: 'demo',
    globalContent: {
      children: [
        { _id: '/politics' },
        { _id: '/opinion' },
        { _id: '/economy' },
        { _id: '/sports' },
        { _id: '/entertainment' },
      ],
    },
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap/category',
      feedParam: 'outputType=xml',
    },
  })
  expect(sitemapsectionindex).toMatchSnapshot()
})

it('returns template with sitemap index by section links with excluded links', () => {
  const sitemapsectionindex = SitemapSectionFrontIndex({
    arcSite: 'demo',
    globalContent: {
      children: [
        { _id: '/politics' },
        { _id: '/opinion' },
        { _id: '/economy' },
        { _id: '/sports' },
        { _id: '/entertainment' },
      ],
    },
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap/category',
      feedParam: 'outputType=xml',
      excludeSections: '/politics,/entertainment',
    },
  })
  expect(sitemapsectionindex).toMatchSnapshot()
})
