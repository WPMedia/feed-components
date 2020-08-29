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
      feedPath: 'arcio/sitemap',
      feedParam: '&outputType=xml',
      lastMod: 'last_updated_date',
    },
  })
  expect(sitemapindex).toMatchSnapshot()
})
