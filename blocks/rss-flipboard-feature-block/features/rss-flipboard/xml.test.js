// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { FlipboardRss } from './xml'

const articles = {
  content_elements: [
    {
      display_date: '2020-04-07T15:02:08.918Z',
      website_url: '/food/2020/04/07/tips-for-safe-hand-washing',
      promo_items: {
        basic: {
          type: 'image',
          title: 'Hand Washing',
          url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
          caption: 'Hand washing can be fun if you make it a song',
          credits: { by: [{ name: 'Harold Hands' }] },
        },
      },
      credits: {
        by: [
          { _id: 'john-smith', name: 'John Smith' },
          { _id: 'jane-doe', name: 'Jane Doe' },
        ],
      },
      headlines: { basic: 'Tips for Safe Hand washing' },
      description: { basic: 'Tips to keep you wash for 20 seconds' },
      subheadlines: { basic: 'This is from the subheadlines' },
      content_elements: [
        { type: 'text', content: 'try singing the happy birthday song' },
        { type: 'text', content: 'be sure to wash your thumbs' },
        {
          type: 'image',
          url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/QHOCF6YFIZCUFIXBVEAXENGFFM.jpg',
          title: 'Test Title',
          caption: 'test caption',
          credits: { by: [{ name: 'John Smith' }] },
        },
      ],
      taxonomy: {
        primary_section: { name: 'coronvirus' },
      },
    },
  ],
}

it('returns Flipboard template with default values', () => {
  const rss = FlipboardRss({
    requestUri: 'http://localhost/arc/outboundfeeds/flipboard/?outputType=xml',
    arcSite: 'demo',
    globalContent: {
      ...articles,
    },
    customFields: {
      channelTitle: '',
      channelDescription: '',
      channelCopyright: '',
      channelTTL: '1',
      channelUpdatePeriod: 'hourly',
      channelUpdateFrequency: '1',
      channelCategory: '',
      channelLogo: '',
      itemTitle: 'headlines.basic',
      itemDescription: 'description.basic',
      pubDate: 'display_date',
      itemCredits: 'credits.by[].name',
      itemCategory: '',
      promoItemsJmespath: 'promo_items.basic',
      imageTitle: 'title',
      imageCaption: 'caption',
      imageCredits: 'credits.by[].name',
      includeContent: 0,
      resizerKVP: {},
    },
  })
  expect(rss).toMatchSnapshot({
    rss: {
      channel: {
        lastBuildDate: expect.stringMatching(
          /\w+, \d+ \w+ \d{4} \d{2}:\d{2}:\d{2} \+0000/,
        ),
      },
    },
  })
})

it('returns Flipboard template with custom values', () => {
  const rss = FlipboardRss({
    requestUri: 'http://localhost/arc/outboundfeeds/flipboard/?outputType=xml',
    arcSite: 'demo',
    globalContent: {
      ...articles,
    },
    customFields: {
      channelTitle: 'The Daily Prophet',
      channelDescription: "All the news that's fit to print",
      channelCopyright: '2020 The Washington Post LLC',
      channelTTL: '60',
      channelUpdatePeriod: 'weekly',
      channelUpdateFrequency: '1',
      channelCategory: 'news',
      channelLogo:
        'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
      itemTitle: 'headlines.seo || headlines.basic',
      itemDescription: 'subheadlines.basic || description.basic',
      pubDate: 'display_date',
      itemCredits: 'credits.by._id',
      itemCategory: 'taxonomy.primary_section.name',
      resizerKVP: { width: 640, height: 480 },
      promoItemsJmespath: 'promo_items.basic',
      imageTitle: 'headlines.basic || title',
      imageCaption: 'subheadlines.basic || caption',
      imageCredits: 'credits.by[].name',
      includeContent: 'all',
    },
  })
  expect(rss).toMatchSnapshot({
    rss: {
      channel: {
        lastBuildDate: expect.stringMatching(
          /\w+, \d+ \w+ \d{4} \d{2}:\d{2}:\d{2} \+0000/,
        ),
      },
    },
  })
})

it('returns Flipboard template with empty values', () => {
  const rss = FlipboardRss({
    requestUri: 'http://localhost/arc/outboundfeeds/flipboard/?outputType=xml',
    arcSite: 'demo',
    globalContent: {
      ...articles,
    },
    customFields: {
      channelTitle: '',
      channelDescription: '',
      channelCopyright: '',
      channelTTL: '',
      channelUpdatePeriod: '',
      channelUpdateFrequency: '',
      channelCategory: '',
      channelLogo: '',
      itemTitle: '',
      itemDescription: '',
      pubDate: 'display_date',
      itemCredits: '',
      itemCategory: '',
      promoItemsJmespath: '',
      imageTitle: '',
      imageCaption: '',
      imageCredits: '',
      includeContent: '',
      resizerKVP: {},
    },
  })
  expect(rss).toMatchSnapshot({
    rss: {
      channel: {
        lastBuildDate: expect.stringMatching(
          /\w+, \d+ \w+ \d{4} \d{2}:\d{2}:\d{2} \+0000/,
        ),
      },
    },
  })
})
