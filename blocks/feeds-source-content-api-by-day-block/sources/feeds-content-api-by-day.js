import request from 'request-promise-native'
import { CONTENT_BASE, ARC_ACCESS_TOKEN } from 'fusion:environment'
import getProperties from 'fusion:properties'
import moment from 'moment'

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
    size: key['Feed-Size'] || '100',
    from: key['Feed-Offset'] || '0',
    _sourceExclude: key['Source-Exclude'] || 'related_content',
  }

  if (key['Source-Include']) paramList._sourceInclude = key['Source-Include']

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
    feedQuery = [
      { term: { type: 'story' } },
      { term: { 'revision.published': true } },
    ]
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
  const { dateField, dateRange } = key
  if (!dateField || !dateRange) {
    const err = new Error('Date is required')
    err.statusCode = 500
    throw err
  }
  if (validANSDates.indexOf(dateField) < 0) {
    const err = new Error('Invalid Date field')
    err.statusCode = 500
    throw err
  }
  let rangeStart, rangeEnd
  if (dateRange === 'latest') {
    rangeEnd = 'now'
    rangeStart = moment.utc().subtract(1, 'days').format('YYYY-MM-DD')
  } else {
    try {
      const validDate = moment(dateRange, 'YYYY-MM-DD', true)
      if (
        validDate > moment.utc().add(2, 'days') ||
        validDate < moment('2000')
      ) {
        const err = new Error(
          'Invalid Date range, must be after 2000 and not in the future',
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

  // Append Author to basic query
  const { Author } = key
  if (Author) {
    const author = Author.replace(/^\//, '')

    body.query.bool.must.push({
      term: {
        'credits.by._id': author,
      },
    })
  }

  // Append Keywords to basic query
  // AIO-243 use simple_query_string to support multiple phrases using "phrase 1" | "phrase 2"
  const { Keywords } = key
  if (Keywords) {
    const keywords = Keywords.replace(/^\//, '').replace(/%20/g, '+')

    body.query.bool.must.push({
      simple_query_string: {
        query: `"${keywords.split(',').join('" | "')}"`,
        fields: ['taxonomy.seo_keywords'],
      },
    })
  }

  // Append Tags text to basic query
  const tagsText = key['Tags-Text']
  if (tagsText) {
    const cleanTagsText = tagsText.replace(/^\//, '').replace(/%20/g, '+')

    body.query.bool.must.push({
      terms: {
        'taxonomy.tags.text.raw': cleanTagsText.split(','),
      },
    })
  }

  // Append Tags slug to basic query
  const tagsSlug = key['Tags-Slug']
  if (tagsSlug) {
    const cleanTagsSlug = tagsSlug.replace(/^\//, '')

    body.query.bool.must.push({
      terms: {
        'taxonomy.tags.slug': cleanTagsSlug.split(','),
      },
    })
  }

  // if Section append section query to basic query
  const { Section } = key
  if (Section && Section !== '/') {
    let section = Section.replace(/\/$/, '')
    if (!section.startsWith('/')) {
      section = `/${section}`
    }

    body.query.bool.must.push({
      nested: {
        path: 'taxonomy.sections',
        query: {
          bool: {
            must: [
              {
                term: {
                  'taxonomy.sections._id': `${section}`,
                },
              },
            ],
          },
        },
      },
    })
  }

  paramList.body = encodeURI(JSON.stringify(body))
  const paramString = Object.keys(paramList).reduce((acc, key) => {
    return [...acc, `${key}=${paramList[key]}`]
  }, [])

  console.log(`${CONTENT_BASE}/content/v4/scan?${paramString.join('&')}`)

  const scanResp = await request({
    uri: `${CONTENT_BASE}/content/v4/scan?${paramString.join('&')}`,
    ...options,
  })

  console.log(scanResp)
  return scanResp
}

export default {
  fetch,
  schemaName: 'feeds',
  params: [
    {
      name: 'dateField',
      displayName: 'Date Field',
      type: 'text',
    },
    {
      name: 'dateRange',
      displayName: 'Date Range',
      type: 'text',
    },
    {
      name: 'Section',
      displayName: 'Section Name',
      type: 'text',
    },
    {
      name: 'Author',
      displayName: 'Author Name',
      type: 'text',
    },
    {
      name: 'Keywords',
      displayName: 'Keywords',
      type: 'text',
    },
    {
      name: 'Tags-Text',
      displayName: 'Tags Text',
      type: 'text',
    },
    {
      name: 'Tags-Slug',
      displayName: 'Tags Slug',
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
      name: 'Feed-Size',
      displayName: 'Feed Size',
      type: 'text',
    },
    {
      name: 'Feed-Offset',
      displayName: 'Feed Offset',
      type: 'text',
    },
    {
      name: 'Source-Exclude',
      displayName: 'Source Exclude (list off ANS fields comma separated)',
      type: 'text',
    },
    {
      name: 'Source-Include',
      displayName: 'Source Include (list of ANS fields comma separated)',
      type: 'text',
    },
  ],
  ttl: 300,
}
