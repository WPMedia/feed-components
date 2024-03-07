import { XmlOutput } from './index'
const { JSDOM } = require('jsdom');

const dom = new JSDOM();
global.DOMParser = dom.window.DOMParser;

const exampleData = [
  {
    rss: {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      '@xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
      '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
      '@version': '2.0',
      '@xmlns:media': 'http://search.yahoo.com/mrss/',
      channel: {
        title: { $: 'Test Feed' },
        link: 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com',
        'atom:link': {
          '@href':
            'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/',
          '@rel': 'self',
          '@type': 'application/rss+xml',
        },
        description: { $: 'description' },
        lastBuildDate: 'Wed, 17 Jan 2024 14:29:50 +0000',
        language: 'en',
        copyright: '2024',
        ttl: '1',
        'sy:updatePeriod': 'hourly',
        'sy:updateFrequency': '1',
        item: [
          {
            title: { $: 'Marissa’s Test Story' },
            link: 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/2020/11/09/marissas-test-story/',
            guid: {
              '#': 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/2020/11/09/marissas-test-story/',
              '@isPermaLink': true,
            },
            'dc:creator': { $: 'Marissa Halpert' },
            description: { $: '' },
            pubDate: 'Mon, 09 Nov 2020 22:18:01 +0000',
            'content:encoded': {
              $: `<p>Purple refers to any of a variety of colors with hue between red and blue.</p><p>Purple is closely associated with violet. In optics, purple and violet refer to colors that look similar, but purples are mixtures of red light and blue or violet light, whereas violets are spectral colors (of single wavelengths of light). In common usage, both refer to colors that are between red and blue in hue, with purples closer to red and violets closer to blue. Similarly, in the traditional painters' color wheel, purple and violet are both placed between red and blue, with purple closer to red.</p><p>Purple has long been associated with royalty, originally because Phoenician purple dye was extremely expensive in antiquity. Purple was the color worn by Roman magistrates; it became the imperial color worn by the rulers of the Byzantine Empire and the Holy Roman Empire, and later by Roman Catholic bishops. Similarly in Japan, the color is traditionally associated with the emperor and aristocracy.</p><p>According to contemporary surveys in Europe and the United States, purple is the color most often associated with royalty, magic, mystery, and piety. When combined with pink, it is associated with eroticism, femininity, and seduction.</p><p><br/></p><blockquote><p>Testing block quote</p></blockquote><p><a href="https://en.wikipedia.org/wiki/Purple">The best color</a></p>`,
            },
          },
          {
            title: { $: 'Test story for the Washington Post setup' },
            link: 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/2019/11/18/test-story-for-the-washington-post-setup/',
            guid: {
              '#': 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/2019/11/18/test-story-for-the-washington-post-setup/',
              '@isPermaLink': true,
            },
            description: { $: '' },
            pubDate: 'Mon, 18 Nov 2019 21:19:08 +0000',
            'content:encoded': {
              $: '<p>This is to test if the Content API content source works with the Washington Post features we have set up on Core Components Sandbox. </p>',
            },
          },
          {
            title: { $: 'test' },
            link: 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/2019/08/28/test/',
            guid: {
              '#': 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/2019/08/28/test/',
              '@isPermaLink': true,
            },
            'dc:creator': { $: 'aefsaf' },
            description: { $: 'test' },
            pubDate: 'Wed, 28 Aug 2019 19:37:06 +0000',
            'content:encoded': { $: '<p>testestetset</p>' },
          },
          {
            title: { $: 'Test story 1 - Gazette story shared to Prophet' },
            link: 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/2019/04/17/test-story-1/',
            guid: {
              '#': 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/2019/04/17/test-story-1/',
              '@isPermaLink': true,
            },
            description: { $: '' },
            pubDate: 'Wed, 17 Apr 2019 15:58:37 +0000',
            'content:encoded': {
              $: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
            },
            '#': [
              {
                'media:content': {
                  '@url':
                    'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/resizer/WHs28CYC_hGdxryDL_EJsSx7oWY=/arc-anglerfish-arc2-sandbox-sandbox-corecomponents.s3.amazonaws.com/public/SQCYL5S5IFDYLF76K5SFSFHLVU.jpg',
                  '@type': 'image/jpeg',
                  '@height': 835,
                  '@width': 1114,
                },
              },
            ],
          },
        ],
      },
    },
  },
]

const exampleDataInvalid = [
  {
    rss: {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      '@xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
      '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
      '@version': '2.0',
      '@xmlns:media': 'http://search.yahoo.com/mrss/',
      channel: {
        title: { $: 'Test Feed' },
        link: 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com',
        'atom:link': {
          '@href':
            'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/',
          '@rel': 'self',
          '@type': 'application/rss+xml',
        },
        description: { $: 'description' },
        lastBuildDate: 'Wed, 17 Jan 2024 14:29:50 +0000',
        language: 'en',
        copyright: '2024',
        ttl: '1',
        'sy:updatePeriod': 'hourly',
        'sy:updateFrequency': '1',
        item: [
          {
            title: {
              $: 'ä, ë, ï, ö, ü, ÿ, Ä, Ë, Ï, Ö, Ü, Ÿ, â, ê, î, ô, û, Â, Ê, Î, Ô, Û, á, é, í, ó, ú, ý, Á, É, Í, Ó, Ú, Ý, à, è, ì, ò, ù, À, È, Ì, Ò, Ù',
            },
            link: 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/2019/04/17/test-story-1/',
            guid: {
              '#': 'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/2019/04/17/test-story-1/',
              '@isPermaLink': true,
            },
            description: { $: '␀' },
            pubDate: 'Wed, 17 Apr 2019 15:58:37 +0000',
            'content:encoded': {
              $: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
            },
            '#': [
              {
                'media:content': {
                  '@url':
                    'https://corecomponents-the-gazette-prod.cdn.arcpublishing.com/resizer/WHs28CYC_hGdxryDL_EJsSx7oWY=/arc-anglerfish-arc2-sandbox-sandbox-corecomponents.s3.amazonaws.com/public/SQCYL5S5IFDYLF76K5SFSFHLVU.jpg␀',
                  '@type': 'image/jpeg',
                  '@height': 835,
                  '@width': 1114,
                  'media:description': {
                    '@type': 'plain',
                    $: 'Description has character',
                  },
                  'media:credit': {
                    '@role': 'author',
                    '@scheme': 'urn:ebu',
                    '#': 'Author ends in␀',
                  },
                },
              },
            ],
          },
        ],
      },
    },
  },
]

describe('XmlOutput()', () => {
  it('builds valid XML', () => {
    const result = XmlOutput({ children: exampleData })
    // eslint-disable-next-line no-undef
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(result, 'text/xml')
    expect(xmlDoc?.documentElement?.nodeName).not.toBe('parsererror')
  })

  it('filters out invalid characters', () => {
    const result = XmlOutput({ children: exampleDataInvalid })
    // eslint-disable-next-line no-undef
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(result, 'text/xml')
    expect(xmlDoc?.documentElement?.nodeName).not.toBe('parsererror')
  })
})
