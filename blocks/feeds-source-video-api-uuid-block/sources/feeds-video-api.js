import { VIDEO_BASE } from 'fusion:environment'

const resolve = function resolve(key) {
  // Returns videos with the given UUIDs or an empty list
  const requestUri = `${VIDEO_BASE}/api/v1/ansvideos/findByUuids`
  const uriParams = [`uuids=${key['uuids']}`]

  // basic ES query
  const body = {
    query: {
      bool: {
        must: [],
      },
    },
  }

  let feedQuery
  if (key['uuids']) {
    try {
      feedQuery = JSON.parse(key['uuids'])
    } catch (error) {
      console.log(`Failed to parse uuid: ${key['uuids']}`)
    }
  }

  // default query
  if (!feedQuery) {
    feedQuery = []
  }

  body.query.bool.must = feedQuery

  const encodedBody = encodeURI(JSON.stringify(body))
  return `${requestUri}?body=${encodedBody}&${uriParams}`
}

export default {
  resolve,
  schemaName: 'feeds',
  params: {
    uuids: 'text',
  },
}
