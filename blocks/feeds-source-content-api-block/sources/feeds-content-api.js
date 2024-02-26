import axios from 'axios'
import {
  ARC_ACCESS_TOKEN,
  CONTENT_BASE,
  RESIZER_TOKEN_VERSION,
  resizerKey,
} from 'fusion:environment'
import getProperties from 'fusion:properties'
import {
  defaultANSFields,
  formatSections,
  generateDistributor,
  genParams,
  transform,
} from '@wpmedia/feeds-content-source-utils'
import { signImagesInANSObject, resizerFetch } from '@wpmedia/feeds-resizer'


const fetch = (key, { cachedCall }) => {
  const requestUri = `${CONTENT_BASE}/content/v4/search/published`
  const ansFields = [
    ...defaultANSFields,
    'content_elements',
    `websites.${key['arc-site']}`,
  ]
  // resolvers only support text or number, turn into bool.
  const sitemapAtRoot =
    key['Sitemap-at-root'] && key['Sitemap-at-root'].toLowerCase() !== 'false'

  const paramList = {
    website: key['arc-site'],
    size: key['Feed-Size'] || '100',
    from: key['Feed-Offset'] || '0',
    sort: key.Sort || 'publish_date:desc',
  }
  generateDistributor(key, paramList)

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
      const err = new Error('Invalid Include-Terms')
      err.statusCode = 500
      throw err
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
      const err = new Error('Invalid Exclude-Terms')
      err.statusCode = 500
      throw err
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
  const Section =
    key.Section && sitemapAtRoot ? key.Section.replace(/-/g, '/') : key.Section
  const ExcludeSections = key['Exclude-Sections']

  if (Section || ExcludeSections) {
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

  const ret = axios({
    url: `${requestUri}?body=${encodedBody}&${genParams(paramList)}`,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${ARC_ACCESS_TOKEN}`,
    },
    method: 'GET',
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
    .then(({data, ...rest}) => ({ ...rest, data: transform(data, key), }))
    .then(({ data }) => data)
    .catch((error) => console.log('== error ==', error))

  return ret
}

export default {
  fetch,
  schemaName: 'feeds',
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
    'Sitemap-at-root': 'text',
    'Include-Distributor-Name': 'text',
    'Exclude-Distributor-Name': 'text',
    'Include-Distributor-Category': 'text',
    'Exclude-Distributor-Category': 'text',
  },
  ttl: 300,
}
