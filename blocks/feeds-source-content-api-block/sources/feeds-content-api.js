import { CONTENT_BASE } from 'fusion:environment'
import getProperties from 'fusion:properties'

const resolve = function resolve(key) {
  const requestUri = `${CONTENT_BASE}/content/v4/search/published`
  const ansFields = [
    'canonical_url',
    'canonical_website',
    'content_elements',
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

  const paramList = [
    `website=${key['arc-site']}`,
    `size=${key['Feed-Size'] || '100'}`,
    `from=${key['Feed-Offset'] || '0'}`,
    `sort=${key.Sort || 'publish_date:desc'}`,
  ]

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
      paramList.push(`_sourceExcludes=${sourceExcludes.join(',')}`)
  }

  if (key['Source-Include']) {
    key['Source-Include']
      .split(',')
      .forEach((i) => i && !ansFields.includes(i) && ansFields.push(i))
  }
  paramList.push(`_sourceIncludes=${ansFields.join(',')}`)

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
    feedQuery = [
      { term: { type: 'story' } },
      { range: { last_updated_date: { gte: 'now-2d', lte: 'now' } } },
    ]
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

  // Append Author to basic query
  const { Author } = key
  if (Author) {
    const author = Author.replace(/\//g, '')

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
    const keywords = Keywords.replace(/\//g, '').replace(/%20/g, '+')

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
    const cleanTagsText = tagsText.replace(/\//g, '').replace(/%20/g, '+')

    body.query.bool.must.push({
      terms: {
        'taxonomy.tags.text.raw': cleanTagsText.split(','),
      },
    })
  }

  // Append Tags slug to basic query
  const tagsSlug = key['Tags-Slug']
  if (tagsSlug) {
    const cleanTagsSlug = tagsSlug.replace(/\//g, '')

    body.query.bool.must.push({
      terms: {
        'taxonomy.tags.slug': cleanTagsSlug.split(','),
      },
    })
  }

  // if Section and/or Exclude-Sections append section query to basic query
  const { Section } = key
  const ExcludeSections = key['Exclude-Sections']

  if (Section || ExcludeSections) {
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
            must: [
              {
                term: {
                  'taxonomy.sections._website': key['arc-site'],
                },
              },
            ],
          },
        },
      },
    }

    const mustNested = JSON.parse(JSON.stringify(nested))

    if (Section && Section !== '/') {
      mustNested.nested.query.bool.must.push(formatSections(Section))
    }
    body.query.bool.must.push(mustNested)

    if (ExcludeSections && ExcludeSections !== '/') {
      const notNested = JSON.parse(JSON.stringify(nested))
      notNested.nested.query.bool.must = [formatSections(ExcludeSections)]
      if (!body.query.bool.must_not) body.query.bool.must_not = []
      body.query.bool.must_not.push(notNested)
    }
  }

  const encodedBody = encodeURI(JSON.stringify(body))
  return `${requestUri}?body=${encodedBody}&${uriParams}`
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
  resolve,
  schemaName: 'feeds',
  transform,
  params: {
    Section: 'text',
    Author: 'text',
    Keywords: 'text',
    'Tags-Text': 'text',
    'Tags-Slug': 'text',
    'Include-Terms': 'text',
    'Exclude-Terms': 'text',
    'Exclude-Sections': 'text',
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
