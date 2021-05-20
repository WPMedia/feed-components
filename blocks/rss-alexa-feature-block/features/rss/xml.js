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

const cheerio = require('cheerio')

const rssTemplate = (
  elements,
  {
    channelTitle,
    channelDescription,
    channelCopyright,
    channelTTL,
    channelCategory,
    channelLogo,
    itemTitle,
    pubDate,
    itemCategory,
    includeContent,
    resizerURL,
    resizerWidth,
    resizerHeight,
    domain,
    feedTitle,
    feedLanguage,
    rssBuildContent,
  },
) => ({
  rss: {
    '@version': '2.0',
    channel: {
      ...(channelTitle && {title: channelTitle} || feedTitle),
      link: `${domain}`,
      ...(channelDescription && {description: channelDescription} || `${feedTitle} News Feed`),
      lastBuildDate: moment
        .utc(new Date())
        .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      ...(feedLanguage && { language: feedLanguage }),
      ...(channelCategory && { category: channelCategory }),
      ...(channelCopyright && {
        copyright: channelCopyright,
      }), // TODO Add default logic
      ...(channelTTL && { ttl: channelTTL }),
      ...(channelLogo && {
        image: {
          url: buildResizerURL(channelLogo, resizerKey, resizerURL),
          title: channelTitle || feedTitle,
          link: domain,
        },
      }),

      item: elements.map((s) => {
        let body, category
        const url = `${domain}${s.website_url || s.canonical_url || ''}`
        return {
          title: jmespath.search(s, itemTitle) || '',
          link: url,
          guid: s._id,
          pubDate: s[pubDate],
          ...(itemCategory &&
            (category = jmespath.search(s, itemCategory)) &&
            category && { category: category }),
          ...(includeContent !== 0 &&
            (body = cheerio
              .load(
                rssBuildContent.parse(
                  s.content_elements || [],
                  includeContent,
                  domain,
                  resizerKey,
                  resizerURL,
                  resizerWidth,
                  resizerHeight,
                ) || '',
              )
              .text('bodyContent')) &&
            body && {
              description: body,
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

  const { width = 0, height = 0 } = customFields.resizerKVP || {}

  const rssBuildContent = new BuildContent()

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    resizerURL,
    resizerWidth: width,
    resizerHeight: height,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    rssBuildContent,
  })
}

Rss.propTypes = {
  customFields: PropTypes.shape({
    audioAvailable: PropTypes.string.tag({
      label: 'Audio',
      group: 'Audio',
      description: 'description',
      defaultValue: 'content_elements?[type==audio].streams[0].url'
    }),
    ...generatePropsForFeed('rss', PropTypes),
  }),
}
Rss.label = 'RSS Alexa'
export default Consumer(Rss)
