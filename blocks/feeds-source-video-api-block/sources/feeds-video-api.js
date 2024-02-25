/* eslint-disable no-unused-vars */
// Leave CONTENT_BASE here. Without it fusion will not add a bearer token
import axios from 'axios'

import {
  ARC_ACCESS_TOKEN,
  CONTENT_BASE,
  VIDEO_BASE,
  RESIZER_TOKEN_VERSION,
  resizerKey,
} from 'fusion:environment'

import { signImagesInANSObject, resizerFetch } from '@wpmedia/feeds-resizer'

const params = {
  Uuids: 'text',
  Playlist: 'text',
  Count: 'text',
}

const fetch = (key, { cachedCall }) => {
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
  const url = `${requestUri}?${uriParams}`

  const ret = axios({
    url,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${ARC_ACCESS_TOKEN}`,
    },
    method: 'GET',
  })
    .then((result) => {
      if (resizerKey) {
        return result
      }
      return signImagesInANSObject(
        cachedCall,
        resizerFetch,
        RESIZER_TOKEN_VERSION,
      )(result)
    })
    .then(({ data }) => data)
    .catch((error) => console.log('== error ==', error))

  return ret
}

export default {
  fetch,
  schemaName: 'feeds',
  params
}
