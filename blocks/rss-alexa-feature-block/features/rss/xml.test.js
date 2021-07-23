// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { Rss, getURLType } from './xml'

const articles = {
  content_elements: [
    {
      display_date: '2020-04-07T15:02:08.918Z',
      website_url: '/food/2020/04/07/tips-for-safe-hand-washing',
      promo_items: {
        basic: {
          title: 'Hand Washing',
          url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
          caption: 'Hand washing can be fun if you make it a song',
          credits: { by: [{ name: 'Harold Hands' }] },
        },
      },
      credits: {
        by: [
          { name: 'John Smith', _id: 'john-smith' },
          { name: 'Jane Doe', _id: 'jane-doe' },
        ],
      },
      headlines: { basic: 'Tips for Safe Hand washing' },
      description: { basic: 'Tips to keep you wash for 20 seconds' },
      subheadlines: { basic: 'This is from the subheadlines' },
      content_elements: [
        { type: 'text', content: 'try singing the happy birthday song' },
        { type: 'text', content: 'be sure to wash your thumbs' },
        {
          _id: 'F3SWUDSWAFCCBIM6TKRM2J6DOA',
          type: 'audio',
          version: '0.10.6',
          streams: [
            {
              url: 'https://clark.com/wp-content/uploads/2021/01/Ask-Clark_GameStop_2021.mp3?_=4',
            },
          ],
          additional_properties: {
            class: ['wp-audio-shortcode'],
            controls: 'controls',
            id: 'audio-182053-5',
            preload: 'none',
            style: 'width: 100%;',
          },
        },
      ],
      taxonomy: {
        primary_section: { name: 'coronvirus' },
      },
    },
    {
      _id: 'ABCD',
      version: '0.10.2',
      type: 'story',
      display_date: '2020-04-07T15:02:08.918Z',
    },
  ],
}

it('returns Alexa template with default values', () => {
  const rss = Rss({
    arcSite: 'demo',
    globalContent: {
      ...articles,
    },
    customFields: {
      audioAvailable: "content_elements[?type=='audio'].streams[].url|[0]",
      channelTitle: '',
      channelDescription: '',
      channelPath: '/arc/outboundfeeds/alexa/',
      channelCopyright: '',
      channelTTL: '1',
      channelCategory: '',
      channelLogo: '',
      itemTitle: 'headlines.basic',
      pubDate: 'display_date',
      itemCategory: '',
      includePromo: true,
      includeContent: 0,
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

it('returns Alexa template with custom values', () => {
  const rss = Rss({
    arcSite: 'demo',
    globalContent: {
      ...articles,
    },
    customFields: {
      audioAvailable: "content_elements[?type=='audio'].streams[].url|[0]",
      channelTitle: 'The Daily Prophet',
      channelDescription: "All the news that's fit to print",
      channelPath: '/arc/outboundfeeds/alexa/',
      channelCopyright: '2020 The Washington Post LLC',
      channelTTL: '60',
      channelCategory: 'news',
      channelLogo:
        'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
      itemTitle: 'headlines.seo || headlines.basic',
      pubDate: 'display_date',
      itemCategory: 'taxonomy.primary_section.name',
      includePromo: true,
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

describe('check getURLType', () => {
  it('return type is jpeg if url extension id .jpeg', () => {
    const url = getURLType(
      'https://cloudfront-us-east-1.images.arcpublishing.com/demo/GSVDM4QTMBBQZNY7GAVHKQGEFM.jpeg',
    )
    expect(url.type).toEqual('image/jpeg')
  })

  it('return type is JPG if url extension id .JPG', () => {
    const url = getURLType(
      'https://cloudfront-us-east-1.images.arcpublishing.com/demo/GSVDM4QTMBBQZNY7GAVHKQGEFM.JPG',
    )
    expect(url.type).toEqual('image/jpeg')
  })

  it('return type is mp4 if url extension id .mp4', () => {
    const vurl = getURLType(
      'https://cloudfront-us-east-1.images.arcpublishing.com/demo/GSVDM4QTMBBQZNY7GAVHKQGEFM.mp4',
    )
    expect(vurl.type).toEqual('video/mp4')
  })

  it('show default return type  if url does not have extension', () => {
    const vurl = getURLType(
      'https://cloudfront-us-east-1.images.arcpublishing.com/demo/GSVDM4QTMBBQZNY7GAVHKQGEFM',
    )
    expect(vurl.type).toEqual('audio/mp3')
  })

  it('show return type is mp3 if url  have .mp3 AND parameter', () => {
    const vurl = getURLType(
      'https://clark.com/wp-content/uploads/2021/01/Ask-Clark_GameStop_2021.mp3?_=4',
    )
    expect(vurl.type).toEqual('audio/mp3')
  })
})
