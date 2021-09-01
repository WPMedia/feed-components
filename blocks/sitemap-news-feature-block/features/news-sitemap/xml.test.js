// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { GoogleSitemap } from './xml'


const articles = {
  content_elements: [
    {
      last_updated_date: '2018-10-05T14:28:25.674Z',
      canonical_url: '/food/2020/04/07/tips-for-safe-hand-washing',
      promo_items: {
        basic: {
          type: 'image',
          title: 'Hand Washing',
          url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/STORY_ONE_IMAGE.png',
        },
      },
      headlines: {
        basic:
          'Last Night’s Match: Tom Brady collects his 500th touchdown pass in the win',
        meta_title: 'dog running outside enjoying the sunny day',
      },
      language: 'en',
      taxonomy: {
        tags: [
          {
            text: 'animal videos',
          },
        ],
      },
    },
    {
      last_updated_date: '2021-11-15T12:18:25.674Z',
      canonical_url: '/food/2021/04/07/best-sourdough-recipes',
      promo_items: {
        mobile: {
          type: 'image',
          title: 'No kneeding around',
          url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/STORY_TWO_IMAGE.png',
        },
      },
      headlines: {
        basic: 'Best Sourdough as tested by our staff',
        meta_title: 'Best Sourdough you have ever made',
      },
      language: 'en',
      taxonomy: {
        tags: [
          {
            text: 'food videos',
          },
        ],
      },
    },
  ],
}

it('returns template with default values', () => {
  const googleSitemap = GoogleSitemap({
    arcSite: 'the-globe',
    globalContent: articles,
    customFields: {
      priority: '0.5',
      includePromo: true,
      resizerKVP: {},
      changeFreq: 'always',
      lastMod: 'last_updated_date',
      imageTitle: 'title',
      imageCaption: 'caption',
      newsTitle: 'headlines.meta_title',
      newsKeywords: 'tags',
    },
  })
  expect(googleSitemap).toMatchSnapshot()
})

it('returns template with empty values', () => {
  const googleSitemap = GoogleSitemap({
    arcSite: 'the-globe',
    globalContent: articles,
    customFields: {
      priority: '',
      includePromo: true,
      resizerKVP: {},
      changeFreq: '',
      lastMod: '',
      imageTitle: '',
      imageCaption: '',
      newsTitle: '',
      newsKeywords: '',
      promoItemsJmespath: '',
    },
  })
  expect(googleSitemap).toMatchSnapshot()
})
