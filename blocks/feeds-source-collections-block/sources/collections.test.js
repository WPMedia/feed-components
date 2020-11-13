// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
const resolver = require('./collections')

it('validate params', () => {
  expect(resolver.default.params).toStrictEqual({
    _id: 'text',
    content_alias: 'text',
    from: 'text',
    size: 'text',
  })
})

it('returns query search by _id', () => {
  const query = resolver.default.resolve({
    _id: 'NBXKZJC3ONEGRB2VPINBMQTNFA',
    content_alias: '',
    from: '',
    size: '',
  })
  expect(query).toMatchSnapshot()
})

it('returns query by alias', () => {
  const query = resolver.default.resolve({
    _id: '',
    content_alias: 'sports page',
    from: '5',
    size: '10',
  })
  expect(query).toMatchSnapshot()
})
