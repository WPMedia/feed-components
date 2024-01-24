import TextFile from './text'

const simple =
  'User-agent: *\nAllow: /\n\nSitemap: http://www.example.com/sitemap.xml'

it('should render the simple text', () => {
  const textFile = TextFile({
    customFields: {
      Text: simple,
    },
  })
  expect(textFile).toMatchSnapshot()
})

it('should not render anything when no data is given', () => {
  const textFile = TextFile({})
  expect(textFile).toMatchSnapshot()
})
