import { VIDEO_BASE } from 'fusion:environment'

const resolve = function resolve(key) {
  let requestUri, uriParams
  let feedQuery = []
  if (key['uuid']) {
    requestUri = `${VIDEO_BASE}/api/v1/ansvideos/findByUuids`
    uriParams = [`uuids=${key['uuids']}`]

    if (key['uuids']) {
      try {
        feedQuery = JSON.parse(key['uuids'])
      } catch (error) {
        console.log(`Failed to parse uuid: ${key['uuids']}`)
      }
    }
  } else {
    requestUri = `${VIDEO_BASE}/api/v1/ans/playlists/findByPlaylist`
    uriParams = [`name=${key['name']}`, `count=${key['count']}`].join('&')

    if (key['count']) {
      try {
        feedQuery = JSON.parse(key['count'])
      } catch (error) {
        console.log(`Failed to parse count: ${key['count']}`)
      }
    }
  }

  const encodedBody = encodeURI(JSON.stringify(body))
  return `${requestUri}?body=${encodedBody}&${uriParams}`
}

export default {
  resolve,
  schemaName: 'feeds',
}
