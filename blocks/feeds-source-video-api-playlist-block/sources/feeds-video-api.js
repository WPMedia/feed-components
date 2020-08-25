import { VIDEO_BASE } from 'fusion:environment'

const resolve = function resolve(key) {
  // Returns playlist by playlist name
  const requestUri = `${VIDEO_BASE}/api/v1/ans/playlists/findByPlaylist`
  const uriParams = [`name=${key['name']}`, `count=${key['count']}`].join('&')

  // basic ES query
  const body = {
    query: {
      bool: {
        must: [],
      },
    },
  }
  let feedQuery
  if (key['name']) {
    try {
      feedQuery = JSON.parse(key['name'])
    } catch (error) {
      console.log(`Failed to parse name: ${key['name']}`)
    }
  }

  // default query
  if (!feedQuery) {
    feedQuery = []
  }

  body.query.bool.must = feedQuery

  const count = key['count']
  if (count) {
    try {
      body.query.bool.must = JSON.parse(count)
    } catch (error) {
      console.log(`Failed to parse count: ${key['count']}`)
    }
  }

  const encodedBody = encodeURI(JSON.stringify(body))
  return `${requestUri}?body=${encodedBody}&${uriParams}`
}

export default {
  resolve,
  schemaName: 'feeds',
  params: {
    Playlist: 'text',
    Count: 'text',
  },
}
