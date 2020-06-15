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
            //convert_article_body
            //change this to fb_ia format
            (body = buildContent(
              (content = s.content_elements),
              includeContent,
              domain,
              resizerKey,
              resizerURL,
            )) &&
            body && {
              'content:encoded': {
                $: {
                  doctype: 'html',
                  html: {
                    '@lang': `${jmespath.search(s, feedLanguage)}`,
                    head: {
                      link: {
                        '@rel': 'canonical',
                        '@href': `${domain}${channelPath}`,
                      },
                      title: `${jmespath.search(s, itemTitle)}`,

                      /*meta : {
                          '@property': "og:title",
                          '@content': `${jmespath.search(s, itemTitle)}`,
                        },
                        meta: {
                          '@property':"og:url",
                          '@content'= url,
                        },
                        meta: {
                          '@property'="og:description",
                          '@content'= { $: jmespath.search(s, itemDescription), }
                        },
                        meta: {//how to deal with fb specific tags?
                          '@property'="fb:use_automatic_ad_placement",
                          //'@content'=
                        }, meta: {
                          '@property'="op:markup_version"
                          '@content'= "v1.0"
                        },
                        meta: {
                          '@property'="fb:article_style"
                          '@content'=
                        },*/
                      meta: {
                        '@property': 'og:image',
                        '@content': buildResizerURL(
                          img.url,
                          resizerKey,
                          resizerURL,
                        ),
                      },
                      /*meta: {
                          '@property'="fb:likes_and_comments"
                          '@content'=
                        },*/
                    },
                    body: {
                      article: {
                        /*header : {
                            (h1 : jmespath(s, '')) && h1
                              h2 : {

                              } && h2

                            }*/
                        time: {
                          '@datetime': {
                            lastBuildDate: moment
                              .utc(new Date())
                              .format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
                          },
                          '@class': 'op_modified',
                        },
                        /*time : {
                              '@datetime': {
                                pubDate: moment
                                  .utc(new Date())
                                  .format('ddd, DD MMM YYYY HH:mm:ss ZZ')
                              },
                              '@class':"op_published"
                            }*/
                      },
                      address: {
                        //a list of authors
                        a: jmespath
                          .search(s, 'credits.by[].name')
                          .toUpperCase(),
                      },
                      /*...figure : {
                            '@class' =
                          }
                        ...p : {
                             '@id' =

                          }*/
                      footer: {
                        small: `${jmespath.search(s, 'copyright')}`,
                      },
                    },
                  },
                },
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

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    resizerURL,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
  })
}

Rss.propTypes = {
  customFields: PropTypes.shape({
    ...generatePropsForFeed('rss', PropTypes),
  }),
}
Rss.label = 'Facebook IA RSS'
export default Consumer(Rss)
