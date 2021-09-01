// eslint-disable-next-line no-unused-vars
import Consumer from 'fusion:consumer'
import { FbiaRss } from './xml'

const articles = {
  content_elements: [
    {
      display_date: '2020-04-07T15:02:08.918Z',
      last_updated_date: '2020-04-08T10:34:41.432Z',
      website_url: '/food/2020/04/07/tips-for-safe-hand-washing',
      promo_items: {
        basic: {
          type: 'image',
          title: 'Hand Washing',
          url: 'https://arc-anglerfish-arc2-prod-demo.s3.amazonaws.com/public/JTWX7EUOLJE4FCHYGN2COQAERY.png',
          caption: 'Hand washing can be fun if you make it a song',
          credits: { by: [{ name: 'Harold Hands' }] },
        },
      },
      credits: {
        by: [
          {
            name: 'John Smith',
            _id: 'john-smith',
            description: 'John is a journalist',
          },
          { name: 'Jane Doe', _id: 'jane-doe', description: '' },
        ],
      },
      headlines: { basic: 'Tips for Safe Hand washing' },
      description: { basic: 'Tips to keep you wash for 20 seconds' },
      subheadlines: { basic: 'This is from the subheadlines' },
      content_elements: [
        { type: 'text', content: 'try singing the happy birthday song<br>' },
        { type: 'text', content: 'be sure to <i>wash</i> your thumbs' },
        {
          type: 'raw_html',
          content: `<p id="7FCQKPKS2NCH5L6YTO2XCOEDDA"><div style="background:#ffffff; color: #333; margin:100px 0 1rem 0; line-height:28px; font-family: 'Merriweather', serif;"><img style="height:120px; width: 120px; float: left; margin-right: 20px;" src="https://www.example.com.mx/graficos/img/novedad-180321.jpg" class="img-responsive" alt="logo" /><img style="height:120px; width: 120px; float: right; " src="https://example.com.mx/graficos/interior-nota/abcd_novedad.png" class="img-responsive" alt="logo" /><span style="font-size: 1.1rem; font-weight: 700;"> Concertos for Oboe, Clarinet and Orchestra </span><hr style="border: 0;  height: 1px;   background-image: -webkit-linear-gradient(left, #666666, #ffffff);  background-image: -moz-linear-gradient(left, #666666, #ffffff);  background-image: -ms-linear-gradient(left, #666666, #ffffff);  background-image: -o-linear-gradient(left,  #666666, #ffffff); padding: 0; margin: 0;"/><span style="font-size: .9rem">ARTISTA: Camerata de las Américas, dirigida por Ludwig Carrasco </span><br><span style="font-size: .9rem">SELLO:   Urtext </span><br><span style="font-size: .9rem">PRECIO:   $168n </span></div></p>`,
        },
        {
          type: 'oembed_response',
          subtype: 'twitter',
          raw_oembed: {
            html: '<blockquote class="twitter-tweet"><p lang="fr" dir="ltr">21. Je déploie le robot pour reconnaitre OSCAR3.<br>Retour en images sur l’exercice de recherche appliquée organisé les 30 et 31 mars par l’EMIA et le centre de recherche. Robotisation du champ de bataille : sensibiliser les élèves aux enjeux de demain. <a href="https://twitter.com/hashtag/CapaciTERRE?src=hash&amp;ref_src=twsrc%5Etfw">#CapaciTERRE</a> <a href="https://twitter.com/hashtag/Robots?src=hash&amp;ref_src=twsrc%5Etfw">#Robots</a> <a href="https://t.co/HiZ2BFOZPY">pic.twitter.com/HiZ2BFOZPY</a></p>&mdash; Saint-Cyr Coëtquidan (@SaintCyrCoet) <a href="https://twitter.com/SaintCyrCoet/status/1379457690020294665?ref_src=twsrc%5Etfw">April 6, 2021</a></blockquote>\n<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>\n',
          },
        },
      ],
      taxonomy: {
        primary_section: { name: 'coronvirus' },
      },
    },
    {
      display_date: '2021-04-07T15:02:08.918Z',
      last_updated_date: '2021-04-08T10:34:41.432Z',
      website_url: '/food/empty-recipe',
      headlines: { basic: "I'm out of ideas" },
      credits: { by: [] },
    },
  ],
}

it('returns FB-IA template with default values', () => {
  const rss = FbiaRss({
    requestUri: 'https://localhost.com/arc/outboundfeeds/fb-ia/?outputType=xml',
    arcSite: 'demo',
    globalContent: {
      ...articles,
    },
    customFields: {
      channelTitle: '',
      channelDescription: '',
      channelCopyright: '',
      channelTTL: '1',
      channelUpdatePeriod: 'hourly',
      channelUpdateFrequency: '1',
      channelCategory: '',
      channelLogo: '',
      itemTitle: 'headlines.basic',
      itemDescription: 'description.basic',
      pubDate: 'display_date',
      itemCredits: 'credits.by[].name',
      itemCategory: '',
      includePromo: true,
      imageTitle: 'title',
      imageCaption: 'caption',
      imageCredits: 'credits.by[].name',
      includeContent: 'all',
      articleStyle: '',
      likesAndComments: '',
      metaTags: '',
      adPlacement: '',
      adDensity: '',
      placementSection: '',
      adScripts: '',
    },
  })
  expect(rss).toMatchSnapshot({
    rss: {
      channel: {
        lastBuildDate: expect.stringMatching(
          /\w+, \d+ \w+ \d{4} \d{2}:\d{2}:\d{2} \+0000/,
        ),
      },
    },
  })
})

it('returns FB-IA template with custom values', () => {
  const rss = FbiaRss({
    requestUri: 'https://localhost.com/arc/outboundfeeds/fb-ia/?outputType=xml',
    arcSite: 'demo',
    globalContent: {
      ...articles,
    },
    customFields: {
      channelTitle: 'Facebook Instant Articles Feed',
      channelDescription: 'Only the best for FB',
      channelCopyright: 'Copyright 2021',
      channelTTL: '5',
      channelUpdatePeriod: 'weekly',
      channelUpdateFrequency: '4',
      channelCategory: 'News',
      channelLogo: 'https://example.com/logo.png',
      itemTitle: 'headlines.basic',
      itemDescription: 'subheadlines.basic || description.basic',
      pubDate: 'last_updated_date',
      itemCredits: 'credits.by[]._id',
      itemCategory: 'News',
      includePromo: true,
      imageTitle: 'title',
      imageCaption: 'caption',
      imageCredits: 'credits.by[].name',
      includeContent: 'all',
      articleStyle: 'times-bold',
      likesAndComments: 'enable',
      metaTags: '<meta property="something" content="other thing" />',
      adPlacement: 'enable',
      adDensity: 'low',
      placementSection: '<script>myscript()</script>',
      adScripts:
        '<figure class="op-tracker"><iframe><script>alert("hi");</script></iframe></figure>',
    },
  })
  expect(rss).toMatchSnapshot({
    rss: {
      channel: {
        lastBuildDate: expect.stringMatching(
          /\w+, \d+ \w+ \d{4} \d{2}:\d{2}:\d{2} \+0000/,
        ),
      },
    },
  })
})

it('returns FB-IA template with empty values', () => {
  const rss = FbiaRss({
    requestUri: 'https://localhost.com/arc/outboundfeeds/fb-ia/?outputType=xml',
    arcSite: 'demo',
    globalContent: {
      ...articles,
    },
    customFields: {
      channelTitle: '',
      channelDescription: '',
      channelCopyright: '',
      channelTTL: '',
      channelUpdatePeriod: '',
      channelUpdateFrequency: '',
      channelCategory: '',
      channelLogo: '',
      itemTitle: '',
      itemDescription: '',
      pubDate: 'last_updated_date',
      itemCredits: '',
      itemCategory: '',
      includePromo: true,
      imageTitle: '',
      imageCaption: '',
      imageCredits: '',
      includeContent: '',
      articleStyle: '',
      likesAndComments: '',
      metaTags: '',
      adPlacement: '',
      adDensity: '',
      placementSection: '',
      adScripts: '',
      promoItemsJmespath: '',
    },
  })
  expect(rss).toMatchSnapshot({
    rss: {
      channel: {
        lastBuildDate: expect.stringMatching(
          /\w+, \d+ \w+ \d{4} \d{2}:\d{2}:\d{2} \+0000/,
        ),
      },
    },
  })
})
