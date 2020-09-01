// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
const resolver = require('./feeds-video-api')
it('validate schemaName', () => {
  expect(resolver.default.schemaName).toBe('feeds')
})

it('returns query with default values', () => {
  const query1 = resolver.default.resolve({
    Uuids:
      'db9862d6-be50-11e7-9294-705f80164f6e,4594b2c0-6cc1-11e7-abbc-a53480672286',
  })
  expect(query1).toBe(
    'undefined/api/v1/ansvideos/findByUuids?uuids=db9862d6-be50-11e7-9294-705f80164f6e&uuids=4594b2c0-6cc1-11e7-abbc-a53480672286',
  )
})

it('returns query with default values', () => {
  const query2 = resolver.default.resolve({
    Playlist: 'playlist5',
    Count: '10',
  })
  expect(query2).toBe(
    'undefined/api/v1/ans/playlists/findByPlaylist?name=playlist5&count=10',
  )
})
