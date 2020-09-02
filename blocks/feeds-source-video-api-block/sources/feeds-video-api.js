/* eslint-disable no-unused-vars */
// Leave CONTENT_BASE here. Without it fusion will not add a bearer token
import { CONTENT_BASE, VIDEO_BASE } from 'fusion:environment'

const resolve = function resolve(key) {
  let requestUri, uriParams
  if (key) {
    if (key.Uuids) {
      requestUri = `${VIDEO_BASE}/api/v1/ansvideos/findByUuids`
      uriParams = 'uuids=' + key.Uuids.split(',').join('&uuids=')
    } else {
      requestUri = `${VIDEO_BASE}/api/v1/ans/playlists/findByPlaylist`
      uriParams = `name=${key.Playlist}&count=${key.Count || 10}`
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
