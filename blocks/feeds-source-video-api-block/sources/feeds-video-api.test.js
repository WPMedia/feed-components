// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
const resolver = require('./feeds-video-api')

it('validate schemaName', () => {
  expect(resolver.default.schemaName).toBe('feeds')
})
it('returns query with default values', () => {
  const query = resolver.default.resolve()
  expect(query).toBe('undefined/api/v1/ansvideos/findByUuids')
})
it('returns query with default values', () => {
  const query = resolver.default.resolve()
  expect(query).toBe('undefined/api/v1/ansvideos/findByPlaylist')
})
