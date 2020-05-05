import { generatePropsForFeed } from './'
import PropTypes from 'fusion:prop-types'

it('generates proptypes for sitemap', () => {
  const shape = generatePropsForFeed('sitemap', PropTypes)
  expect(JSON.parse(PropTypes.stringify(shape))).toMatchSnapshot()
})

it('omits specified properties from sitemap propypes', () => {
  const shape = generatePropsForFeed('sitemap', PropTypes, ['includePromo'])
  expect(JSON.parse(PropTypes.stringify(shape))).toMatchSnapshot()
})
