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

export const getURLType = (url) => {
  const imgRegex = /jpe?g|png|webp/i
  const audioRegex = /^(https?|ftp|file):\/\/(www.)?(.*?)\.(mp3)\??(?:&?[^=&]*=[^=&]*)*$/
  const videoRegex = /^(https?|ftp|file):\/\/(www.)?(.*?)\.(mp4|ts)\??(?:&?[^=&]*=[^=&]*)*$/
  const uri = url.split('.')
  let type = uri[uri.length - 1]
  const defaultType = { label: 'Audio', type: `audio/mp3` }
  if (new RegExp(imgRegex).test(url)) {
    type = /jpe?g/i.test(type) ? 'jpeg' : type
    return { label: 'image', type: `image/${type}` }
  } else if (new RegExp(audioRegex).test(url)) {
    return { label: 'Audio', type: `audio/mp3` }
  } else if (new RegExp(videoRegex).test(url)) {
    return { label: 'Video', type: `video/${type}` }
  }
  return defaultType
}

const rssTemplate = (
  elements,
  {
    audioAvailable,
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
      ...(channelTitle && { title: channelTitle }),
      link: `${domain}`,
      ...(channelDescription && { description: channelDescription }),
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
        let category
        const enclosureurl = jmespath.search(s, audioAvailable)
        const url = `${domain}${s.website_url || s.canonical_url || ''}`
        return {
          title: jmespath.search(s, itemTitle) || '',
          link: url,
          guid: s._id,
          pubDate: s[pubDate],
          ...(enclosureurl && {
            enclosure: {
              '@url': enclosureurl,
              '@type': getURLType(enclosureurl).type,
            },
          }),
          ...(itemCategory &&
            (category = jmespath.search(s, itemCategory)) &&
            category && { category: category }),
          description: cheerio
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
            .text(),
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
    resizerWidth: 0,
    resizerHeight: 0,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    rssBuildContent,
  })
}

Rss.propTypes = {
  customFields: PropTypes.shape({
    audioAvailable: PropTypes.string.tag({
      label: 'Audio URL',
      group: 'Enclosure',
      description:
        'ANS field to use for audio enclosure URL, if blank will be excluded.',
      defaultValue: `content_elements[?type=='audio'].streams[].url|[0]`,
    }),
    ...generatePropsForFeed('rss', PropTypes, [
      'imageTitle',
      'imageCaption',
      'imageCredits',
      'includePromo',
      'channelUpdatePeriod',
      'channelUpdateFrequency',
      'itemDescription',
      'itemCredits',
      'videoSelect',
      'resizerKVP',
    ]),
  }),
}
Rss.label = 'RSS Alexa'
export default Consumer(Rss)
