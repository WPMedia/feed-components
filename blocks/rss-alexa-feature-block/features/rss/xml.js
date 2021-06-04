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

const getURLType = (url) => {
  const imgRegex = new RegExp(/(jpe?g|png|webp)$/);
  const audioRegex = new RegExp('/(.mp3)$/');
  const videoRegex = new RegExp('/(.mp4|ts)$/');
  const defaultType = 'audio/mp3';
  const uri = url.split(".");
  const type = uri[uri.length -1];
  if(imgRegex.test(url)) {
    return `image/${type}`;
  }
  if(audioRegex.test(url)){
    return `audio/${type}`;
  }
  if(videoRegex.test(url)){
    return `video/${type}`;
  }
  
  return defaultType;
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
        let body, category,
        enclosureurl = jmespath.search(s, audioAvailable);
        const url = `${domain}${s.website_url || s.canonical_url || ''}`
        return {
          title: jmespath.search(s, itemTitle) || '',
          link: url,
          guid: s._id,
          pubDate: s[pubDate],
          ...(enclosureurl  &&
          {
            enclosure: {
              '@url': enclosureurl,
              '@type': getURLType(enclosureurl)
            }
          }),
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
              .text()) &&
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

  const { width = 0, height = 0 } = customFields.resizerKVP || {};
  

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
      defaultValue: `content_elements[?type=='audio'].streams[].url|[0]`,
    }),
    ...generatePropsForFeed('rss', PropTypes, ['audioAvailable']),
  }),
}
Rss.label = 'RSS Alexa'
export default Consumer(Rss)
