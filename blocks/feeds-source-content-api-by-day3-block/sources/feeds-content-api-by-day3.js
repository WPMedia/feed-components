import axios from 'axios'
import moment from 'moment'

import {
  ARC_ACCESS_TOKEN,
  CONTENT_BASE,
  RESIZER_TOKEN_VERSION,
  resizerKey,
} from 'fusion:environment'
import getProperties from 'fusion:properties'

import { signImagesInANSObject, resizerFetch } from '@wpmedia/feeds-resizer'
import {
  defaultANSFields,
  formatSections,
  generateDistributor,
  transform,
  validANSDates,
} from '@wpmedia/feeds-content-source-utils'

const options = {
  headers: {
    'content-type': 'application/json',
    Authorization: `Bearer ${ARC_ACCESS_TOKEN}`,
  },
  method: 'GET',
}

const fetch = async (key, { cachedCall }) => {
  const paramList = {
    website: key['arc-site'],
    size: 100,
    sort: key.sort || `${key.dateField}:desc`,
  }
  generateDistributor(key, paramList)

  // limit C-API response to just this websites sections to reduce size
  const ansFields = [...defaultANSFields, `websites.${key['arc-site']}`]

  if (key['Source-Exclude']) {
    const sourceExclude = []
    key['Source-Exclude'].split(',').forEach((i) => {
      if (i && ansFields.indexOf(i) !== -1) {
        ansFields.splice(ansFields.indexOf(i), 1)
      } else {
        i && sourceExclude.push(i)
      }
    })
    if (sourceExclude.length) paramList._sourceExclude = sourceExclude.join(',')
  }

  if (key['Source-Include']) {
    key['Source-Include']
      .split(',')
      .forEach((i) => i && !ansFields.includes(i) && ansFields.push(i))
  }
  paramList._sourceInclude = ansFields.join(',')

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

  paramList.body = JSON.stringify(body)

  let allContentElements = []
  while (true) {
    const scanResp = await axios({
      url: `${CONTENT_BASE}/content/v4/search/published/?${new URLSearchParams(paramList).toString()}`,
      ...options,
    })
      .then((result) => {
        if (resizerKey) {
          return result
        }
        return signImagesInANSObject(
          cachedCall,
          resizerFetch,
          RESIZER_TOKEN_VERSION,
        )(result)
      })
      .then(({ data, ...rest }) => ({ ...rest, data: transform(data, key) }))
      .then(({ data }) => data)
      .catch((error) => console.log('== error ==', error))

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

export default {
  fetch,
  schemaName: 'feeds',
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
  ttl: 86400,
}
