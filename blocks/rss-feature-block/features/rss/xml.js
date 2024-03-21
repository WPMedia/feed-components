import moment from 'moment'
import URL from 'url'

import { BuildContent } from '@wpmedia/feeds-content-elements'
import { BuildPromoItems } from '@wpmedia/feeds-promo-items'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import { buildResizerURL } from '@wpmedia/feeds-resizer'

import { resizerKey } from 'fusion:environment'
import Consumer from 'fusion:consumer'
import PropTypes from 'fusion:prop-types'
import getProperties from 'fusion:properties'
const jmespath = require('jmespath')


const rssTemplate = (
  elements,
  {
    channelTitle,
    channelDescription,
    channelCopyright,
    channelTTL,
    channelUpdatePeriod,
    channelUpdateFrequency,
    channelCategory,
    channelLogo,
    imageTitle,
    imageCaption,
    imageCredits,
    itemTitle,
    itemDescription,
    pubDate,
    itemCredits,
    itemCategory,
    includePromo,
    includeContent,
    videoSelect,
    requestPath,
    resizerURL,
    resizerWidth,
    resizerHeight,
    promoItemsJmespath,
    domain,
    feedTitle,
    channelLanguage,
    rssBuildContent,
    PromoItems,
  },
) => ({
  rss: {
    '@xmlns:atom': 'http://www.w3.org/2005/Atom',
    '@xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
    ...(itemCredits && {
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    }),
    ...(channelUpdatePeriod &&
      channelUpdatePeriod !== 'Exclude field' && {
        '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
      }),
    '@version': '2.0',
    ...(includePromo && {
      '@xmlns:media': 'http://search.yahoo.com/mrss/',
    }),
    channel: {
      title: { $: channelTitle || feedTitle },
      link: `${domain}`,
      'atom:link': {
        '@href': `${domain}${requestPath}`,
        '@rel': 'self',
        '@type': 'application/rss+xml',
      },
      description: { $: channelDescription || `${feedTitle} News Feed` },
      lastBuildDate: moment
        .utc(new Date())
        .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      ...(channelLanguage &&
        channelLanguage.toLowerCase() !== 'exclude' && {
          language: channelLanguage,
        }),
      ...(channelCategory && { category: channelCategory }),
      ...(channelCopyright && {
        copyright: channelCopyright,
      }), // TODO Add default logic
      ...(channelTTL && { ttl: channelTTL }),
      ...(channelUpdatePeriod &&
        channelUpdatePeriod !== 'Exclude field' && {
          'sy:updatePeriod': channelUpdatePeriod,
        }),
      ...(channelUpdateFrequency &&
        channelUpdatePeriod !== 'Exclude field' && {
          'sy:updateFrequency': channelUpdateFrequency,
        }),
      ...(channelLogo && {
        image: {
          url: buildResizerURL(channelLogo, resizerKey, resizerURL),
          title: channelTitle || feedTitle,
          link: domain,
        },
      }),

      item: elements.map((ans) => {
        let author, body, category
        const url = `${domain}${ans.website_url || ans.canonical_url || ''}`
        const img = PromoItems.mediaTag({
          ans,
          promoItemsJmespath,
          resizerKey,
          resizerURL,
          resizerWidth,
          resizerHeight,
          imageTitle,
          imageCaption,
          imageCredits,
          videoSelect,
        })
        return {
          ...(itemTitle && {
            title: { $: jmespath.search(ans, itemTitle) || '' },
          }),
          link: url,
          guid: {
            '#': url,
            '@isPermaLink': true,
          },
          ...(itemCredits &&
            (author = jmespath.search(ans, itemCredits)) &&
            author.length && {
              'dc:creator': { $: author.join(', ') },
            }),
          ...(itemDescription && {
            description: { $: jmespath.search(ans, itemDescription) || '' },
          }),
          pubDate: moment
            .utc(ans[pubDate])
            .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
          ...(itemCategory &&
            (category = jmespath.search(ans, itemCategory)) &&
            category && { category: category }),
          ...(includeContent !== 0 &&
            (body = rssBuildContent.parse(
              ans.content_elements || [],
              includeContent,
              domain,
              resizerKey,
              resizerURL,
              resizerWidth,
              resizerHeight,
              videoSelect,
            )) &&
            body && {
              'content:encoded': {
                $: body,
              },
            }),
          ...(includePromo && img && { '#': img }),
        }
      }),
    },
  },
})

export function Rss({ globalContent, customFields, arcSite, requestUri }) {
  const {
    resizerURL = '',
    feedDomainURL = 'http://localhost.com',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)

  const channelLanguage = customFields.channelLanguage || feedLanguage
  const { width = 0, height = 0 } = customFields.resizerKVP || {}
  const requestPath = new URL.URL(requestUri, feedDomainURL).pathname

  const PromoItems = new BuildPromoItems()
  const rssBuildContent = new BuildContent()

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(globalContent.content_elements || [], {
    ...customFields,
    requestPath,
    resizerURL,
    resizerWidth: width,
    resizerHeight: height,
    domain: feedDomainURL,
    feedTitle,
    channelLanguage,
    rssBuildContent,
    PromoItems,
  })
}

Rss.propTypes = {
  customFields: PropTypes.shape({
    ...generatePropsForFeed('rss', PropTypes),
  }),
}
Rss.label = 'RSS Standard'
Rss.icon = 'arc-rss'
export default Consumer(Rss)
