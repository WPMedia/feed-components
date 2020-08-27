// prettier-ignore
import { CONTENT_BASE, VIDEO_BASE } from 'fusion:environment'

const resolve = function resolve(key) {
  let requestUri, uriParams
  if (key) {
    if (key.Uuids) {
      requestUri = `${VIDEO_BASE}/api/v1/ansvideos/findByUuids`
      uriParams = [`uuids=${key.Uuids}`]
    } else {
      const count = key.Count || 10
      requestUri = `${VIDEO_BASE}/api/v1/ans/playlists/findByPlaylist`
      uriParams = [`name=${key.Playlist}`, `count=${count}`].join('&')
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
