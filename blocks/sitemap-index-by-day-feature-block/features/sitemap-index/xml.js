import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'
import moment from 'moment'
import URL from 'url'

const sitemapIndexTemplate = ({
  maxDays,
  feedPath,
  feedParam,
  section,
  domain,
  buildIndexes,
}) => ({
  sitemapindex: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    sitemap: buildIndexes(maxDays, domain, feedPath, section, feedParam),
  },
})

export function SitemapIndexByDay({
  globalContent,
  customFields,
  arcSite,
  requestUri,
}) {
  const { feedDomainURL = '' } = getProperties(arcSite)
  const pathList = new URL.URL(requestUri, feedDomainURL).pathname.split(
    customFields.feedName,
  )
  const section = pathList && pathList.length === 2 ? pathList[1] : ''

  // numberOfDays can be an int or a date
  let maxDays
  if (customFields.numberOfDays.match(/\d{4}-\d{2}-\d{2}/)) {
    const start = moment.utc(new Date())
    const end = moment(customFields.numberOfDays)
    maxDays = start.diff(end, 'days') + 1
  } else {
    maxDays = parseInt(customFields.numberOfDays) || 7
  }

  const buildIndexes = (
    maxDays,
    feedDomainUrl,
    feedPath,
    section,
    feedParam,
  ) => {
    const arr = []
    const now = moment.utc(new Date())
    for (let i = 0; i < maxDays; i++) {
      const formattedDate = i === 0 ? 'latest' : now.format('YYYY-MM-DD')
      arr.push({
        loc: `${feedDomainURL}${feedPath}${section}${formattedDate}?${
          feedParam || ''
        }`,
      })
      now.subtract(1, 'days')
    }
    return arr
  }

  // can't return null for xml return type, must return valid xml template
  return sitemapIndexTemplate({
    ...customFields,
    section,
    domain: feedDomainURL,
    maxDays,
    buildIndexes,
  })
}

SitemapIndexByDay.propTypes = {
  customFields: PropTypes.shape({
    numberOfDays: PropTypes.string.tag({
      label: 'Number of Days to include',
      group: 'Format',
      description:
        'How many days should be included in the Sitemap Index. Enter a date in YYYY-MM-DD format to use a specific end date.',
      defaultValue: '7',
    }),
    feedPath: PropTypes.string.tag({
      label: 'Sitemap Path',
      group: 'Format',
      description:
        'Path to the sitemap feed to use in each link. Must end in a slash. Defaults to /arc/outboundfeeds/sitemap-by-day/',
      defaultValue: '/arc/outboundfeeds/sitemap-by-day/',
    }),
    feedName: PropTypes.string.tag({
      label: 'Sitemap-Index Name ',
      group: 'Format',
      description: 'Name of the sitemap-index feed in the URL',
      defaultValue: '/sitemap-index-by-day/',
    }),
    feedParam: PropTypes.string.tag({
      label: 'Additional URL Parameters',
      group: 'Format',
      description:
        'Optional parameters to append to URL. Separate values with an &',
      defaultValue: 'outputType=xml',
    }),
  }),
}
SitemapIndexByDay.label = 'Sitemap Index By Day'
export default Consumer(SitemapIndexByDay)
