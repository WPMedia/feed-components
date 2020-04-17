// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { GoogleSitemap } from './google-news'

jest.mock('thumbor-lite')
it('returns template with default values', () => {
  const googleSitemap = GoogleSitemap({
    arcSite: 'the-globe',
    globalContent: {
      content_elements: [
        {
          last_updated_date: '2018-10-05T14:28:25.674Z',
          canonical_url: '/food/2020/04/07/tips-for-safe-hand-washing',
          promo_items: {
            basic: {
              title: 'Hand Washing',
              url:
                'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
            },
          },
          headlines: {
            basic: 'Last Night’s Match: Tom Brady collects his 500th touchdown pass in the win'
             },
          language: 'en',
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
      newsTitle: 'basic'

    },
  })
  expect(googleSitemap).toMatchSnapshot()
})
