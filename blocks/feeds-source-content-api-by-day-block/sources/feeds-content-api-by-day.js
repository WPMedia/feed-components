import { CONTENT_BASE } from 'fusion:environment'
import getProperties from 'fusion:properties'
import moment from 'moment'

const resolve = function resolve(key) {
  const requestUri = `${CONTENT_BASE}/content/v4/search/published`
  const paramList = [
    `website=${key['arc-site']}`,
    `size=${key['Feed-Size'] || '100'}`,
    `from=${key['Feed-Offset'] || '0'}`,
    `_sourceExclude=${key['Source-Exclude'] || 'related_content'}`,
    `sort=${key.Sort || 'publish_date:desc'}`,
  ]

  if (key['Source-Include'])
    paramList.push(`_sourceInclude=${key['Source-Include']}`)
  if (key['Include-Distributor-Name']) {
    paramList.push(
      `include_distributor_name=${key['Include-Distributor-Name']}`,
    )
  } else if (key['Exclude-Distributor-Name']) {
    paramList.push(
      `exclude_distributor_name=${key['Exclude-Distributor-Name']}`,
    )
  } else if (key['Include-Distributor-Category']) {
    paramList.push(
      `include_distributor_category=${key['Include-Distributor-Category']}`,
    )
  } else if (key['Exclude-Distributor-Category']) {
    paramList.push(
      `exclude_distributor_category=${key['Exclude-Distributor-Category']}`,
    )
  }

  const uriParams = paramList.join('&')

  const { feedDefaultQuery } = getProperties(key['arc-site'])

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
      console.warn(`Failed to parse Include-Terms: ${key['Include-Terms']}`)
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
      console.warn(`Failed to parse Exclude-Terms: ${key['Exclude-Terms']}`)
    }
  }

  // Append date field to basic query
  const { dateField, dateRange } = key
  if (dateField && dateRange) {
    let rangeStart, rangeEnd
    if (dateRange === 'latest') {
      rangeEnd = 'now'
      rangeStart = moment.utc().subtract(1, 'days').format('YYYY-MM-DD')
    } else {
      rangeEnd = rangeStart = dateRange
    }

    body.query.bool.must.push({
      range: {
        [dateField]: { gte: rangeStart, lte: rangeEnd },
      },
    })
  }

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

  console.log(JSON.stringify(body))
  const encodedBody = encodeURI(JSON.stringify(body))
  return `${requestUri}?body=${encodedBody}&${uriParams}`
}

export default {
  resolve,
  schemaName: 'feeds',
  params: {
    dateField: 'text',
    dateRange: 'text',
    Section: 'text',
    Author: 'text',
    Keywords: 'text',
    'Tags-Text': 'text',
    'Tags-Slug': 'text',
    'Include-Terms': 'text',
    'Exclude-Terms': 'text',
    'Feed-Size': 'text',
    'Feed-Offset': 'text',
    Sort: 'text',
    'Source-Exclude': 'text',
    'Source-Include': 'text',
    'Include-Distributor-Name': 'text',
    'Exclude-Distributor-Name': 'text',
    'Include-Distributor-Category': 'text',
    'Exclude-Distributor-Category': 'text',
  },
  ttl: 300,
}
