const jmespath = require('jmespath')

export function formatSearchObject(searchObject) {
  /* convert Object into a string usable by jmespath
   * {key: value}
   * ["key == `value`"]
   */
  const keys = Object.keys(searchObject)
  const jsmSearcher = keys.reduce((acc, key) => {
    return [...acc, `${key} == \`${searchObject[key]}\``]
  }, [])

  return jsmSearcher
}

export function findVideo(video, searchObject) {
  /* search video.streams for first video encoding that matches key, values */
  if (video && video.streams && searchObject) {
    const searchString = formatSearchObject(searchObject)
    const videoStreams = jmespath.search(
      video,
      'streams[?'.concat(searchString.join('&&'), ']'),
    )
    console.log(`wpmedia search string is ${searchString}`)
    console.log(`wpmedia video stream is ${JSON.stringify(videoStreams)}`)

    if (videoStreams.length) {
      return videoStreams[0]
    }
  }
}
