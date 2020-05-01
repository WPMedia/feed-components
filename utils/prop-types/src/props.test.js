import { generatePropsForFeed } from './'
import PropTypes from 'fusion:prop-types'

it('allows props to be tested', () => {
  const shape = generatePropsForFeed('sitemap', PropTypes)
  expect(JSON.parse(PropTypes.stringify(shape))).toMatchSnapshot()
})
