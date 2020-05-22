import { buildContent } from './contentElements'

const domain = 'https://www.example.com'
const resizerKey = 'ABC123'
const resizerURL = 'https://www.example.com/resizer'

it('handle empty content elements', () => {
  const ce = []
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe('')
})

it('handle empty text content element', () => {
  const ce = [{ type: 'text', content: '' }]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe('')
})

it('generate text content element', () => {
  const ce = [{ type: 'text', content: '<i>this is text</i><br />' }]
  const text = buildContent(ce, 'all', domain)
  expect(text).toBe('<p>&lt;i&gt;this is text&lt;/i&gt;&lt;br /&gt;</p>')
})

it('generate blockquote content element', () => {
  const ce = [{ type: 'blockquote', content: 'this is a quote' }]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe('<q>this is a quote</q>')
})

it('generate header content element', () => {
  const ce = [{ type: 'header', content: 'this is a header', level: 2 }]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe('<h2>this is a header</h2>')
})

it('generate interstitial_link content element', () => {
  const ce = [
    {
      type: 'interstitial_link',
      url:
        '/2020/04/02/expert-predicts-richmond-area-hospitals-fill-up-within-weeks-peak-cases-not-expected-until-late-may/',
      content:
        'Expert predicts Richmond-area hospitals to fill up within weeks; peak of cases not expected until late-April',
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe(
    // prettier-ignore
    "<p><a href=\"https://www.example.com/2020/04/02/expert-predicts-richmond-area-hospitals-fill-up-within-weeks-peak-cases-not-expected-until-late-may/\">Expert predicts Richmond-area hospitals to fill up within weeks; peak of cases not expected until late-April</a></p>",
  )
})

it('generate divider content element', () => {
  // divider elements are ignored
  const ce = [
    { type: 'divider', content: 'a divider has no content and is ignored' },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe('')
})

it('generate code content element', () => {
  // code elements are ignored
  const ce = [
    { type: 'code', content: '<script>alert("hello world!")</script>' },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe('')
})

it('generate custom_embed content element', () => {
  // custom_embed are custom per client and subtype. They will all need to be custom
  const ce = [
    {
      type: 'custom_embed',
      subtype: 'customEmbed_audio',
      embed: { any: 'thing', can: 'go', in: 'here' },
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe('')
})

it('generate correction content element', () => {
  const ce = [
    {
      type: 'correction',
      correction_type: 'clarification',
      text:
        'In our previous article, we misspelled the name of the restaurant.',
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe(
    '<i>In our previous article, we misspelled the name of the restaurant.</i>',
  )
})

it('generate endorsement content element', () => {
  const ce = [
    {
      type: 'endorsement',
      endorsement: '$$$',
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe('<p>$$$</p>')
})

it('generate list content element', () => {
  const ce = [
    {
      type: 'list',
      list_type: 'ordered',
      items: [
        { type: 'text', content: 'This is a list!' },
        {
          type: 'list',
          list_type: 'unordered',
          items: [{ type: 'text', content: 'This is a sub-item.' }],
        },
      ],
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe(
    '<ol><li>This is a list!</li><li><ul><li>This is a sub-item.</li></ul></li></ol>',
  )
})

it('generate numeric_rating content element', () => {
  const ce = [
    {
      type: 'numeric_rating',
      numeric_rating: 3,
      units: 'stars',
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe('<p>3 stars</p>')
})

it('generate raw_html content element', () => {
  const ce = [
    {
      type: 'raw_html',
      content:
        '<div class="empty" style="padding: 20px;background-color:#333;color:white;text-align:center;font-size:2em;">Sample HTML block</div>',
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe(
    '<p>&lt;div class="empty" style="padding: 20px;background-color:#333;color:white;text-align:center;font-size:2em;"&gt;Sample HTML block&lt;/div&gt;</p>',
  )
})

it('generate image content element', () => {
  const ce = [
    {
      type: 'image',
      height: 1275,
      url:
        'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/FK3A3PGSLNFYXCHLKWQGADE2ZA.jpg',
      width: 1920,
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  // prettier-ignore
  expect(text).toBe(
    "<img src=\"https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/FK3A3PGSLNFYXCHLKWQGADE2ZA.jpg\" alt=\"\" height=\"1275\" width=\"1920\"/>",
  )
})

it('generate twitter oembed_response content element', () => {
  // twitter need to strip out <script>
  const ce = [
    {
      type: 'oembed_response',
      subtype: 'twitter',
      raw_oembed: {
        html:
          '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Honestly, same. <a href="https://t.co/vhmMXeG7W4">https://t.co/vhmMXeG7W4</a> <a href="https://t.co/8VqgOr5WUQ">pic.twitter.com/8VqgOr5WUQ</a></p>&mdash; Teddy Amenabar (@TeddyAmen) <a href="https://twitter.com/TeddyAmen/status/1167114295123091459?ref_src=twsrc%5Etfw">August 29, 2019</a></blockquote>\n<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>\n',
      },
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe(
    '&lt;blockquote class="twitter-tweet"&gt;&lt;p lang="en" dir="ltr"&gt;Honestly, same. &lt;a href="https://t.co/vhmMXeG7W4"&gt;https://t.co/vhmMXeG7W4&lt;/a&gt; &lt;a href="https://t.co/8VqgOr5WUQ"&gt;pic.twitter.com/8VqgOr5WUQ&lt;/a&gt;&lt;/p&gt;&amp;mdash; Teddy Amenabar (@TeddyAmen) &lt;a href="https://twitter.com/TeddyAmen/status/1167114295123091459?ref_src=twsrc%5Etfw"&gt;August 29, 2019&lt;/a&gt;&lt;/blockquote&gt;',
  )
})

it('generate youtube oembed_response content element', () => {
  const ce = [
    {
      type: 'oembed_response',
      subtype: 'youtube',
      raw_oembed: {
        html:
          '<iframe width="480" height="270" src="https://www.youtube.com/embed/a6KGPBflhiM?feature=oembed" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
      },
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe(
    '&lt;iframe width="480" height="270" src="https://www.youtube.com/embed/a6KGPBflhiM?feature=oembed" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen&gt;&lt;/iframe&gt;',
  )
})

it('generate table content element', () => {
  const ce = [
    {
      type: 'table',
      header: [
        {
          type: 'text',
          content: 'Fruit',
        },
        {
          type: 'text',
          content: 'Vegetable',
        },
      ],
      rows: [
        [
          {
            type: 'text',
            content: 'Apple',
          },
          {
            type: 'text',
            content: 'Asparagus',
          },
        ],
        [
          {
            type: 'text',
            contenT: 'Blue Berries',
          },
          {
            type: 'text',
            content: 'brussel Sprouts',
          },
        ],
      ],
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe(
    '<table><thead><tr><th>Fruit</th><th>Vegetable</th></tr></thead><tbody><tr><td>Apple</td><td>Asparagus</td></tr><tr><td>brussel Sprouts</td></tr></tbody></table>',
  )
})

it('generate gallery content elements', () => {
  const ce = [
    {
      _id: 'TA3CY5SERBEZTLJ3I2M7OLNHGU',
      canonical_url:
        '/gallery/2017/04/14/the-top-political-moments-in-oscars-history/',
      canonical_website: 'demo',
      created_date: '2017-04-14T13:30:58Z',
      credits: { by: [] },
      description: { basic: 'Updated, has taxonomy section' },
      headlines: { basic: 'The top political moments in Oscars history' },
      last_updated_date: '2018-02-20T23:07:50Z',
      owner: { id: 'demo', sponsored: false },
      promo_items: {
        basic: {
          _id: 'LLNQVAK74VHTFICZG4MAVRVSLE',
          additional_properties: {
            countryId: 227,
            galleries: [
              {
                headlines: {
                  basic: 'The top political moments in Oscars history',
                },
                _id: 'TA3CY5SERBEZTLJ3I2M7OLNHGU',
              },
            ],
            keywords: [
              "oscar's",
              'oscars',
              'arts culture and entertainment',
              'celebrities',
              'film industry',
              'awards ceremony',
            ],
            mime_type: 'application/octet-stream',
            originalName: '645705958.jpg',
            originalUrl:
              'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/LLNQVAK74VHTFICZG4MAVRVSLE',
            owner: 'matthew.nelson@washpost.com',
            proxyUrl:
              '/photo/resize/ZcajgF88MuQ6FHmHltarKkazjcI=/arc-anglerfish-arc2-prod-demo/public/LLNQVAK74VHTFICZG4MAVRVSLE',
            published: true,
            resizeUrl:
              'http://resizer.shared.arcpublishing.com/ZcajgF88MuQ6FHmHltarKkazjcI=/arc-anglerfish-arc2-prod-demo/public/LLNQVAK74VHTFICZG4MAVRVSLE',
            restricted: false,
            version: 2,
            roles: [],
          },
          address: {
            street_address: 'Hollywood & Highland Center',
            locality: 'Hollywood',
            region: 'CA',
            country_name: 'USA',
          },
          caption:
            'HOLLYWOOD, CA - FEBRUARY 26:  Host Jimmy Kimmel speaks onstage during the 89th Annual Academy Awards at Hollywood & Highland Center on February 26, 2017 in Hollywood, California.  (Photo by Kevin Winter/Getty Images)',
          created_date: '2017-04-14T13:24:33Z',
          credits: {
            by: [
              {
                additional_properties: {},
                name: 'Kevin Winter',
                type: 'author',
              },
            ],
          },
          height: 3107,
          last_updated_date: '2017-04-14T13:28:54Z',
          licensable: false,
          owner: { id: 'demo' },
          subtitle: '89th Annual Academy Awards - Show',
          taxonomy: { additional_properties: {} },
          type: 'image',
          url:
            'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/LLNQVAK74VHTFICZG4MAVRVSLE',
          version: '0.6.2',
          width: 4373,
          keywords:
            "oscar's, oscars, arts culture and entertainment, celebrities, film industry, awards ceremony",
          added: false,
        },
      },
      publish_date: '2017-04-14T14:48:49Z',
      source: {
        additional_properties: {},
        edit_url:
          'https://demo.arcpublishing.com/photo/gallery/TA3CY5SERBEZTLJ3I2M7OLNHGU',
        system: 'Anglerfish',
      },
      taxonomy: { additional_properties: {}, sections: [] },
      type: 'gallery',
      version: '0.6.2',
      websites: {
        demo: {
          website_url:
            '/gallery/2017/04/14/the-top-political-moments-in-oscars-history/',
        },
      },
      content_elements: [
        {
          _id: 'LLNQVAK74VHTFICZG4MAVRVSLE',
          address: {
            street_address: 'Hollywood & Highland Center',
            locality: 'Hollywood',
            region: 'CA',
            country_name: 'USA',
          },
          caption:
            'HOLLYWOOD, CA - FEBRUARY 26:  Host Jimmy Kimmel speaks onstage during the 89th Annual Academy Awards at Hollywood & Highland Center on February 26, 2017 in Hollywood, California.  (Photo by Kevin Winter/Getty Images)',
          created_date: '2017-04-14T13:24:33+00:00',
          credits: {
            by: [
              {
                additional_properties: {},
                name: 'Kevin Winter',
                type: 'author',
              },
            ],
          },
          height: 3107,
          last_updated_date: '2017-04-14T13:24:33+00:00',
          licensable: false,
          owner: { id: 'demo' },
          subtitle: '89th Annual Academy Awards - Show',
          taxonomy: { additional_properties: {} },
          type: 'image',
          url:
            'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/LLNQVAK74VHTFICZG4MAVRVSLE',
          version: '0.6.2',
          width: 4373,
          selectedCountry: {
            id: 227,
            name: 'United States',
            iso2: 'US',
            iso3: 'USA',
          },
          keywords:
            "oscar's, oscars, arts culture and entertainment, celebrities, film industry, awards ceremony",
          added: false,
        },
        {
          _id: 'VG7MMON4F5DATFL6DD3VA3Z2BE',
          address: {},
          caption:
            'Sidney Poitier, left, and Lilia Skala, in scene from the film \x93Lilies of the Field\x94, 1963 for which Poitier won the best actor Oscar in 1964. (AP Photo)',
          created_date: '2017-04-14T13:24:32+00:00',
          credits: { by: [] },
          height: 2344,
          last_updated_date: '2017-04-14T13:24:32+00:00',
          licensable: false,
          owner: { id: 'demo' },
          subtitle: 'Sidney Poitier,  Lilia Skala',
          taxonomy: { additional_properties: {} },
          type: 'image',
          url:
            'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/VG7MMON4F5DATFL6DD3VA3Z2BE',
          version: '0.6.2',
          width: 3011,
          keywords:
            'sitting performance arts culture and entertainment filming fame',
          added: false,
        },
        {
          _id: 'MS75LP7NQBBUTD7KJGOQZ2XLZQ',
          address: { locality: 'Los Angeles', region: 'CA' },
          caption:
            'Left to right Fred Astaire, master of Ceremonies, Joe Makiewicz, who was a two time winner for director and writing (\x91All About Eve\x92), Dr. Ralph Bunche, who made an award, Darryl Zanuck, who won an Oscar and the Thalberg Award, and President of the academy of Motion Picture Arts and Sciences Charles Brackett. Awards were made in Hollywood, Los Angeles on March 29, 1951. (AP Photo)',
          created_date: '2017-04-14T13:24:33+00:00',
          credits: {
            by: [{ additional_properties: {}, name: 'AP', type: 'author' }],
          },
          height: 2223,
          last_updated_date: '2017-04-14T13:24:33+00:00',
          licensable: false,
          owner: { id: 'demo' },
          subtitle:
            'Fred Astaire, Joe Makiewicz,  Ralph Bunche, Darryl Zanuck, Charles Brackett',
          taxonomy: { additional_properties: {} },
          type: 'image',
          url:
            'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/MS75LP7NQBBUTD7KJGOQZ2XLZQ',
          version: '0.6.2',
          width: 3000,
          keywords: 'standing side by side smiling holding fame achievement',
          added: false,
        },
      ],
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe(
    '<img src="https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/LLNQVAK74VHTFICZG4MAVRVSLE" alt="HOLLYWOOD, CA - FEBRUARY 26:  Host Jimmy Kimmel speaks onstage during the 89th Annual Academy Awards at Hollywood &amp; Highland Center on February 26, 2017 in Hollywood, California.  (Photo by Kevin Winter/Getty Images)" height="3107" width="4373"/><img src="https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/VG7MMON4F5DATFL6DD3VA3Z2BE" alt="Sidney Poitier, left, and Lilia Skala, in scene from the film Lilies of the Field, 1963 for which Poitier won the best actor Oscar in 1964. (AP Photo)" height="2344" width="3011"/><img src="https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/MS75LP7NQBBUTD7KJGOQZ2XLZQ" alt="Left to right Fred Astaire, master of Ceremonies, Joe Makiewicz, who was a two time winner for director and writing (All About Eve), Dr. Ralph Bunche, who made an award, Darryl Zanuck, who won an Oscar and the Thalberg Award, and President of the academy of Motion Picture Arts and Sciences Charles Brackett. Awards were made in Hollywood, Los Angeles on March 29, 1951. (AP Photo)" height="2223" width="3000"/>',
  )
})

it('generate quote content element', () => {
  const ce = [
    {
      type: 'quote',
      subtype_label: 'pullquote',
      content_elements: [
        { type: 'header', level: 2, content: 'Autonomus Vehicles' },
        {
          type: 'text',
          content:
            '“Automated vehicle technology is evolving on a very public stage and, as a result, it is affecting how consumers feel about it. Having the opportunity to interact with partially or fully automated vehicle technology will help remove some of the mystery for consumers and open the door for greater acceptance.”',
        },
        {
          type: 'list',
          list_type: 'unordered',
          items: [
            { type: 'text', content: 'corgi' },
            { type: 'text', content: 'dalmation' },
          ],
        },
      ],
      subtype: 'pullquote',
      citation: {
        type: 'text',
        content:
          'Greg Brannon, AAA Director of Automotive Engineering and Industry Relations',
      },
    },
  ]
  const text = buildContent(ce, 'all', domain, resizerKey, resizerURL)
  expect(text).toBe(
    '<blockquote><h2>Autonomus Vehicles</h2><p>“Automated vehicle technology is evolving on a very public stage and, as a result, it is affecting how consumers feel about it. Having the opportunity to interact with partially or fully automated vehicle technology will help remove some of the mystery for consumers and open the door for greater acceptance.”</p><ul><li>corgi</li><li>dalmation</li></ul><p class="citation">Greg Brannon, AAA Director of Automotive Engineering and Industry Relations</p></blockquote>',
  )
})
