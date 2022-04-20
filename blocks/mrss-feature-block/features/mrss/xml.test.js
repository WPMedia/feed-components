// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { Mrss } from './xml'

const articles = {
  content_elements: [
    {
      type: 'video',
      version: '0.8.0',
      canonical_url:
        '/video/2020/04/16/inexact-odyssey-a-volcom-snowboarding-film/',
      created_date: '2020-04-16T19:40:20Z',
      last_updated_date: '2020-04-16T19:55:14Z',
      publish_date: '2020-04-16T19:55:25Z',
      first_publish_date: '2020-04-16T19:55:25Z',
      display_date: '2020-04-16T19:55:25Z',
      headlines: {
        basic: 'Inexact Odyssey, A Volcom Snowboarding Film',
        title: 'Ababe beso bela',
      },
      credits: {},
      taxonomy: {
        tags: [],
        primary_section: {
          _id: '/video',
          _website: 'demo',
          type: 'section',
          version: '0.6.0',
          name: 'Video',
          description: 'Latest videos from around the site.',
          path: '/video',
          parent_id: '/',
          parent: {
            default: '/',
          },
        },
        seo_keywords: ['sample', 'demo'],
      },
      promo_items: {
        basic: {
          type: 'image',
          version: '0.5.8',
          credits: {},
          caption: 'Inexact Odyssey',
          url: 'https://dv8csq7v0ltdn.cloudfront.net/04-16-2020/t_95d8de29ea3b41caac132f0462c5c71a_name_file_1920x1080_5400_v4_.jpg',
          width: 1440,
          height: 1080,
        },
      },
      duration: 789060,
      video_type: 'clip',
      streams: [
        {
          height: 1080,
          width: 1440,
          filesize: 474649052,
          stream_type: 'ts',
          url: 'https://d1tf6ure8fkb0l.cloudfront.net/wp-demo/2020/04/16/5e98b4a44cedfd00019ccd14/t_45faafc2013a4185b449ceb539e3df71_name_Inexact_Odyssey__A_Volcom_Snowboarding_Film/hd.m3u8',
          bitrate: 4500,
          provider: 'mediaconvert',
        },
        {
          height: 720,
          width: 1280,
          url: 'https://d3ujdjwa458jgt.cloudfront.net/out/v1/87998c783fb94bf0b965847d5c8b4392/index.m3u8',
          bitrate: 2000,
          filesize: 549824236,
          stream_type: 'ts',
          provider: 'mediaconvert',
        },
        {
          height: 1080,
          width: 1440,
          filesize: 545772131,
          stream_type: 'mp4',
          url: 'https://d1tf6ure8fkb0l.cloudfront.net/wp-demo/2020/04/16/5e98b4a44cedfd00019ccd14/t_45faafc2013a4185b449ceb539e3df71_name_Inexact_Odyssey__A_Volcom_Snowboarding_Film/file_1920x1080-5400-v4.mp4',
          bitrate: 5400,
          provider: 'mediaconvert',
        },
      ],
      subtitles: {},
      promo_image: {
        type: 'image',
        version: '0.5.8',
        credits: {},
        caption: 'Inexact Odyssey',
        url: 'https://dv8csq7v0ltdn.cloudfront.net/04-16-2020/t_95d8de29ea3b41caac132f0462c5c71a_name_file_1920x1080_5400_v4_.jpg',
        width: 1440,
        height: 1080,
      },
      website: 'demo',
      website_url:
        '/video/2020/04/16/inexact-odyssey-a-volcom-snowboarding-film/',
    },
  ],
}

it.only('returns MRSS template with default values', () => {
  const video = Mrss({
    requestUri: 'http://localhost.com/arc/outboundfeeds/mrss/?outputType=xml',
    arcSite: 'the-globe',
    globalContent: articles,
    customFields: {
      channelTitle: '',
      channelDescription: '',
      channelLanguage: 'es',
      channelLogo: '',
      imageCaption: 'subheadlines.basic || caption',
      imageCredits: 'credits.by[].name',
      itemTitle: 'headlines.seo || headlines.basic',
      itemDescription: 'subheadlines.basic || description.basic',
      pubDate: 'display_date',
      itemCategory: 'taxonomy.primary_section.name',
      selectVideo: { bitrate: 2000, stream_type: 'ts' },
      resizerKVP: {},
      promoItemsJmespath: 'promo_items.basic',
    },
  })
  expect(video).toMatchSnapshot({
    rss: {
      channel: {
        pubDate: expect.stringMatching(
          /\w+, \d+ \w+ \d{4} \d{2}:\d{2}:\d{2} \+0000/,
        ),
      },
    },
  })
})

it.only('returns MRSS template without values', () => {
  const video = Mrss({
    requestUri: 'http://localhost.com/arc/outboundfeeds/mrss/?outputType=xml',
    arcSite: 'the-globe',
    globalContent: articles,
    customFields: {
      channelTitle: '',
      channelDescription: '',
      channelLanguage: '',
      channelLogo: '',
      imageCaption: '',
      imageCredits: '',
      itemTitle: '',
      itemDescription: '',
      pubDate: 'display_date',
      itemCategory: '',
      selectVideo: {},
      resizerKVP: {},
      promoItemsJmespath: '',
    },
  })
  expect(video).toMatchSnapshot({
    rss: {
      channel: {
        pubDate: expect.stringMatching(
          /\w+, \d+ \w+ \d{4} \d{2}:\d{2}:\d{2} \+0000/,
        ),
      },
    },
  })
})
