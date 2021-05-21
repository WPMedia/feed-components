// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { VideoSitemap } from './xml'

const globalContent = {
  content_elements: [
    {
      type: 'video',
      version: '0.8.0',
      canonical_url:
        '/video/2020/04/16/inexact-odyssey-a-volcom-snowboarding-film/',
      canonical_website: 'demo',
      short_url:
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
      subheadlines: {
        basic: 'Video subheadline',
      },
      description: {
        basic: 'Video Description',
      },
      credits: {},
      taxonomy: {
        tags: [],
        primary_section: {
          _id: '/video',
          name: 'Video',
          description: 'Latest videos from around the site.',
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
          height: 1080,
          width: 1440,
          filesize: 549824236,
          stream_type: 'ts',
          url: 'https://d1tf6ure8fkb0l.cloudfront.net/wp-demo/2020/04/16/5e98b4a44cedfd00019ccd14/t_45faafc2013a4185b449ceb539e3df71_name_Inexact_Odyssey__A_Volcom_Snowboarding_Film/hlsv4_master.m3u8',
          bitrate: 5400,
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
    {
      type: 'video',
      version: '0.8.0',
      canonical_url: '/video/2021/04/16/kittend/',
      last_updated_date: '2021-04-16T19:55:14Z',
      display_date: '2021-04-16T19:55:25Z',
      headlines: {
        basic: 'Inexact Odyssey, A Volcom Snowboarding Film',
        title: 'Ababe beso bela',
      },
      subheadlines: {
        basic: 'Video subheadline',
      },
      description: {
        basic: 'Video Description',
      },
      credits: {},
      taxonomy: {
        tags: [],
        primary_section: {
          _id: '/video',
          name: 'Video',
          description: 'Latest videos from around the site.',
        },

        seo_keywords: ['sample', 'demo'],
      },
      promo_items: {
        mobile: {
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
          filesize: 545772131,
          stream_type: 'mp4',
          url: 'https://d1tf6ure8fkb0l.cloudfront.net/wp-demo/2020/04/16/5e98b4a44cedfd00019ccd14/t_45faafc2013a4185b449ceb539e3df71_name_Inexact_Odyssey__A_Volcom_Snowboarding_Film/file_1920x1080-5400-v4.mp4',
          bitrate: 5400,
          provider: 'mediaconvert',
        },
      ],
      website: 'demo',
      website_url:
        '/video/2020/04/16/inexact-odyssey-a-volcom-snowboarding-film/',
    },
  ],
}

it('returns template with default values', () => {
  const videoSitemap = VideoSitemap({
    arcSite: 'the-globe',
    globalContent: globalContent,
    customFields: {
      lastMod: 'last_updated_date',
      videoTitle: 'headlines.basic',
      sitemapVideoSelect: { bitrate: 5400, stream_type: 'mp4' },
      videoDescription: 'description.basic || subheadlines.basic',
    },
  })
  expect(videoSitemap).toMatchSnapshot()
})

it('returns template with headlines.title, description.basic 2000 values', () => {
  const videoSitemap = VideoSitemap({
    arcSite: 'the-globe',
    globalContent: globalContent,
    customFields: {
      lastMod: 'last_updated_date',
      videoTitle: 'headlines.title',
      sitemapVideoSelect: { bitrate: 5400, stream_type: 'ts' },
      videoDescription: 'description.basic',
    },
  })
  expect(videoSitemap).toMatchSnapshot()
})
it('returns template with subheadlines.basic values', () => {
  const videoSitemap = VideoSitemap({
    arcSite: 'the-globe',
    globalContent: globalContent,
    customFields: {
      lastMod: 'display_date',
      videoTitle: '',
      sitemapVideoSelect: { foo: 'bar' },
      videoDescription: '',
    },
  })
  expect(videoSitemap).toMatchSnapshot()
})
