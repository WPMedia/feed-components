// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
const resolver = require('./feeds-video-api')
it('validate schemaName', () => {
  expect(resolver.default.schemaName).toBe('feeds')
})

const query1 = resolver.default.resolve()
it('returns query with default values', () => {
  expect(query1).toBe('undefined/api/v1/ansvideos/findByUuids')
  const query1 = resolver.default.resolve({
    uuids: 'a,b,c',
  })
})
expect(query1).toBe('undefined/api/v1/ansvideos/findByUuids?uuids=a,b,c')

const query2 = resolver.default.resolve()
it('returns query with default values', () => {
  expect(query2).toBe('undefined/api/v1/ansvideos/findByPlaylist')
  const query2 = resolver.default.resolve({
    name: 'playlist',
    count: '10',
  })
})
expect(query2).toBe(
  'undefined/api/v1/ansvideos/findByPlaylist?name=playlist&count=10',
)
