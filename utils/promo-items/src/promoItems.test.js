import { BuildPromoItems } from './promoItems'

// The video stream in the tests comes from the mock not the ANS
const options = {
  resizerKey: 'ABC123',
  resizerURL: 'https://www.example.com/resizer',
  promoItemsJmespath: 'promo_items.basic || promo_items.lead_art',
  imageTitle: 'subtitle',
  imageCaption: 'caption',
  imageCredits: 'credits.by[].name',
  videoSelect: { bitrate: 2000, stream_type: 'ts' },
  ans: {
    promo_items: {
      basic: {
        type: 'image',
        height: 1275,
        url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/FK3A3PGSLNFYXCHLKWQGADE2ZA.jpg',
        width: 1920,
        subtitle: 'Basic Title',
        caption: 'Basic Caption',
        credits: { by: [{ name: 'Adam Smyth' }, { name: 'Maggie May' }] },
      },
      lead_art: {
        type: 'video',
        headlines: { basic: 'head here' },
        subheadlines: { basic: 'subhead here' },
        promo_items: {
          basic: {
            type: 'image',
            url: 'https://d1acid63ghtydj.cloudfront.net/05-27-2020/t_593c7e85769e44b0b122b3800650d8ed_name_Hockey_Two.PNG',
          },
        },
        credits: { by: [{ name: 'Jon Mayer' }, { name: 'Norah Jones' }] },
        streams: [
          {
            height: 720,
            width: 1280,
            stream_type: 'ts',
            url: 'https://d3ujdjwa458jgt.cloudfront.net/out/v1/87998c783fb94bf0b965847d5c8b4392/index.m3u8',
            bitrate: 2000,
            filesize: 3368020,
            provider: 'elastictranscoder',
          },
        ],
      },
      gallery: {
        _id: 'MLPAZXKL45ETNBNQLCHOBDL4DE',
        promo_items: {
          basic: {
            _id: '76DVUCB2KFBCFOXGEPLXZAP7UA',
            additional_properties: {
              fullSizeResizeUrl:
                '/photo/resize/vkRq6Q3rnjp-pvVemhbD4cIEgy8=/arc-anglerfish-arc2-prod-demo/public/76DVUCB2KFBCFOXGEPLXZAP7UA.jpg',
              mime_type: 'image/jpeg',
              resizeUrl:
                'https://demo.arcpublishing.com/photo/resize/vkRq6Q3rnjp-pvVemhbD4cIEgy8=/arc-anglerfish-arc2-prod-demo/public/76DVUCB2KFBCFOXGEPLXZAP7UA.jpg',
            },
            alt_text: 'Education',
            credits: { by: [{ name: 'clancyryan' }] },
            focal_point: { x: 0, y: 0 },
            height: 451,
            subtitle: 'Education',
            type: 'image',
            url: 'https://cloudfront-us-east-1.images.arcpublishing.com/demo/76DVUCB2KFBCFOXGEPLXZAP7UA.jpg',
            width: 601,
          },
        },
        type: 'gallery',
        content_elements: [
          {
            _id: '76DVUCB2KFBCFOXGEPLXZAP7UA',
            additional_properties: {
              fullSizeResizeUrl:
                '/photo/resize/vkRq6Q3rnjp-pvVemhbD4cIEgy8=/arc-anglerfish-arc2-prod-demo/public/76DVUCB2KFBCFOXGEPLXZAP7UA.jpg',
              mime_type: 'image/jpeg',
              resizeUrl:
                'https://demo.arcpublishing.com/photo/resize/vkRq6Q3rnjp-pvVemhbD4cIEgy8=/arc-anglerfish-arc2-prod-demo/public/76DVUCB2KFBCFOXGEPLXZAP7UA.jpg',
            },
            alt_text: 'Education',
            credits: { by: [{ name: 'clancyryan' }] },
            focal_point: { x: 0, y: 0 },
            height: 451,
            subtitle: 'Education',
            type: 'image',
            url: 'https://cloudfront-us-east-1.images.arcpublishing.com/demo/76DVUCB2KFBCFOXGEPLXZAP7UA.jpg',
            width: 601,
          },
          {
            _id: '2HIN53GVB5ES5KQUU46XXHHMJE',
            additional_properties: {
              fullSizeResizeUrl:
                '/photo/resize/w0s7OZGaTE19rvTjJK96CClZLic=/arc-anglerfish-arc2-prod-demo/public/2HIN53GVB5ES5KQUU46XXHHMJE.jpg',
              mime_type: 'image/jpeg',
              resizeUrl:
                'https://demo.arcpublishing.com/photo/resize/w0s7OZGaTE19rvTjJK96CClZLic=/arc-anglerfish-arc2-prod-demo/public/2HIN53GVB5ES5KQUU46XXHHMJE.jpg',
            },
            alt_text: 'Education',
            credits: { affiliation: [], by: [{ name: 'clancyryan' }] },
            height: 800,
            subtitle: 'Education',
            type: 'image',
            url: 'https://cloudfront-us-east-1.images.arcpublishing.com/demo/2HIN53GVB5ES5KQUU46XXHHMJE.jpg',
            width: 1200,
          },
          {
            _id: 'EUSALTTF5JEPHPGF3PD3BKLSYY',
            additional_properties: {
              fullSizeResizeUrl:
                '/photo/resize/Bsgt4a9IqsZfv5Lsz_hKiHAZF_I=/arc-anglerfish-arc2-prod-demo/public/EUSALTTF5JEPHPGF3PD3BKLSYY.jpg',
              mime_type: 'image/jpeg',
              resizeUrl:
                'https://demo.arcpublishing.com/photo/resize/Bsgt4a9IqsZfv5Lsz_hKiHAZF_I=/arc-anglerfish-arc2-prod-demo/public/EUSALTTF5JEPHPGF3PD3BKLSYY.jpg',
            },
            credits: { by: [{ name: 'clancyryan' }] },
            focal_point: { x: 0, y: 0 },
            height: 724,
            subtitle: 'Ontarian schools',
            type: 'image',
            url: 'https://cloudfront-us-east-1.images.arcpublishing.com/demo/EUSALTTF5JEPHPGF3PD3BKLSYY.jpg',
            width: 1086,
          },
        ],
      },
    },
  },
}

const MyPromoItems = new BuildPromoItems()

it('handle empty everything', () => {
  const img = MyPromoItems.imageTag({})
  expect(img).toBe(undefined)
})

it('handle empty promo_items', () => {
  const img = MyPromoItems.imageTag({
    ...options,
    ans: {
      promo_items: {
        basic: { type: 'image', version: '10.0.1' },
        lead_art: { type: 'image', version: '10.0.1' },
      },
    },
  })
  expect(img).toBe(undefined)
})

it('handle basic image promo_items', () => {
  const img = MyPromoItems.imageTag({
    ...options,
  })
  expect(img).toMatchObject([
    {
      'image:image': {
        'image:caption': { $: 'Basic Caption' },
        'image:loc':
          'https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/FK3A3PGSLNFYXCHLKWQGADE2ZA.jpg',
        'image:title': { $: 'Basic Title' },
      },
    },
  ])
})

it('handle no title or caption image promo_items', () => {
  const img = MyPromoItems.imageTag({
    ...options,
    imageTitle: '',
    imageCaption: '',
  })
  expect(img).toMatchObject([
    {
      'image:image': {
        'image:loc':
          'https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/FK3A3PGSLNFYXCHLKWQGADE2ZA.jpg',
      },
    },
  ])
})

it('handle lead_art image promo_items', () => {
  const img = MyPromoItems.imageTag({
    ...options,
    promoItemsJmespath: 'promo_items.lead_art',
  })
  expect(img).toMatchObject([
    {
      'image:image': {
        'image:caption': { $: 'subhead here' },
        'image:loc':
          'https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/d1acid63ghtydj.cloudfront.net/05-27-2020/t_593c7e85769e44b0b122b3800650d8ed_name_Hockey_Two.PNG',
        'image:title': { $: 'head here' },
      },
    },
  ])
})

it('handle basic media promo_items', () => {
  const img = MyPromoItems.mediaTag({
    ...options,
  })
  expect(img).toMatchObject([
    {
      'media:content': {
        '@type': 'image/jpeg',
        '@url':
          'https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/FK3A3PGSLNFYXCHLKWQGADE2ZA.jpg',
        'media:credit': {
          '#': 'Adam Smyth,Maggie May',
          '@role': 'author',
          '@scheme': 'urn:ebu',
        },
        'media:description': {
          $: 'Basic Caption',
          '@type': 'plain',
        },
        'media:title': {
          $: 'Basic Title',
        },
      },
    },
  ])
})

it('handle lead_art video media promo_items', () => {
  const img = MyPromoItems.mediaTag({
    ...options,
    promoItemsJmespath: 'promo_items.lead_art',
  })
  expect(img).toMatchObject([
    {
      'media:content': {
        '@type': 'video/MP2T',
        '@url':
          'https://d3ujdjwa458jgt.cloudfront.net/out/v1/87998c783fb94bf0b965847d5c8b4392/index.m3u8',
        'media:credit': {
          '#': 'Jon Mayer,Norah Jones',
          '@role': 'author',
          '@scheme': 'urn:ebu',
        },
        'media:description': {
          $: 'subhead here',
          '@type': 'plain',
        },
        'media:title': {
          $: 'head here',
        },
        'media:thumbnail': {
          '@url':
            'https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/d1acid63ghtydj.cloudfront.net/05-27-2020/t_593c7e85769e44b0b122b3800650d8ed_name_Hockey_Two.PNG',
        },
      },
    },
  ])
})

it('handle gallery media promo_items', () => {
  const img = MyPromoItems.mediaTag({
    ...options,
    promoItemsJmespath: 'promo_items.gallery',
  })
  expect(img).toMatchObject([
    {
      'media:content': {
        '@height': 451,
        '@type': 'image/jpeg',
        '@url':
          'https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/cloudfront-us-east-1.images.arcpublishing.com/demo/76DVUCB2KFBCFOXGEPLXZAP7UA.jpg',
        '@width': 601,
        'media:credit': {
          '#': 'clancyryan',
          '@role': 'author',
          '@scheme': 'urn:ebu',
        },
        'media:title': {
          $: 'Education',
        },
      },
    },
    {
      'media:content': {
        '@height': 800,
        '@type': 'image/jpeg',
        '@url':
          'https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/cloudfront-us-east-1.images.arcpublishing.com/demo/2HIN53GVB5ES5KQUU46XXHHMJE.jpg',
        '@width': 1200,
        'media:credit': {
          '#': 'clancyryan',
          '@role': 'author',
          '@scheme': 'urn:ebu',
        },
        'media:title': {
          $: 'Education',
        },
      },
    },
    {
      'media:content': {
        '@height': 724,
        '@type': 'image/jpeg',
        '@url':
          'https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/cloudfront-us-east-1.images.arcpublishing.com/demo/EUSALTTF5JEPHPGF3PD3BKLSYY.jpg',
        '@width': 1086,
        'media:credit': {
          '#': 'clancyryan',
          '@role': 'author',
          '@scheme': 'urn:ebu',
        },
        'media:title': {
          $: 'Ontarian schools',
        },
      },
    },
  ])
})

it('handle enclosure promo_items', () => {
  const img = MyPromoItems.enclosureTag({
    ...options,
  })
  expect(img).toMatchObject([
    {
      enclosure: {
        '@type': 'image/jpeg',
        '@url':
          'https://www.example.com/resizer/abcdefghijklmnopqrstuvwxyz=/arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/FK3A3PGSLNFYXCHLKWQGADE2ZA.jpg',
      },
    },
  ])
})

it('handle enclosure video promo_items', () => {
  const img = MyPromoItems.enclosureTag({
    ...options,
    promoItemsJmespath: 'promo_items.lead_art',
  })
  expect(img).toMatchObject([
    {
      enclosure: {
        '@type': 'video/MP2T',
        '@url':
          'https://d3ujdjwa458jgt.cloudfront.net/out/v1/87998c783fb94bf0b965847d5c8b4392/index.m3u8',
        '@length': 3368020,
      },
    },
  ])
})
