import { VIDEO_BASE } from 'fusion:environment'

const resolve = function resolve(key) {
  let requestUri, uriParams
  if (key) {
    if (key && key.uuids) {
      requestUri = `${VIDEO_BASE}/api/v1/ansvideos/findByUuids`
      uriParams = [`uuids=${key.uuids}`]
    } else {
      let count
      !key.count ? (count = 10) : (count = key.count)
      requestUri = `${VIDEO_BASE}/api/v1/ans/playlists/findByPlaylist`
      uriParams = [`name=${key.name}`, `count=${count}`].join('&')
    }
  }
  return `${requestUri}?${uriParams}`
}

export default {
  resolve,
  schemaName: 'feeds',
  params: {
    Uuids: 'text',
    Playlist: 'text',
    Count: 'text',
  },
}
