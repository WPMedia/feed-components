// eslint-disable-next-line no-unused-vars
import { genParams } from './'

const defaultParams = { size: 100, sort: 'display_date:desc' }

it('Test with empty data', () => {
  const paramList = genParams({})
  expect(paramList).toEqual('')
})

it('Test with data', () => {
  const paramList = genParams(defaultParams)
  expect(paramList).toEqual('size=100&sort=display_date:desc')
})
