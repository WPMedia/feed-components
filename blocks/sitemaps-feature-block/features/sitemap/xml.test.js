// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { Sitemap } from './xml'

jest.mock('thumbor-lite')
it('returns template with default values', () => {
  const sitemap = Sitemap({
    arcSite: 'the-globe',
    globalContent: {
      content_elements: [
        {
          last_updated_date: '2020-04-07T15:02:08.918Z',
          website_url: '/food/2020/04/07/tips-for-safe-hand-washing',
          promo_items: {
            basic: {
              title: 'Hand Washing',
              url:
                'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
            },
          },
        },
      ],
    },
    customFields: {
      priority: '0.5',
      includePromo: true,
      changeFreq: 'always',
      lastMod: 'last_updated_date',
      imageTitle: 'title',
      imageCaption: 'caption',
    },
  })
  expect(sitemap).toMatchSnapshot()
})
