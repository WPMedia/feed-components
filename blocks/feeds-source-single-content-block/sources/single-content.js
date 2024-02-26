import axios from 'axios'

import {
  ARC_ACCESS_TOKEN,
  CONTENT_BASE,
  RESIZER_TOKEN_VERSION,
  resizerKey,
} from 'fusion:environment'

import { signImagesInANSObject, resizerFetch } from '@wpmedia/feeds-resizer'

const params = {
  _id: 'text',
  website_url: 'text',
}

const fetch = (key, { cachedCall }) => {
  const urlSearch = new URLSearchParams({
    ...(key['_id'] ? { _id: key['_id'] } : { website_url: key['website_url'] }),
    ...(key['arc-site'] ? { website: key['arc-site'] } : {}),
  })

  const ret = axios({
    url: `${CONTENT_BASE}/content/v4/?${urlSearch.toString()}`,
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
  params,
  schemaName: 'ans-item',
}
