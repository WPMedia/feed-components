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

it('fails if not a valid feed type', () => {
  expect(() => {
    generatePropsForFeed('garbage', PropTypes)
  }).toThrow('garbage')
})

it('generates proptypes for rss', () => {
  const shape = generatePropsForFeed('rss', PropTypes)
  expect(JSON.parse(PropTypes.stringify(shape))).toMatchSnapshot()
})
