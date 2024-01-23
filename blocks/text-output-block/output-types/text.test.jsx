import { TextOutputType } from './text'

it('should output plain text', () => {
  const videoSitemap = TextOutputType('hello world')
  expect(videoSitemap).toEqual('hello world')
})

it('should render array of children as plain text', () => {
  const videoSitemap = TextOutputType(['hello world', 'print output'])
  expect(videoSitemap).toEqual('hello world\nprint output')
})
