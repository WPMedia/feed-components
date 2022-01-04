// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { ANSFeed } from './json'

it('returns template with no values', () => {
  const ans = ANSFeed({
    arcSite: 'the-globe',
    globalContent: {},
    customFields: {},
  })
  expect(ans).toMatchSnapshot()
})

it('returns template with default values', () => {
  const ans = ANSFeed({
    arcSite: 'the-globe',
    globalContent: {
      content_elements: [
        {
          type: 'story',
          last_updated_date: '2020-04-07T15:02:08.918Z',
          website_url: '/food/2020/04/07/tips-for-safe-hand-washing',
          promo_items: {
            basic: {
              title: 'Hand Washing',
              url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
            },
          },
        },
        {
          type: 'story',
          last_updated_date: '2021-04-07T17:02:08.918Z',
          website_url: '/food/2021/04/07/will-we-ever-stop-hand-washing',
          content_elements: [
            {
              type: 'image',
              url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
            },
          ],
        },
        {
          type: 'video',
          last_updated_date: '2021-04-03T13:02:08.918Z',
          website_url: '/food/2021/04/03/best-sourdough-recipes',
          promo_items: { basic: { type: 'video' } },
          promo_image: {
            title: 'No kneed recipes',
            url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
          },
        },
      ],
    },
    customFields: {},
  })
  expect(ans).toMatchSnapshot()
})

it('returns template with site service values', () => {
  const ans = ANSFeed({
    arcSite: 'the-globe',
    globalContent: {
      _id: '/',
      children: [
        { _id: '/channels', children: [{ _id: '/channels/subchannels' }] },
      ],
    },
    customFields: {},
  })
  expect(ans).toMatchSnapshot()
})
