'use strict'

import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
import { utc } from 'moment'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import buildURL from '../../resizerUrl'
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
    buildContent,
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
        '@href': `${domain}`, // TODO Need to include full url
        '@rel': 'self',
        '@type': 'application/rss+xml',
      },
      description: `${channelDescription || feedTitle + ' News Feed'}`,
      lastBuildDate: utc(new Date()).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
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
          url: buildURL(channelLogo, resizerKey, resizerURL),
          title: `${channelTitle || feedTitle}`,
          link: `${domain}`,
        },
      }),

      item: elements.map((s) => {
        const img =
          s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
        return {
          title: `${jmespath.search(s, itemTitle)}`,
          link: `${domain}${s.website_url || s.canonical_url}`,
          guid: {
            '#text': `${domain}${s.website_url || s.canonical_url}`,
            '@isPermaLink': true,
          },
          description: `${jmespath.search(s, itemDescription)}`,
          pubDate: utc(s[pubDate]).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
          ...(includeContent !== '0' && {
            'content:encoded': buildContent(s, includeContent),
          }),
          ...(includePromo &&
            img &&
            img.url && {
              'media:content': {
                '@type': 'image/jpeg',
                '@url': buildURL(img.url, resizerKey, resizerURL),
                ...(img[imageCaption] && {
                  'media:description': {
                    $: img[imageCaption],
                  },
                }),
                ...(img[imageTitle] && {
                  'media:title': {
                    $: img[imageTitle],
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

  const buildContent = (content, num_rows) => {
    // TODO Build the content
    return ''
  }

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    resizerURL,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    buildContent,
  })
}

Rss.propTypes = {
  customFields: PropTypes.shape({
    channelTitle: PropTypes.string.tag({
      label: 'RSS Title',
      group: 'Channel',
      description: 'RSS Channel Title',
      defaultValue: '',
    }),
    channelDescription: PropTypes.string.tag({
      label: 'RSS Description',
      group: 'Channel',
      description: 'RSS Channel Description',
      defaultValue: '',
    }),
    channelCopyright: PropTypes.string.tag({
      label: 'Copyright',
      group: 'Channel',
      description: 'RSS Copyright',
      defaultValue: '',
    }),
    channelTTL: PropTypes.string.tag({
      label: 'Time To Live',
      group: 'Channel',
      description: 'Number of minutes to wait to check for new content',
      defaultValue: '1',
    }),
    channelUpdatePeriod: PropTypes.oneOf([
      'hourly',
      'daily',
      'weekly',
      'monthly',
      'yearly',
    ]).tag({
      label: 'Update Period',
      group: 'Channel',
      description: 'Which period of time should be used',
      defaultValue: 'hourly',
    }),
    channelUpdateFrequency: PropTypes.string.tag({
      label: 'Update Frequency',
      group: 'Channel',
      description: 'Number of Update Periods to wait to check for new content',
      defaultValue: '1',
    }),
    channelCategory: PropTypes.string.tag({
      label: 'Category',
      group: 'Channel',
      description: 'Category that describes this RSS feed',
      defaultValue: '',
    }),
    channelLogo: PropTypes.string.tag({
      label: 'Logo URL',
      group: 'Channel',
      description: 'URL to the logo for this RSS feed',
      defaultValue: '',
    }),
    itemTitle: PropTypes.string.tag({
      label: 'Title',
      group: 'Item',
      description: 'ANS fields to use for article title',
      defaultValue: 'headlines.basic',
    }),
    itemDescription: PropTypes.string.tag({
      label: 'Description',
      group: 'Item',
      description: 'ANS fields to use for article description',
      defaultValue: 'description.basic',
    }),
    pubDate: PropTypes.oneOf([
      'created_date',
      'display_date',
      'first_publish_date',
      'last_updated_date',
      'publish_date',
    ]).tag({
      label: 'Publication Date',
      group: 'Item',
      description: 'Which date field should be used',
      defaultValue: 'display_date',
    }),
    itemCategory: PropTypes.string.tag({
      label: 'Category',
      group: 'Item',
      description: 'ANS field to use for article category',
      defaultValue: '',
    }),
    includePromo: PropTypes.boolean.tag({
      label: 'Include promo images?',
      group: 'Format',
      description: 'Include the featured image',
      defaultValue: true,
    }),
    imageTitle: PropTypes.string.tag({
      label: 'ANS image title key',
      group: 'Field Mapping',
      description:
        'ANS value for associated story used for the <image:title> sitemap tag',
      defaultValue: 'title',
    }),
    imageCaption: PropTypes.string.tag({
      label: 'ANS image caption key',
      group: 'Field Mapping',
      description:
        'ANS value for associated story image used for the <image:caption> sitemap tag',
      defaultValue: 'caption',
    }),
    includeContent: PropTypes.oneOf([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'all',
    ]).tag({
      label: 'Number of paragraphs to include',
      group: 'Item',
      description: 'Number of paragraphs to include',
      defaultValue: '0',
    }),
  }),
}
Rss.label = 'Standard RSS'
export default Consumer(Rss)
