import sitemap from './'

it('returns some xml', () => {
  const map = sitemap({
    globalContent: {
      content_elements: [
        {
          canonical_url: '/hi/there',
          content_elements: [],
        },
      ],
    },
  })
  expect(map.end({ prettyPrint: true })).toMatchInlineSnapshot(`
    "<?xml version=\\"1.0\\"?>
    <urlset xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\" xmlns:image=\\"http://www.google.com/schemas/sitemap-image/1.1\\">
      <url>
        <loc>/hi/there</loc>
        <changefeq>always</changefeq>
        <priority>0.5</priority>
      </url>
    </urlset>"
  `)
})
