// eslint-disable-next-line no-unused-vars
import { generateDistributor } from './'

const defaultParams = { size: 100, sort: 'display_date:desc' }

it('Test distributor with empty data', () => {
  const paramList = generateDistributor({}, {})
  expect(paramList).toEqual({})
})

it('Test distributor works with existing data', () => {
  const paramList = generateDistributor({}, defaultParams)
  expect(paramList).toEqual(defaultParams)
})

it('Test distributor name', () => {
  let paramList = defaultParams
  paramList = generateDistributor(
    { 'Include-Distributor-Name': 'AP,reuters' },
    paramList,
  )
  expect(paramList).toEqual({
    ...defaultParams,
    include_distributor_name: 'AP,reuters',
  })
})

it('Test Exclude distributor name', () => {
  let paramList = defaultParams
  paramList = generateDistributor(
    { 'Exclude-Distributor-Name': 'AP,reuters' },
    paramList,
  )
  expect(paramList).toEqual({
    ...defaultParams,
    exclude_distributor_name: 'AP,reuters',
  })
})

it('Test distributor categoru', () => {
  let paramList = defaultParams
  paramList = generateDistributor(
    { 'Include-Distributor-Category': 'wires' },
    paramList,
  )
  expect(paramList).toEqual({
    ...defaultParams,
    include_distributor_category: 'wires',
  })
})

it('Test Exclude distributor category', () => {
  let paramList = defaultParams
  paramList = generateDistributor(
    { 'Exclude-Distributor-Category': 'wires' },
    paramList,
  )
  expect(paramList).toEqual({
    ...defaultParams,
    include_distributor_category: 'wires',
  })
})

it('Test combination of params', () => {
  let paramList = defaultParams
  paramList = generateDistributor(
    {
      'Include-Distributor-Name': 'AP',
      'Exclude-Distributor-Name': 'reuters',
      'Include-Distributor-Category': 'wires',
      'Exclude-Distributor-Category': 'premium',
    },
    paramList,
  )
  expect(paramList).toEqual({
    ...defaultParams,
    include_distributor_name: 'AP',
  })
})
