#feeds-video-api

The feeds content source endpoints for Video API are:

## /api/v1/ansvideos/findByUuids

Returns video with the given UUIDs parameters or an empty list.
A sample query: video-api.demo.arcpublishing.com/api/v1/ansvideos/findByUuids?uuids=db9862d6-be50-11e7-9294-705f80164f6e&uuids=4594b2c0-6cc1-11e7-abbc-a53480672286

Results:

```
{
  "playlistName": "animals",
  "version": "0.5.8",
  "playlistItems": [
    {
      "type": "video",
      "_id": "d9e368e6-d4f3-11e7-9ad9-ca0619edfa05",
      "version": "0.5.8",
      "canonical_url": "\/national\/police-chase-horse-through-pa-town\/2017\/11\/29\/d9e368e6-d4f3-11e7-9ad9-ca0619edfa05_video.html",
      "short_url": "http:\/\/wapo.st\/2Aj7beh",
      "created_date": "2017-11-29T10:55:44Z",
      "last_updated_date": "2017-11-29T17:47:49Z",
      "publish_date": "2017-11-29T17:48:26Z",
      "first_publish_date": "2017-11-29T17:48:20Z",
      "display_date": "2017-11-29T17:12:24Z",
      "headlines": {
        "basic": "Police chase horse through Pa. town",
        "meta_title": "Police chase horse through Pa. town"
      },
      "subheadlines": {
        "basic": "Police in Phoenixville, Pa, chased down a horse that had thrown off its rider on Nov. 28."
      },
      "description": {
        "basic": "Police in Phoenixville, Pa, chased down a horse that had thrown off its rider on Nov. 28."
      },
      "credits": {
        "by": [
          {
            "type": "author",
            "name": "",
            "org": "Phoenixville Police Department"
          }
        ]
      },
      "taxonomy": {
        "tags": [

        ],
        "primary_site": {
          "type": "site",
          "_id": "\/national",
          "version": "0.5.8",
          "name": "National",
          "path": "\/national",
          "primary": true
        },
        "sites": [
          {
            "type": "site",
            "_id": "\/national",
            "version": "0.5.8",
            "name": "National",
            "path": "\/national",
            "primary": true
          }
        ],
        "seo_keywords": [
          "Phoenixville-Pennsylvania",
          "Riderless horse",
          "North America",
          "Americas",
          "Animal",
          "Law",
          "Horse",
          "Police",
          "Pennsylvania",
          "United States"
        ]
      },
      "promo_items": {
        "basic": {
          "type": "image",
          "version": "0.5.8",
          "credits": {

          },
          "url": "https:\/\/d2us7r8wmw7tny.cloudfront.net\/11-29-2017\/t_1511975664555_name_1___1920x1080___30p_00_00_13_20_Still012.jpg",
          "width": 1920,
          "height": 1080
        }
      },
      "owner": {
        "name": ""
      },
      "planning": {
        "scheduling": {

        }
      },
      "revision": {
        "published": true
      },
      "syndication": {
        "search": false
      },
      "source": {
        "name": "Phoenixville Police Department",
        "system": "Goldfish",
        "edit_url": "https:\/\/demo.arcpublishing.com\/goldfish\/video\/5a1e9230e4b0fc5faac74b24"
      },
      "tracking": {
        "in_url_headline": "29"
      },
      "additional_properties": {
        "trackAsPool": false,
        "subsection": "National",
        "videoCategory": "wirestoryful",
        "gifAsThumbnail": false,
        "videoId": "5a1e9230e4b0fc5faac74b24",
        "vertical": false,
        "embedContinuousPlay": true,
        "published": true,
        "imageResizerUrls": [

        ],
        "advertising": {
          "adSetUrls": null,
          "forceAd": false,
          "playAds": true,
          "playVideoAds": true,
          "enableAutoPreview": true,
          "commercialAdNode": "\/national",
          "autoPlayPreroll": false,
          "allowPrerollOnDomain": false
        },
        "videoAdZone": "wpni.video.national",
        "lastPublishedBy": {
          "email": "Patrick.Martin@washpost.com",
          "name": "Patrick",
          "lastname": "Martin"
        },
        "platform": "desktop",
        "playVideoAds": true,
        "playlist": "Animals",
        "forceClosedCaptionsOn": false,
        "doNotShowTranscripts": true,
        "useVariants": false,
        "playlistTags": [
          "animals"
        ],
        "firstPublishedBy": {
          "email": "Patrick.Martin@washpost.com",
          "name": "Patrick",
          "lastname": "Martin"
        }
      },
      "duration": 62741,
      "video_type": "clip",
      "youtube_content_id": "vIU3eT3kTog",
      "streams": [
        {
          "height": 480,
          "width": 854,
          "filesize": 10492679,
          "stream_type": "mp4",
          "url": "https:\/\/videos.posttv.com\/washpost-production\/Phoenixville_Police_Department\/20171129\/5a1e9230e4b0fc5faac74b24\/5a1eebb4e4b0169f2f4a10cf_1439412357318-vhunw0_t_1511975867116_854_480_1200.mp4",
          "bitrate": 1200,
          "provider": "elastictranscoder"
        }
       ],
       "subtitles": {

             },
             "promo_image": {
               "type": "image",
               "version": "0.5.8",
               "credits": {

               },
               "url": "https:\/\/d2us7r8wmw7tny.cloudfront.net\/10-28-2017\/t_1509210274395_name_Screen_Shot_2017_10_28_at_1_03_13_PM.png",
               "width": 1920,
               "height": 1033
             },
             "embed_html": "<div class=\"powa\" id=\"powa-2074db88-bb9e-11e7-9b93-b97043e57a22\" data-org=\"demo\" data-uuid=\"2074db88-bb9e-11e7-9b93-b97043e57a22\" data-aspect-ratio=\"0.562\"><script src=\"https:\/\/d328y0m0mtvzqc.cloudfront.net\/prod\/powaBoot.js\"><\/script><\/div>"
           }
         ]
       }
```

## /api/v1/ans/playlists/findByPlaylist

Returns playlist by playlist name parameter and a count of videos to return
A sample query: video-api.demo.arcpublishing.com/api/v1/ans/playlists/findByPlaylist?name=animals

Results:

```$xslt
[
  {
    "type": "video",
    "_id": "db9862d6-be50-11e7-9294-705f80164f6e",
    "version": "0.5.8",
    "canonical_url": "\/local\/adorable-video-of-lemurs-eating-treats-on-halloween\/2017\/10\/31\/db9862d6-be50-11e7-9294-705f80164f6e_video.html",
    "short_url": "http:\/\/wapo.st\/2iOExNG",
    "created_date": "2017-10-31T15:33:29Z",
    "last_updated_date": "2017-11-29T18:57:57Z",
    "publish_date": "2017-10-31T15:36:59Z",
    "first_publish_date": "2017-10-31T15:36:53Z",
    "display_date": "2017-10-31T15:27:40Z",
    "headlines": {
      "basic": "Adorable video of lemurs eating treats on Halloween",
      "meta_title": "Lemur zoo Halloween"
    },
    "subheadlines": {
      "basic": "The Smithsonian's National Zoo shared video of their lemurs digging into raisins and fruit inside pumpkins."
    },
    "description": {
      "basic": "The Smithsonian's National Zoo shared video of their lemurs digging into raisins and fruit inside pumpkins."
    },
    "credits": {
      "by": [
        {
          "type": "author",
          "name": "",
          "org": "National Zoo"
        }
      ]
    },
    "taxonomy": {
      "tags": [
        {
          "text": "news"
        },
        {
          "text": "other"
        }
      ],
      "primary_site": {
        "type": "site",
        "_id": "\/local",
        "version": "0.5.8",
        "name": "Local",
        "path": "\/local",
        "primary": true
      },
      "sites": [
        {
          "type": "site",
          "_id": "\/local",
          "version": "0.5.8",
          "name": "Local",
          "path": "\/local",
          "primary": true
        }
      ],
      "seo_keywords": [
        "mueller indictment",
        "donald trump",
        "trump",
        "2016",
        "republican",
        "politics",
        "presidential election",
        "gop",
        "apprentice",
        "election",
        "taxes",
        "IRS follow the money projection",
        "Robin Bell projection",
        "special counsel Robert Mueller",
        "trump campaign aides indictment",
        "president trump russia collussion",
        "trump tax returns",
        "mueller investigation",
        "halloween animals",
        "zoo",
        "national zoo",
        "smithsonian",
        "panda",
        "smithsonian national zoo",
        "local",
        "animals",
        "mei xiang",
        "panda cub",
        "baby panda",
        "halloween national zoo",
        "halloween treats"
      ]
    },
    "promo_items": {
      "basic": {
        "type": "image",
        "version": "0.5.8",
        "credits": {

        },
        "url": "https:\/\/d2us7r8wmw7tny.cloudfront.net\/10-31-2017\/t_1509463945300_name_20171031_lemurseatingtreats_handout_scaled.jpg",
        "width": 1920,
        "height": 1080
      }
    },
    "owner": {
      "name": ""
    },
    "planning": {
      "scheduling": {

      }
    },
    "revision": {
      "published": true
    },
    "syndication": {
      "search": true
    },
    "source": {
      "name": "National Zoo",
      "system": "Goldfish",
      "edit_url": "https:\/\/demo.arcpublishing.com\/goldfish\/video\/59f897c9e4b0183579573977"
    },
    "tracking": {
      "in_url_headline": "31"
    },
    "additional_properties": {
      "trackAsPool": false,
      "subsection": "Local",
      "videoCategory": "other",
      "gifAsThumbnail": false,
      "videoId": "59f897c9e4b0183579573977",
      "vertical": false,
      "embedContinuousPlay": true,
      "published": true,
      "imageResizerUrls": [

      ],
      "advertising": {
        "adSetUrls": null,
        "forceAd": false,
        "playAds": true,
        "playVideoAds": true,
        "enableAutoPreview": true,
        "commercialAdNode": "\/national",
        "autoPlayPreroll": false,
        "allowPrerollOnDomain": false
      },
      "videoAdZone": "wpni.video.national",
      "lastPublishedBy": {
        "email": "Gavin.McDonald@washpost.com",
        "name": "Gavin",
        "lastname": "McDonald"
      },
      "platform": "desktop",
      "playVideoAds": true,
      "playlist": "Holidays",
      "forceClosedCaptionsOn": false,
      "doNotShowTranscripts": true,
      "useVariants": true,
      "playlistTags": [
        "holidayvids"
      ],
      "firstPublishedBy": {
        "email": "Claritza.Jimenez@washpost.com",
        "name": "Claritza",
        "lastname": "Jimenez"
      }
    },
    "duration": 35989,
    "video_type": "clip",
    "youtube_content_id": "uWBsQpI-DQc",
    "streams": [
      {
        "height": 480,
        "width": 854,
        "filesize": 6238391,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_1439412357318-vhunw0_t_1509464032869_854_480_1200.mp4",
        "bitrate": 1200,
        "provider": "elastictranscoder"
      },
      {
        "height": 1080,
        "width": 1920,
        "filesize": 25956597,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_1439411933958-zgatlb_t_1509464032869_1920_1080_5400.mp4",
        "bitrate": 5400,
        "provider": "elastictranscoder"
      },
      {
        "height": 360,
        "width": 640,
        "filesize": 2217648,
        "stream_type": "ts",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_t_1509464033219_mobile.m3u8",
        "bitrate": 300,
        "provider": "elastictranscoder"
      },
      {
        "height": 180,
        "width": 320,
        "filesize": 1555512,
        "stream_type": "ts",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_t_1509464033219_mobile.m3u8",
        "bitrate": 160,
        "provider": "elastictranscoder"
      },
      {
        "height": 1080,
        "width": 1920,
        "filesize": 22839180,
        "stream_type": "ts",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_t_1509464033219_hd.m3u8",
        "bitrate": 4500,
        "provider": "elastictranscoder"
      },
      {
        "height": 720,
        "width": 1280,
        "filesize": 10093423,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_1439399835595-cf9g26_t_1509464032869_1280_720_2000.mp4",
        "bitrate": 2000,
        "provider": "elastictranscoder"
      },
      {
        "height": 360,
        "width": 640,
        "filesize": 1983876,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_1462301751346-fs7oqd_t_1509464032869_640_360_300.mp4",
        "bitrate": 300,
        "provider": "elastictranscoder"
      },
      {
        "height": 360,
        "width": 640,
        "filesize": 3711496,
        "stream_type": "ts",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_t_1509464033219_mobile.m3u8",
        "bitrate": 600,
        "provider": "elastictranscoder"
      },
      {
        "height": 180,
        "width": 320,
        "filesize": 1348706,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_1439413190599-3q5d44_t_1509464032869_320_180_160.mp4",
        "bitrate": 160,
        "provider": "elastictranscoder"
      },
      {
        "height": 360,
        "width": 640,
        "filesize": 3393810,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_1439412153584-wn5qra_t_1509464032869_640_360_600.mp4",
        "bitrate": 600,
        "provider": "elastictranscoder"
      },
      {
        "height": 720,
        "width": 1280,
        "filesize": 10600380,
        "stream_type": "ts",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_t_1509464033219_master.m3u8",
        "bitrate": 2000,
        "provider": "elastictranscoder"
      },
      {
        "height": 1080,
        "width": 1920,
        "filesize": 235151904,
        "stream_type": "hls",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_t_1509464033219_hlsv4_master.m3u8",
        "bitrate": 4500,
        "provider": "elastictranscoder"
      },
      {
        "height": 360,
        "width": 640,
        "filesize": 4461159,
        "stream_type": "gif",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_1455589917779-yrd15k_t_1509464069093_640_360_400.gif",
        "bitrate": 400,
        "provider": "elastictranscoder"
      },
      {
        "height": 360,
        "width": 640,
        "filesize": 1009704,
        "stream_type": "gif-mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/TWP\/20171031\/59f897c9e4b0183579573977\/59f897dae4b0dcb9620948ee_1509128713498-xfd55s_t_1509464084210_640_360_600.mp4",
        "bitrate": 600,
        "provider": "elastictranscoder"
      }
    ],
    "subtitles": {

    },
    "promo_image": {
      "type": "image",
      "version": "0.5.8",
      "credits": {

      },
      "url": "https:\/\/d2us7r8wmw7tny.cloudfront.net\/10-31-2017\/t_1509463945300_name_20171031_lemurseatingtreats_handout_scaled.jpg",
      "width": 1920,
      "height": 1080
    },
    "embed_html": "<div class=\"powa\" id=\"powa-db9862d6-be50-11e7-9294-705f80164f6e\" data-org=\"demo\" data-uuid=\"db9862d6-be50-11e7-9294-705f80164f6e\" data-aspect-ratio=\"0.562\"><script src=\"https:\/\/d328y0m0mtvzqc.cloudfront.net\/prod\/powaBoot.js\"><\/script><\/div>"
  },
  {
    "type": "video",
    "_id": "4594b2c0-6cc1-11e7-abbc-a53480672286",
    "version": "0.5.8",
    "canonical_url": "\/national\/foster-kittens-look-for-fur-ever-homes-at-yoga-class\/2017\/07\/21\/4594b2c0-6cc1-11e7-abbc-a53480672286_video.html",
    "short_url": "http:\/\/wapo.st\/2toqUVR",
    "created_date": "2017-07-19T20:31:38Z",
    "last_updated_date": "2017-07-24T10:42:56Z",
    "publish_date": "2017-07-22T00:49:56Z",
    "first_publish_date": "2017-07-22T00:49:50Z",
    "display_date": "2017-07-19T20:25:26Z",
    "headlines": {
      "basic": "Foster kittens look for fur-ever homes at yoga class"
    },
    "subheadlines": {
      "basic": "Humane Rescue Alliance, an animal rescue service in D.C., and yoga studio, \"Yoga Heights,\" hosted a yoga class in which foster kittens roamed around with participants."
    },
    "description": {
      "basic": "Humane Rescue Alliance and Yoga Heights hosted a yoga class in which foster kittens roamed around with participants."
    },
    "credits": {
      "by": [
        {
          "type": "author",
          "name": "Elyse Samuels",
          "org": "The Washington Post"
        }
      ]
    },
    "taxonomy": {
      "tags": [

      ],
      "primary_site": {
        "type": "site",
        "_id": "\/national",
        "version": "0.5.8",
        "name": "National",
        "path": "\/national",
        "primary": true
      },
      "sites": [
        {
          "type": "site",
          "_id": "\/national",
          "version": "0.5.8",
          "name": "National",
          "path": "\/national",
          "primary": true
        }
      ],
      "seo_keywords": [
        "yoga",
        "exercise",
        "north america",
        "united states",
        "fold",
        "day",
        "show",
        "diet exercise",
        "lifestyle",
        "animals",
        "cats",
        "kittens",
        "foster cats",
        "humane rescue alliance",
        "yoga heights"
      ]
    },
    "promo_items": {
      "basic": {
        "type": "image",
        "version": "0.5.8",
        "credits": {

        },
        "url": "https:\/\/d2us7r8wmw7tny.cloudfront.net\/07-19-2017\/t_1500497254563_name_Screen_Shot_2017_07_19_at_4_31_53_PM.png",
        "width": 1920,
        "height": 1079
      }
    },
    "owner": {
      "name": "",
      "sponsored": false
    },
    "planning": {
      "scheduling": {

      }
    },
    "revision": {
      "published": true
    },
    "syndication": {
      "search": true
    },
    "source": {
      "name": "The Washington Post",
      "system": "Goldfish",
      "edit_url": "https:\/\/demo.arcpublishing.com\/goldfish\/video\/596fc1abe4b060ed6ce88785"
    },
    "tracking": {
      "in_url_headline": "21"
    },
    "additional_properties": {
      "trackAsPool": false,
      "subsection": "National",
      "videoCategory": "segments",
      "gifAsThumbnail": false,
      "videoId": "596fc1abe4b060ed6ce88785",
      "vertical": false,
      "embedContinuousPlay": true,
      "published": true,
      "imageResizerUrls": [

      ],
      "advertising": {
        "adSetUrls": null,
        "forceAd": false,
        "playAds": false,
        "playVideoAds": true,
        "enableAutoPreview": true,
        "commercialAdNode": "\/national",
        "autoPlayPreroll": false,
        "allowPrerollOnDomain": false
      },
      "videoAdZone": "wpni.video.national",
      "lastPublishedBy": {
        "email": "Elyse.Samuels@washpost.com",
        "name": "Elyse",
        "lastname": "Samuels"
      },
      "platform": "desktop",
      "playVideoAds": true,
      "playlist": "Animals",
      "forceClosedCaptionsOn": false,
      "doNotShowTranscripts": true,
      "useVariants": false,
      "playlistTags": [
        "animals"
      ],
      "firstPublishedBy": {
        "email": "Patrick.Martin@washpost.com",
        "name": "Patrick",
        "lastname": "Martin"
      }
    },
    "duration": 125376,
    "video_type": "clip",
    "youtube_content_id": "_knQ6mOxVYM",
    "streams": [
      {
        "height": 360,
        "width": 640,
        "filesize": 7410020,
        "stream_type": "ts",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_t_1500578875439_mobile.m3u8",
        "bitrate": 300,
        "provider": "elastictranscoder"
      },
      {
        "height": 480,
        "width": 854,
        "filesize": 19721247,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_1439412357318-vhunw0_t_1500578875117_854_480_1200.mp4",
        "bitrate": 1200,
        "provider": "elastictranscoder"
      },
      {
        "height": 720,
        "width": 1280,
        "filesize": 34375048,
        "stream_type": "ts",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_t_1500578875439_master.m3u8",
        "bitrate": 2000,
        "provider": "elastictranscoder"
      },
      {
        "height": 180,
        "width": 320,
        "filesize": 5224520,
        "stream_type": "ts",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_t_1500578875439_mobile.m3u8",
        "bitrate": 160,
        "provider": "elastictranscoder"
      },
      {
        "height": 1080,
        "width": 1920,
        "filesize": 74358136,
        "stream_type": "ts",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_t_1500578875439_hd.m3u8",
        "bitrate": 4500,
        "provider": "elastictranscoder"
      },
      {
        "height": 720,
        "width": 1280,
        "filesize": 31995678,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_1439399835595-cf9g26_t_1500578875117_1280_720_2000.mp4",
        "bitrate": 2000,
        "provider": "elastictranscoder"
      },
      {
        "height": 180,
        "width": 320,
        "filesize": 4439401,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_1439413190599-3q5d44_t_1500578875117_320_180_160.mp4",
        "bitrate": 160,
        "provider": "elastictranscoder"
      },
      {
        "height": 360,
        "width": 640,
        "filesize": 12151568,
        "stream_type": "ts",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_t_1500578875439_mobile.m3u8",
        "bitrate": 600,
        "provider": "elastictranscoder"
      },
      {
        "height": 1080,
        "width": 1920,
        "filesize": 82683767,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_1439411933958-zgatlb_t_1500578875117_1920_1080_5400.mp4",
        "bitrate": 5400,
        "provider": "elastictranscoder"
      },
      {
        "height": 360,
        "width": 640,
        "filesize": 6465299,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_1462301751346-fs7oqd_t_1500578875117_640_360_300.mp4",
        "bitrate": 300,
        "provider": "elastictranscoder"
      },
      {
        "height": 360,
        "width": 640,
        "filesize": 10862735,
        "stream_type": "mp4",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_1439412153584-wn5qra_t_1500578875117_640_360_600.mp4",
        "bitrate": 600,
        "provider": "elastictranscoder"
      },
      {
        "height": 1080,
        "width": 1920,
        "filesize": 2119493200,
        "stream_type": "hls",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_t_1500578875439_hlsv4_master.m3u8",
        "bitrate": 4500,
        "provider": "elastictranscoder"
      },
      {
        "height": 720,
        "width": 1280,
        "filesize": 31995678,
        "stream_type": "smil",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_t_1500578972273.smil",
        "bitrate": 2000,
        "provider": "elastictranscoder"
      },
      {
        "height": 360,
        "width": 640,
        "filesize": 2089104,
        "stream_type": "gif",
        "url": "https:\/\/videos.posttv.com\/washpost-production\/The_Washington_Post\/20170719\/596fc1abe4b060ed6ce88785\/59710415e4b0b07aa66096e7_1455589917779-yrd15k_t_1500578972702_640_360_400.gif",
        "bitrate": 400,
        "provider": "elastictranscoder"
      }
    ],
    "subtitles": {

    },
    "promo_image": {
      "type": "image",
      "version": "0.5.8",
      "credits": {

      },
      "url": "https:\/\/d2us7r8wmw7tny.cloudfront.net\/07-19-2017\/t_1500497254563_name_Screen_Shot_2017_07_19_at_4_31_53_PM.png",
      "width": 1920,
      "height": 1079
    },
    "embed_html": "<div class=\"powa\" id=\"powa-4594b2c0-6cc1-11e7-abbc-a53480672286\" data-org=\"demo\" data-uuid=\"4594b2c0-6cc1-11e7-abbc-a53480672286\" data-aspect-ratio=\"0.562\"><script src=\"https:\/\/d328y0m0mtvzqc.cloudfront.net\/prod\/powaBoot.js\"><\/script><\/div>"
  }
]
```
