import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
const source = require('./feeds-video-api')

// Mock Axios
jest.mock('axios');

beforeEach(() => {
  // Reset Axios mocks before each test
  axios.mockClear();
});

it('validate schemaName', () => {
  expect(source.default.schemaName).toBe('feeds')
})

it('returns query with default values', async () => {
  const mockData = { data: 'response' };
  axios.mockResolvedValue(mockData);
  
  await source.default.fetch({
    Uuids:
      'db9862d6-be50-11e7-9294-705f80164f6e,4594b2c0-6cc1-11e7-abbc-a53480672286',
  }, { cachedCall: {} });
  
  expect(axios).toHaveBeenCalledTimes(1);
  expect(axios).toHaveBeenCalledWith({
    url: expect.stringContaining(`/api/v1/ansvideos/findByUuids`), // Check base URL
    method: 'GET',
    headers: expect.objectContaining({
      'content-type': 'application/json',
      Authorization: expect.stringContaining('Bearer '),
    }),
  });

  const callUrl = axios.mock.calls[0][0].url;
  expect(callUrl).toBe(
    'undefined/api/v1/ansvideos/findByUuids?uuids=db9862d6-be50-11e7-9294-705f80164f6e&uuids=4594b2c0-6cc1-11e7-abbc-a53480672286',
  )
})

it('returns query with default values', async () => {
  const mockData = { data: 'response' };
  axios.mockResolvedValue(mockData);
  
  await source.default.fetch({
    Playlist: 'playlist5',
    Count: '10',
  }, { cachedCall: {} });
  
  const callUrl = axios.mock.calls[0][0].url;
  expect(callUrl).toBe(
    'undefined/api/v1/ans/playlists/findByPlaylist?name=playlist5&count=10',
  )
})
