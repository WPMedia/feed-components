import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'

const sitemapIndexTemplate = ({
  feedPath,
  feedParam,
  domain,
  maxCount,
  lastModDate,
  buildIndexes,
}) => ({
  sitemapindex: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    sitemap: buildIndexes(maxCount, domain, feedPath, feedParam, lastModDate),
  },
})

export function SitemapIndex({ globalContent, customFields, arcSite }) {
  const { feedDomainURL = '' } = getProperties(arcSite)
  const { count: maxCount = 0 } = globalContent
  const lastModDate = globalContent.content_elements[0][customFields.lastMod]

  const buildIndexes = (
    maxCount,
    feedDomainUrl,
    feedPath,
    feedParam,
    lastModDate,
  ) => {
    const arr = []
    for (let i = 0; i <= maxCount; i += 100) {
      arr.push({
        loc: `${feedDomainURL}${feedPath}?from=${i}${
          feedParam ? feedParam : ''
        }`,
        ...(lastModDate && { lastmod: lastModDate }),
      })
    }
    return arr
  }

  // can't return null for xml return type, must return valid xml template
  return sitemapIndexTemplate({
    ...customFields,
    domain: feedDomainURL,
    maxCount,
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
      label: 'Feed Path',
      group: 'Format',
      description: 'Feed Path',
      defaultValue: '/arcio/sitemap/',
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
