// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { SitemapSectionFrontIndex } from './xml'

const siteService = {
  children: [
    { _id: '/politics' },
    { _id: '/opinion' },
    { _id: '/economy' },
    {
      _id: '/sports',
      children: [
        { _id: '/sports/football' },
        { _id: '/sports/baseball' },
        { _id: '/sports/basketball' },
        { _id: 'link-CYAF5RAZGN023DTGKNWW4GWRMG', node_type: 'link' },
      ],
    },
    {
      _id: '/entertainment',
      children: [
        { _id: '/entertainment/tv' },
        { _id: '/entertainment/movies' },
      ],
    },
  ],
}

it('returns template with sitemap index by section links', () => {
  const sitemapsectionindex = SitemapSectionFrontIndex({
    arcSite: 'demo',
    globalContent: siteService,
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap/category',
      feedParam: '',
    },
  })
  expect(sitemapsectionindex).toMatchSnapshot()
})

it('returns template with sitemap index by section links with excluded links', () => {
  const sitemapsectionindex = SitemapSectionFrontIndex({
    arcSite: 'demo',
    globalContent: siteService,
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap/category',
      feedParam: 'outputType=xml',
      excludeSections: '/politics,/entertainment/tv',
    },
  })
  expect(sitemapsectionindex).toMatchSnapshot()
})

it('returns template with links to sections without outputType', () => {
  const sitemapsectionindex = SitemapSectionFrontIndex({
    arcSite: 'demo',
    globalContent: siteService,
    customFields: {
      feedPath: '',
      feedParam: '',
      excludeSections: '',
    },
  })
  expect(sitemapsectionindex).toMatchSnapshot()
})

it('returns template with sitemap at root', () => {
  const sitemapsectionindex = SitemapSectionFrontIndex({
    arcSite: 'demo',
    globalContent: siteService,
    customFields: {
      feedPath: '/sitemap-category',
      feedAtRoot: true,
      feedExtension: '.xml',
      feedParam: '',
      excludeSections: '',
    },
  })
  expect(sitemapsectionindex).toMatchSnapshot()
})
