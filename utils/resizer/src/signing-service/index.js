import axios from 'axios'
import {
  ARC_ACCESS_TOKEN,
  CONTENT_BASE,
  SIGNING_SERVICE_DEFAULT_APP,
  RESIZER_TOKEN_VERSION,
} from 'fusion:environment'
import handleFetchError from '../handle-fetch-error/index.js'

const params = {
  id: 'text',
  service: 'text',
  serviceVersion: 'text',
}

export const fetch = ({
  id,
  service = SIGNING_SERVICE_DEFAULT_APP,
  serviceVersion = RESIZER_TOKEN_VERSION,
}) => {
  const urlSearch = new URLSearchParams({
    value: id,
  })
  return axios({
    url: `${CONTENT_BASE}/signing-service/v2/sign/${service}/${serviceVersion}?${urlSearch.toString()}`,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${ARC_ACCESS_TOKEN}`,
    },
    method: 'GET',
  })
    .then(({ data: content }) => content)
    .catch(handleFetchError)
}

export default {
  fetch,
  params,
  http: false,
  // 365 day ttl
  ttl: 31536000,
}
