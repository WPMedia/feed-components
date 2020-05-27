import { formatSearchObject, findVideo } from './'

const video = {
  type: 'video',
  canonical_url: '/video/2020/05/14/master-cicerone/',
  headlines: { basic: 'Master Cicerone', meta_title: 'Cicerone' },
  streams: [
    {
      height: 180,
      width: 320,
      filesize: 4004400,
      stream_type: 'ts',
      url:
        'https://d1tf6ure8fkb0l.cloudfront.net/wp-demo/2020/05/14/5ebd7b0ecff47e0001009e45/t_f73d83bb88b643139de8b94df2ce4eee_name_Meet_the_world_s_11th_Master_Cicerone/mobile.m3u8',
      bitrate: 160,
      provider: 'mediaconvert',
    },
    {
      height: 360,
      width: 640,
      filesize: 5624396,
      stream_type: 'ts',
      url:
        'https://d1tf6ure8fkb0l.cloudfront.net/wp-demo/2020/05/14/5ebd7b0ecff47e0001009e45/t_f73d83bb88b643139de8b94df2ce4eee_name_Meet_the_world_s_11th_Master_Cicerone/mobile.m3u8',
      bitrate: 300,
      provider: 'mediaconvert',
    },
    {
      height: 360,
      width: 640,
      filesize: 7860813,
      stream_type: 'mp4',
      url:
        'https://d1tf6ure8fkb0l.cloudfront.net/wp-demo/2020/05/14/5ebd7b0ecff47e0001009e45/t_f73d83bb88b643139de8b94df2ce4eee_name_Meet_the_world_s_11th_Master_Cicerone/file_640x360-600-v3.mp4',
      bitrate: 600,
      provider: 'mediaconvert',
    },
    {
      height: 480,
      width: 854,
      filesize: 14291130,
      stream_type: 'mp4',
      url:
        'https://d1tf6ure8fkb0l.cloudfront.net/wp-demo/2020/05/14/5ebd7b0ecff47e0001009e45/t_f73d83bb88b643139de8b94df2ce4eee_name_Meet_the_world_s_11th_Master_Cicerone/file_854x480-1200-v3_1.mp4',
      bitrate: 1200,
      provider: 'mediaconvert',
    },
  ],
}

it('validate empty search object', () => {
  const shape = formatSearchObject({})
  expect(shape).toStrictEqual([])
})

it('validate one key search object', () => {
  const shape = formatSearchObject({ key: 'value' })
  // prettier-ignore
  expect(shape).toStrictEqual(["key == `value`"])
})

it('validate two keys in search object', () => {
  const shape = formatSearchObject({ key1: 'value1', key2: 'value2' })
  // prettier-ignore
  expect(shape).toStrictEqual([
        "key1 == `value1`",
        "key2 == `value2`"
    ])
})

it('empty video', () => {
  const shape = { key1: 'value1', key2: 'value2' }
  const videoStream = findVideo(video, shape)
  // prettier-ignore
  expect(videoStream).toBeUndefined()
})

it('find mp4 video', () => {
  const shape = { stream_type: 'mp4', bitrate: 600 }
  const videoStream = findVideo(video, shape)
  // prettier-ignore
  expect(videoStream).toStrictEqual({
        "bitrate": 600,
        "filesize": 7860813,
        "height": 360,
        "provider": "mediaconvert",
        "stream_type": "mp4",
        "url": "https://d1tf6ure8fkb0l.cloudfront.net/wp-demo/2020/05/14/5ebd7b0ecff47e0001009e45/t_f73d83bb88b643139de8b94df2ce4eee_name_Meet_the_world_s_11th_Master_Cicerone/file_640x360-600-v3.mp4",
        "width": 640,
    })
})
