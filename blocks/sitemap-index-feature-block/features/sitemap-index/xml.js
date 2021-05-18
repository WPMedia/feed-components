import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'
import URL from 'url'

const jmespath = require('jmespath')

const sitemapIndexTemplate = ({
  feedPath,
  feedParam,
  section,
  domain,
  maxCount,
  paramList,
  lastModDate,
  buildIndexes,
}) => ({
  sitemapindex: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    sitemap: buildIndexes(
      maxCount,
      domain,
      feedPath,
      section,
      paramList,
      lastModDate,
    ),
  },
})

export function SitemapIndex({
  globalContent,
  customFields,
  arcSite,
  requestUri,
}) {
  const { feedDomainURL = '' } = getProperties(arcSite)
  let { count: maxCount = 0 } = globalContent
  // ES7 caps results at 10k, using ?from=10000 will cause an error
  if (maxCount === 10000) maxCount--
  const paramList = customFields.feedParam.split('&').filter((i) => i)
  const lastModDate = jmespath.search(
    globalContent,
    `content_elements[0]."${customFields.lastMod}"`,
  )
  const pathList = new URL.URL(requestUri, feedDomainURL).pathname.split(
    customFields.feedName,
  )
  const section = pathList && pathList.length === 2 ? pathList[1] : ''

  const buildIndexes = (
    maxCount,
    feedDomainUrl,
    feedPath,
    section,
    paramList,
    lastModDate,
  ) => {
    const arr = []
    if (maxCount) {
      for (let i = 0; i <= maxCount; i += 100) {
        // only push from param if it's not zero
        const newParamList = [...paramList, ...(i ? [`from=${i}`] : [])]
        arr.push({
          loc: `${feedDomainURL}${feedPath}${section}?${newParamList.join(
            '&',
          )}`,
          ...(lastModDate && { lastmod: lastModDate }),
        })
      }
    }
    return arr
  }

  // can't return null for xml return type, must return valid xml template
  return sitemapIndexTemplate({
    ...customFields,
    section,
    domain: feedDomainURL,
    maxCount,
    paramList,
    lastModDate,
    buildIndexes,
  })
}

SitemapIndex.propTypes = {
  customFields: PropTypes.shape({
    lastMod: PropTypes.oneOf([
      'created_date',
      'display_date',
      'first_publish_date',
      'last_updated_date',
      'publish_date',
      'Exclude from sitemap',
    ]).tag({
      label: 'Last Modified Date',
      group: 'Format',
      description: 'Which date field should be used in the Sitemap Index',
      defaultValue: 'last_updated_date',
    }),
    feedPath: PropTypes.string.tag({
      label: 'Sitemap Path',
      group: 'Format',
      description:
        'Path to the sitemap feed, defaults to /arc/outboundfeeds/sitemap/',
      defaultValue: '/arc/outboundfeeds/sitemap/',
    }),
    feedName: PropTypes.string.tag({
      label: 'Sitemap-Index Name ',
      group: 'Format',
      description: 'Name of the sitemap-index feed in the URL',
      defaultValue: '/sitemap-index/',
    }),
    feedParam: PropTypes.string.tag({
      label: 'Additional URL Parameters',
      group: 'Format',
      description: 'Optional parameters to append to URL, start with &',
      defaultValue: '&outputType=xml',
    }),
  }),
}
SitemapIndex.label = 'Sitemap Index'
export default Consumer(SitemapIndex)
