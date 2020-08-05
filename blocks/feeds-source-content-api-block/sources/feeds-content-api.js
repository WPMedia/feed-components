import { CONTENT_BASE } from 'fusion:environment'

const resolve = function resolve(key) {
  const requestUri = `${CONTENT_BASE}/content/v4/search/published`
  const uriParams = [
    `website=${key['arc-site']}`,
    `size=${key['Feed-Size'] || '100'}`,
    `from=${key['Feed-Offset'] || '0'}`,
    `_sourceExclude=${key['Source-Exclude'] || 'related_content'}`,
    `sort=${key.Sort || 'publish_date:desc'}`,
  ].join('&')

  // basic ES query
  const body = {
    query: {
      bool: {
        must: [],
      },
    },
  }

  // process the must query terms passed as json string
  // if nothing passed or not valid json use [{"term": {"type":"story"}}, {"term": {"revision.published":true}}]
  let feedQuery
  if (key['Include-Terms']) {
    try {
      feedQuery = JSON.parse(key['Include-Terms'])
    } catch (error) {
      console.log(`Failed to parse Include-Terms: ${key['Include-Terms']}`)
    }
  }

  // default query
  if (!feedQuery) {
    feedQuery = [
      {
        term: { type: 'story' },
      },
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
      console.log(`Failed to parse Exclude-Terms: ${key['Exclude-Terms']}`)
    }
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
  const { Keywords } = key
  if (Keywords) {
    const keywords = Keywords.replace(/^\//, '')

    body.query.bool.must.push({
      match_phrase: {
        'taxonomy.seo_keywords': keywords,
      },
    })
  }

  // Append Tags text to basic query
  const tagsText = key['Tags-Text']
  if (tagsText) {
    const cleanTagsText = tagsText.replace(/^\//, '')

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

  const encodedBody = encodeURI(JSON.stringify(body))
  return `${requestUri}?body=${encodedBody}&${uriParams}`
}

export default {
  resolve,
  schemaName: 'feeds',
  params: {
    Section: 'text',
    Author: 'text',
    Keywords: 'text',
    'Tags-Text': 'text',
    'Tags-Slug': 'text',
    'Include-Terms': 'text',
    'Exclude-Terms': 'text',
    'Feed-Size': 'text',
    'Feed-Offset': 'text',
    'Source-Exclude': 'text',
    Sort: 'text',
  },
}
