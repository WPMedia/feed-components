// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { SitemapSection } from './xml'

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

it('returns template with sitemap by section links', () => {
  const sitemapsection = SitemapSection({
    arcSite: 'demo',
    globalContent: siteService,
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap/category',
      feedParam: '',
      priority: '0.5',
      changeFreq: 'always',
    },
  })
  expect(sitemapsection).toMatchSnapshot()
})

it('returns template with sitemap by section links with excluded links', () => {
  const sitemapsection = SitemapSection({
    arcSite: 'demo',
    globalContent: siteService,
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap/category',
      feedParam: 'outputType=xml',
      excludeSections: '/politics,/entertainment/tv',
      priority: '0.5',
      changeFreq: 'always',
    },
  })
  expect(sitemapsection).toMatchSnapshot()
})

it('returns template with links to sections without outputType', () => {
  const sitemapsection = SitemapSection({
    arcSite: 'demo',
    globalContent: siteService,
    customFields: {
      feedPath: '',
      feedParam: '',
      excludeSections: '',
      priority: '',
      changeFreq: '',
    },
  })
  expect(sitemapsection).toMatchSnapshot()
})

it('returns template without priority or change frequency', () => {
  const sitemapsection = SitemapSection({
    arcSite: 'demo',
    globalContent: siteService,
    customFields: {
      feedPath: '/arc/outboundfeeds/sitemap/category',
      feedParam: 'outputType=xml',
      excludeSections: '',
      priority: 'Exclude field',
      changeFreq: 'Exclude field',
    },
  })
  expect(sitemapsection).toMatchSnapshot()
})
