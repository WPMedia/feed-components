// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
const fetch = require('./collections')

it('validate params', () => {
  expect(fetch.default.params).toStrictEqual({
    _id: 'text',
    content_alias: 'text',
    from: 'text',
    size: 'text',
    includedFields: 'text',
    ttl: 'number',
  })
})
