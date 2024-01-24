/**
 * this is for mocking node env
 * will not have window attribute, testing ssr
 * https://jestjs.io/docs/en/configuration.html#testenvironment-string
 * @jest-environment node
 */
// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { TextOutputType } from './text'

it('should match the snapshot', () => {
  const videoSitemap = TextOutputType('hello world')
  expect(videoSitemap).toMatchSnapshot()
})

it('should render array of children as plain text', () => {
  const videoSitemap = TextOutputType(['hello world', 'print output'])
  expect(videoSitemap).toEqual('hello world\nprint output')
})
