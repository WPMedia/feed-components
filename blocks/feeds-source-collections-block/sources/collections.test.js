import request from 'request-promise-native'
const fetch = require('./collections')

jest.mock('request-promise-native')

it('validate params', () => {
  expect(fetch.default.params).toStrictEqual([
    { displayName: 'Collection ID', name: '_id', type: 'text' },
    {
      displayName: 'Collection Alias (Only populate ID or Alias)',
      name: 'content_alias',
      type: 'text',
    },
    {
      displayName: 'From - Integer offset to start from',
      name: 'from',
      type: 'number',
    },
    {
      displayName: 'Number of records to return, Integer 1 - 20',
      name: 'size',
      type: 'number',
    },
    {
      displayName: 'ANS Fields to include, use commas between fields',
      name: 'include_fields',
      type: 'text',
    },
  ])
})

describe('collections', () => {
  describe('fetch', () => {
    beforeEach(() => {
      request.mockClear()
    })

    it('Get collection', (done) => {
      request.mockResolvedValueOnce({
        type: 'collection',
        content_elements: [
          {
            _id: 'AAAAAAAAAAAAAAAAAAAAAAAAAA',
            website_url: '/storyA',
          },
          {
            _id: 'BBBBBBBBBBBBBBBBBBBBBBBBBB',
            website_url: '/storyB',
          },
          {
            _id: 'CCCCCCCCCCCCCCCCCCCCCCCCCC',
            website_url: '/storyC',
          },
          {
            _id: 'DDDDDDDDDDDDDDDDDDDDDDDDDD',
            website_url: '/storyD',
          },
        ],
      })

      request.mockResolvedValueOnce({
        type: 'results',
        content_elements: [
          {
            _id: 'BBBBBBBBBBBBBBBBBBBBBBBBBB',
            website_url: '/storyB',
          },
          {
            _id: 'AAAAAAAAAAAAAAAAAAAAAAAAAA',
            website_url: '/storyA',
          },
          {
            _id: 'DDDDDDDDDDDDDDDDDDDDDDDDDD',
            website_url: '/storyD',
          },
          {
            _id: 'CCCCCCCCCCCCCCCCCCCCCCCCCC',
            website_url: '/storyC',
          },
        ],
      })

      fetch.default
        .fetch({
          id: 'id',
        })
        .then((response) => {
          expect(response).toEqual({
            type: 'collection',
            content_elements: [
              {
                _id: 'AAAAAAAAAAAAAAAAAAAAAAAAAA',
                website_url: '/storyA',
              },
              {
                _id: 'BBBBBBBBBBBBBBBBBBBBBBBBBB',
                website_url: '/storyB',
              },
              {
                _id: 'CCCCCCCCCCCCCCCCCCCCCCCCCC',
                website_url: '/storyC',
              },
              {
                _id: 'DDDDDDDDDDDDDDDDDDDDDDDDDD',
                website_url: '/storyD',
              },
            ],
          })
          done()
        })
    })
  })
})
