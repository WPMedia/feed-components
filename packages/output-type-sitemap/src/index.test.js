import sitemap from './'

it('returns some xml', () => {
  const map = sitemap({
    globalContent: {
      elements: [
        {
          canonical_url: '/hi/there',
        },
      ],
    },
  })
  expect(map).toMatchInlineSnapshot()
})
