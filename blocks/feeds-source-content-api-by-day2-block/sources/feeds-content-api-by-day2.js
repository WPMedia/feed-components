import request from 'request-promise-native'
import { CONTENT_BASE, ARC_ACCESS_TOKEN } from 'fusion:environment'
import getProperties from 'fusion:properties'
import moment from 'moment'

const contentURL = `${CONTENT_BASE}/content/v4/search/published/`
// Excludes content_elements
const ansFields = [
  'canonical_url',
  'canonical_website',
  'created_date',
  'credits',
  'description',
  'display_date',
  'duration',
  'first_publish_date',
  'headlines',
  'last_updated_date',
  'promo_image',
  'promo_items',
  'publish_date',
  'streams',
  'subheadlines',
  'subtitles',
  'subtype',
  'taxonomy.primary_section',
  'taxonomy.seo_keywords',
  'taxonomy.tags',
  'type',
  'video_type',
]

const options = {
  gzip: true,
  json: true,
  auth: { bearer: ARC_ACCESS_TOKEN },
}
const validANSDates = [
  'created_date',
  'last_updated_date',
  'display_date',
  'first_publish_date',
  'publish_date',
]

const fetch = async (key = {}) => {
  const paramList = {
    website: key['arc-site'],
    size: 100,
    sort: key.sort || 'last_updated_date:desc',
  }

  // limit C-API response to just this websites sections to reduce size
  ansFields.push(`websites.${key['arc-site']}`)

  if (key['Source-Exclude']) {
    const sourceExcludes = []
    key['Source-Exclude'].split(',').forEach((i) => {
      if (i && ansFields.indexOf(i) !== -1) {
        ansFields.splice(ansFields.indexOf(i), 1)
      } else {
        i && sourceExcludes.push(i)
      }
    })
    if (sourceExcludes.length)
      paramList._sourceExcludes = sourceExcludes.join(',')
  }

  if (key['Source-Include']) {
    key['Source-Include']
      .split(',')
      .forEach((i) => i && !ansFields.includes(i) && ansFields.push(i))
  }
  paramList._sourceIncludes = ansFields.join(',')

  if (key['Include-Distributor-Name']) {
    paramList.include_distributor_name = key['Include-Distributor-Name']
  } else if (key['Exclude-Distributor-Name']) {
    paramList.exclude_distributor_name = key['Exclude-Distributor-Name']
  } else if (key['Include-Distributor-Category']) {
    paramList.include_distributor_category = key['Include-Distributor-Category']
  } else if (key['Exclude-Distributor-Category']) {
    paramList.exclude_distributor_category = key['Exclude-Distributor-Category']
  }

  // basic ES query
  const body = {
    query: {
      bool: {
        must: [],
      },
    },
  }

  // If feedDefaultQuery is set try to use it
  let feedQuery
  const { feedDefaultQuery } = getProperties(key['arc-site'])
  if (feedDefaultQuery) {
    try {
      feedQuery = JSON.parse(feedDefaultQuery)
      feedQuery = feedQuery.filter((term) => !term.range)
    } catch (error) {
      console.warn(`Failed to parse feedDefaultQuery: ${feedDefaultQuery}`)
    }
  }

  // process the must query terms passed as json string
  // if nothing passed or not valid json use [{"term": {"type":"story"}}, {"term": {"revision.published":true}}]
  if (key['Include-Terms']) {
    try {
      feedQuery = JSON.parse(key['Include-Terms'])
    } catch (error) {
      const err = new Error('Invalid Include-Terms')
      err.statusCode = 500
      throw err
    }
  }

  // default query
  if (!feedQuery) {
    feedQuery = [{ term: { type: 'story' } }]
  }

  body.query.bool.must = feedQuery

  // process the not query terms passed as object
  const excludeTerms = key['Exclude-Terms']
  if (excludeTerms) {
    try {
      body.query.bool.must_not = JSON.parse(excludeTerms)
    } catch (error) {
      const err = new Error('Invalid Exclude-Terms')
      err.statusCode = 500
      throw err
    }
  }

  // Validate and append date field to basic query
  let { dateField, dateRange } = key
  if (!dateField || !dateRange) {
    const err = new Error('Date is required')
    err.statusCode = 500
    throw err
  }
  if (validANSDates.indexOf(dateField) === -1) {
    const err = new Error('Invalid Date field')
    err.statusCode = 500
    throw err
  }
  // if dateRange end in an extra -d like 2020-01-01-5 use it as (offset -1) * 1000
  // and only return 1000 results. This is for days with over 1000 results
  let rangeStart, rangeEnd, rangeFrom
  dateRange = dateRange.replace(/\/$/, '')
  if (dateRange.startsWith('latest')) {
    const matcher = dateRange.match(/latest-(\d*)/)
    if (matcher) {
      rangeFrom = parseInt(matcher[1])
      paramList.from = (rangeFrom - 1) * 1000
    }
    rangeEnd = 'now'
    rangeStart = moment.utc().format('YYYY-MM-DD')
  } else {
    const matcher = dateRange.match(/\d{4}-\d{2}-\d{2}-(\d*)/)
    if (matcher) {
      rangeFrom = parseInt(matcher[1])
      paramList.from = (rangeFrom - 1) * 1000
      dateRange = dateRange.slice(0, 10)
    }
    try {
      const validDate = moment(dateRange, 'YYYY-MM-DD', true)
      if (
        validDate > moment.utc().add(2, 'days') ||
        validDate < moment('1990')
      ) {
        const err = new Error(
          'Invalid Date range, must be after 1990 and not in the future',
        )
        err.statusCode = 500
        throw err
      }
    } catch (error) {
      const err = new Error('Invalid Date, must be in YYYY-MM-DD format')
      err.statusCode = 500
      throw err
    }
    rangeEnd = rangeStart = dateRange
  }

  body.query.bool.must.push({
    range: {
      [dateField]: { gte: rangeStart, lte: rangeEnd },
    },
  })

  const ExcludeSections = key['Exclude-Sections']

  if (ExcludeSections && ExcludeSections !== '/') {
    const formatSections = (section) => {
      const sectionArray = section
        .split(',')
        .map((item) => item.trim().replace(/\/$/, ''))
        .map((item) => (item.startsWith('/') ? item : `/${item}`))
      return {
        terms: {
          'taxonomy.sections._id': sectionArray,
        },
      }
    }

    const nested = {
      nested: {
        path: 'taxonomy.sections',
        query: {
          bool: {
            must: [formatSections(ExcludeSections)],
          },
        },
      },
    }

    if (!body.query.bool.must_not) body.query.bool.must_not = []
    body.query.bool.must_not.push(nested)
  }

  paramList.body = encodeURI(JSON.stringify(body))

  const genParams = (paramList) => {
    return Object.keys(paramList).reduce((acc, key) => {
      return [...acc, `${key}=${paramList[key]}`]
    }, [])
  }

  const getResp = (contentURL, paramList, options) => {
    const paramString = genParams(paramList)
    return request({
      uri: `${contentURL}?${paramString.join('&')}`,
      ...options,
    })
  }

  let allContentElements = []
  while (true) {
    const scanResp = await getResp(contentURL, paramList, options)

    allContentElements = allContentElements.concat(scanResp.content_elements)
    if (
      allContentElements.length >= scanResp.count ||
      (rangeFrom && allContentElements.length >= 1000)
    )
      break
    if (!scanResp.next) break
    paramList.from = scanResp.next
  }
  return { type: 'resp', content_elements: allContentElements }
}

const transform = (data, query) => {
  const source = data || {}
  const website = query['arc-site']
  if (source.content_elements && source.content_elements.length) {
    const transformedContent = source.content_elements.map((i) => {
      if (i?.websites?.[website]?.website_section && !i?.taxonomy?.sections) {
        if (!i.taxonomy) i.taxonomy = {}
        i.taxonomy.sections = [i.websites[website].website_section]
      }
      if (i?.websites?.[website]?.website_url)
        i.website_url = i.websites[website].website_url
      i.website = website
      return i
    })
    source.content_elements = transformedContent
    return source
  }
}

export default {
  fetch,
  schemaName: 'feeds',
  transform,
  params: [
    {
      name: 'dateField',
      displayName: 'ANS Date Field',
      type: 'text',
    },
    {
      name: 'dateRange',
      displayName: 'Date',
      type: 'text',
    },
    {
      name: 'Include-Terms',
      displayName: 'Include Terms',
      type: 'text',
    },
    {
      name: 'Exclude-Terms',
      displayName: 'Exclude Terms',
      type: 'text',
    },
    {
      name: 'Exclude-Sections',
      displayName: 'Exclude Sections',
      type: 'text',
    },
    {
      name: 'sort',
      displayName: 'Feed Sort',
      type: 'text',
    },
    {
      name: 'Source-Include',
      displayName: 'Source Include (list of ANS fields comma separated)',
      type: 'text',
    },
    {
      name: 'Source-Exclude',
      displayName: 'Source Exclude (list of ANS fields comma separated)',
      type: 'text',
    },
    {
      name: 'Include-Distributor-Name',
      displayName: 'Include Distributor Name',
      type: 'text',
    },
    {
      name: 'Exclude-Distributor-Name',
      displayName: 'Exclude Distributor Name',
      type: 'text',
    },
    {
      name: 'Include-Distributor-Category',
      displayName: 'Include Distributor Category',
      type: 'text',
    },
    {
      name: 'Exclude-Distributor-Category',
      displayName: 'Exclude Distributor Category',
      type: 'text',
    },
  ],
  ttl: 3600,
}
