import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'
import moment from 'moment'
import URL from 'url'

const sitemapIndexTemplate = ({
  maxDays,
  feedPath,
  feedParam,
  feedDates2Split,
  section,
  domain,
  buildIndexes,
}) => ({
  sitemapindex: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    sitemap: buildIndexes(
      maxDays,
      domain,
      feedPath,
      section,
      feedParam,
      feedDates2Split,
    ),
  },
})

export function SitemapIndexByDay({
  globalContent,
  customFields,
  arcSite,
  requestUri,
}) {
  const { feedDomainURL = 'http://localhost' } = getProperties(arcSite)
  const pathList = new URL.URL(requestUri, feedDomainURL).pathname.split(
    customFields.feedName,
  )
  const section = pathList && pathList.length === 2 ? pathList[1] : ''

  // numberOfDays can be an int or a date
  let maxDays
  if (customFields.numberOfDays.match(/\d{4}-\d{2}-\d{2}/)) {
    const start = moment.utc(new Date()).startOf('day')
    const end = moment.utc(customFields.numberOfDays, 'YYYY-MM-DD', true)
    if (end.isValid() && end.isBefore(start) && end.isAfter('1994-12-31')) {
      maxDays = start.diff(end, 'days') + 1
    }
  }
  if (!maxDays) {
    maxDays =
      (!isNaN(customFields.numberOfDays) &&
        parseInt(customFields.numberOfDays)) ||
      2
  }

  const buildIndexes = (
    maxDays,
    feedDomainUrl,
    feedPath,
    section,
    feedParam,
    feedDates2Split,
  ) => {
    const arr = []
    const now = moment.utc(new Date())
    const splitAllDates =
      feedDates2Split.all || feedDates2Split.All || feedDates2Split.ALL
    const feedPathKeys = Object.keys(feedPath).map((i) => parseInt(i))
    let pathValue = '/arc/outboundfeeds/sitemap/'
    for (let i = 0; i < maxDays; i++) {
      const pathIndex = feedPathKeys.indexOf(i)
      if (pathIndex !== -1) pathValue = feedPath[i]
      const formattedDate = i === 0 ? 'latest' : now.format('YYYY-MM-DD')
      const numSplits = feedDates2Split[formattedDate] || splitAllDates
      if (numSplits) {
        for (let splits = 1; splits <= numSplits; splits++) {
          arr.push({
            loc: `${feedDomainURL}${pathValue}${section}${formattedDate}-${splits}/?${
              feedParam || ''
            }`,
          })
        }
      } else {
        arr.push({
          loc: `${feedDomainURL}${pathValue}${section}${formattedDate}/?${
            feedParam || ''
          }`,
        })
      }
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
        'How many days should be included in the Sitemap Index. Enter a date in YYYY-MM-DD format to use a specific end date. The earliest date is 1995-01-01.',
      defaultValue: '2',
    }),
    feedPath: PropTypes.kvp.tag({
      label: 'Number of days and sitemap path',
      group: 'Format',
      description:
        'Number of days and resolver to use.  Each higher resolver number has a longer TTL value to reduce Content-API load.',
      defaultValue: {
        0: '/arc/outboundfeeds/sitemap/',
        2: '/arc/outboundfeeds/sitemap2/',
        7: '/arc/outboundfeeds/sitemap3/',
      },
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
      description:
        'Optional parameters to append to URL. Separate values with an &, do not include a ?',
      defaultValue: 'outputType=xml',
    }),
    feedDates2Split: PropTypes.kvp.tag({
      label: 'Dates with large results',
      group: 'Format',
      description:
        'Dates that have more than 1000 results might time out. You can enter a date in YYYY-MM-DD format and the number of links of 1000 records to generate. Use All to do this on every day.',
      defaultValue: {},
    }),
  }),
}
SitemapIndexByDay.label = 'Sitemap Index By Day'
export default Consumer(SitemapIndexByDay)
