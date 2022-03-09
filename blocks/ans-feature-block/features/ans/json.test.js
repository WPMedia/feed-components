// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { ANSFeed } from './json'

it('ANS undefined test', () => {
  const ans = ANSFeed({
    arcSite: 'the-globe',
    globalContent: undefined,
    customFields: {},
  })
  expect(ans).toMatchSnapshot()
})

it('returns ANS from results set', () => {
  const ans = ANSFeed({
    arcSite: 'the-globe',
    globalContent: {
      type: 'results',
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

it('returns ANS from navigation set', () => {
  const ans = ANSFeed({
    arcSite: 'the-globe',
    globalContent: {
      _id: '/',
      _website: 'demo',
      name: 'Demo',
      inactive: false,
      node_type: 'section',
      parent: null,
      ancestors: null,
      order: null,
      children: [
        {
          _id: '/channels',
          name: 'Channels',
          _website: 'demo',
          inactive: false,
          node_type: 'section',
          children: [
            {
              _id: '/channels/ms-teams',
              name: 'MS Teams',
              _website: 'demo',
              inactive: false,
              node_type: 'section',
              children: [],
            },
            {
              _id: '/channels/slack',
              name: 'Slack',
              _website: 'demo',
              inactive: false,
              node_type: 'section',
              children: [],
            },
            {
              _id: '/channels/twitter',
              name: 'Twitter',
              _website: 'demo',
              inactive: false,
              node_type: 'section',
              children: [],
            },
          ],
        },
      ],
    },
    customFields: {},
  })
  expect(ans).toMatchSnapshot()
})

it('returns ANS for story', () => {
  const ans = ANSFeed({
    arcSite: 'the-globe',
    globalContent: {
      _id: 'ABCD1234',
      type: 'story',
      last_updated_date: '2020-04-07T15:02:08.918Z',
      website_url: '/food/2020/04/07/tips-for-safe-hand-washing',
      content_elements: [
        { type: 'text', content: 'body goes here' },
        { type: 'text', content: 'second paragraph goes here' },
      ],
      promo_items: {
        basic: {
          title: 'Hand Washing',
          url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
        },
      },
    },
    customFields: {},
  })
  expect(ans).toMatchSnapshot()
})
