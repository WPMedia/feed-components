import { formatSearchObject, findVideo } from './'

const video = {
  type: 'video',
  headlines: { basic: 'demo race' },
  streams: [
    {
      height: 180,
      width: 320,
      filesize: 482972,
      stream_type: 'ts',
      url:
        'https://d2yx7vlhlkujyx.cloudfront.net/wp-demo/2019/10/21/5dadfa0d4cedfd0009099db1/t_bc8c554113f74eb79c98938db8eb6ee4_name_Rallye___1295/mobile.m3u8',
      bitrate: 160,
      provider: 'mediaconvert',
    },
    {
      height: 180,
      width: 320,
      filesize: 374764,
      stream_type: 'mp4',
      url:
        'https://d2yx7vlhlkujyx.cloudfront.net/wp-demo/2019/10/21/5dadfa0d4cedfd0009099db1/t_bc8c554113f74eb79c98938db8eb6ee4_name_Rallye___1295/file_320x180-160-v3.mp4',
      bitrate: 160,
      provider: 'mediaconvert',
    },
    {
      height: 1080,
      width: 1920,
      filesize: 7271088,
      stream_type: 'ts',
      url:
        'https://d2yx7vlhlkujyx.cloudfront.net/wp-demo/2019/10/21/5dadfa0d4cedfd0009099db1/t_bc8c554113f74eb79c98938db8eb6ee4_name_Rallye___1295/hlsv4_master.m3u8',
      bitrate: 5400,
      provider: 'mediaconvert',
    },
    {
      height: 1080,
      width: 1920,
      filesize: 7063304,
      stream_type: 'mp4',
      url:
        'https://d2yx7vlhlkujyx.cloudfront.net/wp-demo/2019/10/21/5dadfa0d4cedfd0009099db1/t_bc8c554113f74eb79c98938db8eb6ee4_name_Rallye___1295/file_1920x1080-5400-v4.mp4',
      bitrate: 5400,
      provider: 'mediaconvert',
    },
  ],
}

it('generates jmespath string from empty object', () => {
  const shape = formatSearchObject({})
  expect(shape).toBeDefined()
})

it('generates jmespath string from one key', () => {
  const shape = formatSearchObject({ stream_type: 'mp4' })
  expect(shape).toStrictEqual(['stream_type == `mp4`'])
})

it('generates jmespath string from two keys', () => {
  const shape = formatSearchObject({ bitrate: 5400, stream_type: 'mp4' })
  // prettier-ignore

  expect(shape).toStrictEqual([
        "bitrate == `5400`",
        "stream_type == `mp4`",
    ])
})

it('find video stream', () => {
  const videoStream = findVideo(video, { bitrate: 5400, stream_type: 'mp4' })
  expect(videoStream).toStrictEqual({
    bitrate: 5400,
    filesize: 7063304,
    height: 1080,
    provider: 'mediaconvert',
    stream_type: 'mp4',
    url:
      'https://d2yx7vlhlkujyx.cloudfront.net/wp-demo/2019/10/21/5dadfa0d4cedfd0009099db1/t_bc8c554113f74eb79c98938db8eb6ee4_name_Rallye___1295/file_1920x1080-5400-v4.mp4',
    width: 1920,
  })
})
