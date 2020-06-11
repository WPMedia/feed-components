import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
import moment from 'moment'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { BuildContent } from '@wpmedia/feeds-content-elements'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'
import { buildResizerURL } from '@wpmedia/feeds-resizer'

const jmespath = require('jmespath')

const rssTemplate = (
  elements,
  {
    channelTitle,
    channelDescription,
    channelPath,
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
    itemCategory,
    includePromo,
    includeContent,
    resizerURL,
    domain,
    feedTitle,
    feedLanguage,
    rssBuildContent,
  },
) => ({
  rss: {
    '@xmlns:atom': 'http://www.w3.org/2005/Atom',
    '@xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
    '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
    '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
    '@version': '2.0',
    ...(includePromo && {
      '@xmlns:media': 'http://search.yahoo.com/mrss/',
    }),
    channel: {
      title: `${channelTitle || feedTitle}`,
      link: `${domain}`,
      'atom:link': {
        '@href': `${domain}${channelPath}`,
        '@rel': 'self',
        '@type': 'application/rss+xml',
      },
      description: `${channelDescription || feedTitle + ' News Feed'}`,
      lastBuildDate: moment
        .utc(new Date())
        .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      ...(feedLanguage && { language: feedLanguage }),
      ...(channelCategory && { category: channelCategory }),
      ...(channelCopyright && {
        copyright: channelCopyright,
      }), // TODO Add default logic
      ...(channelTTL && { ttl: channelTTL }),
      ...(channelUpdatePeriod && {
        'sy:updatePeriod': channelUpdatePeriod,
      }),
      ...(channelUpdateFrequency && {
        'sy:updateFrequency': channelUpdateFrequency,
      }),
      ...(channelLogo && {
        image: {
          url: buildResizerURL(channelLogo, resizerKey, resizerURL),
          title: `${channelTitle || feedTitle}`,
          link: `${domain}`,
        },
      }),

      item: elements.map((s) => {
        let author, body, category
        const url = `${domain}${s.website_url || s.canonical_url}`
        const img =
          s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
        return {
          title: `${jmespath.search(s, itemTitle)}`,
          link: url,
          guid: {
            '#': url,
            '@isPermaLink': true,
          },
          ...((author = jmespath.search(s, 'credits.by[].name')) &&
            author && {
              'dc:creator': author.join(','),
            }),
          description: { $: jmespath.search(s, itemDescription) },
          pubDate: moment
            .utc(s[pubDate])
            .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
          ...(itemCategory &&
            (category = jmespath.search(s, itemCategory)) &&
            category && { category: category }),
          ...(includeContent !== '0' &&
            (body = rssBuildContent.parse(
              s.content_elements,
              includeContent,
              domain,
              resizerKey,
              resizerURL,
            )) &&
            body && {
              'content:encoded': {
                $: body,
              },
            }),
          ...(includePromo &&
            img &&
            img.url && {
              'media:content': {
                '@type': 'image/jpeg',
                '@url': buildResizerURL(img.url, resizerKey, resizerURL),
                ...(jmespath.search(img, imageCaption) && {
                  'media:description': {
                    '@type': 'plain',
                    $: jmespath.search(img, imageCaption),
                  },
                }),
                ...(jmespath.search(img, imageTitle) && {
                  'media:title': {
                    $: jmespath.search(img, imageTitle),
                  },
                }),
                ...((jmespath.search(img, imageCredits) || []).length && {
                  'media:credit': {
                    '@role': 'author',
                    '@scheme': 'urn:ebu',
                    '#': jmespath.search(img, imageCredits).join(','),
                  },
                }),
              },
            }),
        }
      }),
    },
  },
})

export function Rss({ globalContent, customFields, arcSite }) {
  const {
    resizerURL = '',
    feedDomainURL = '',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)

  const rssBuildContent = new BuildContent()

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    resizerURL,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    rssBuildContent,
  })
}

Rss.propTypes = {
  customFields: PropTypes.shape({
    channelPath: PropTypes.string.tag({
      label: 'Path',
      group: 'Channel',
      description:
        'Path to the feed, excluding the domain, defaults to /arcio/rss',
      defaultValue: '/arcio/rss/',
    }),
    ...generatePropsForFeed('rss', PropTypes),
  }),
}
Rss.label = 'Standard RSS'
export default Consumer(Rss)
