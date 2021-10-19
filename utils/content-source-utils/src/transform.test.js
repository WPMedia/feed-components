// eslint-disable-next-line no-unused-vars
import { transform } from './'

const globalContent = {
  content_elements: [
    {
      taxonomy: {
        tags: [],
      },
      websites: {
        demo: {
          website_url: '/news/test-article-1',
          website_section: {
            _id: '/news',
          },
        },
      },
    },
    {
      taxonomy: {
        tags: [],
        sections: [{ _id: '/sports' }],
      },
      websites: {
        demo: {
          website_url: '/news/test-article-2',
          website_section: {
            _id: '/news',
          },
        },
      },
    },
    {
      websites: {
        demo: {
          website_url: '/news/test-article-3',
          website_section: {
            _id: '/news',
          },
        },
      },
    },
  ],
}

it('Test transform with undefined data', () => {
  const transformedANS = transform(undefined, {
    'arc-site': 'demo',
  })
  expect(transformedANS).toEqual({})
})

it('Test transform with empty data', () => {
  const transformedANS = transform(
    { content_elements: [] },
    {
      'arc-site': 'demo',
    },
  )
  expect(transformedANS).toEqual({ content_elements: [] })
})

// Every article should have a website and website_url. Only replace sections if !exist
it('Test transform', () => {
  const transformedANS = transform(globalContent, {
    'arc-site': 'demo',
  })
  expect(transformedANS).toEqual({
    content_elements: [
      {
        taxonomy: { sections: [{ _id: '/news' }], tags: [] },
        website: 'demo',
        website_url: '/news/test-article-1',
        websites: {
          demo: {
            website_section: { _id: '/news' },
            website_url: '/news/test-article-1',
          },
        },
      },
      {
        taxonomy: { sections: [{ _id: '/sports' }], tags: [] },
        website: 'demo',
        website_url: '/news/test-article-2',
        websites: {
          demo: {
            website_section: { _id: '/news' },
            website_url: '/news/test-article-2',
          },
        },
      },
      {
        taxonomy: { sections: [{ _id: '/news' }] },
        website: 'demo',
        website_url: '/news/test-article-3',
        websites: {
          demo: {
            website_section: { _id: '/news' },
            website_url: '/news/test-article-3',
          },
        },
      },
    ],
  })
})
