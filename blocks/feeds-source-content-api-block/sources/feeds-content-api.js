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
} from '@wpmedia/feeds-content-source-utils'
import signImagesInANSObject from '@wpmedia/arc-themes-components/src/utils/sign-images-in-ans-object'
import { fetch as resizerFetch } from '@wpmedia/signing-service-content-source-block'

const generateDistributor = ({
  'Include-Distributor-Name': include_distributor_name,
  'Exclude-Distributor-Name': exclude_distributor_name,
  'Include-Distributor-Category': include_distributor_category,
  'Exclude-Distributor-Category': exclude_distributor_category,
}) => {
  if (include_distributor_name) {
    return { include_distributor_name }
  } else if (exclude_distributor_name) {
    return { exclude_distributor_name }
  } else if (include_distributor_category) {
    return { include_distributor_category }
  } else if (exclude_distributor_category) {
    return { exclude_distributor_category }
  }
  return {}
}

const fetch = (key, { cachedCall }) => {
  const {
    'arc-site': website,
    Author: author,
    'Exclude-Sections': excludeSections,
    'Exclude-Terms': excludeTerms,
    'Feed-Offset': from = '0',
    'Feed-Size': size = 100,
    'Include-Terms': includeTerms,
    Keywords: keywords,
    Section: section,
    'Sitemap-at-root': sitemapAtRoot = 'false',
    Sort: sort = 'publish_date:desc',
    'Source-Exclude': sourceExclude,
    'Source-Include': sourceInclude,
    'Tags-Slug': tagsSlug,
    'Tags-Text': tagsText,
  } = key

  const sourceExcludes = []
  const hasSitemapAtRoot = sitemapAtRoot.toLowerCase() !== 'false'
  const ansFields = [
    ...defaultANSFields,
    'content_elements',
    `websites.${website}`,
  ]

  if (sourceExclude) {
    sourceExclude.split(',').forEach((i) => {
      if (i) {
        if (ansFields.indexOf(i) !== -1) {
          ansFields.splice(ansFields.indexOf(i), 1)
        } else {
          sourceExcludes.push(i)
        }
      }
    })
    if (sourceExcludes?.length)
      paramList._sourceExclude = sourceExcludes.join(',')
  }

  if (sourceInclude) {
    sourceInclude
      .split(',')
      .forEach((i) => i && !ansFields.includes(i) && ansFields.push(i))
  }

  let feedQuery = []
  const { feedDefaultQuery } = getProperties(website)

  // If feedDefaultQuery is set try to use it
  if (feedDefaultQuery) {
    try {
      feedQuery = JSON.parse(feedDefaultQuery)
    } catch (error) {
      console.warn(`Failed to parse feedDefaultQuery: ${feedDefaultQuery}`)
    }
  }
  // process the must query terms passed as json string
  // if nothing passed or not valid json use [{"term": {"type":"story"}}, {"term": {"revision.published":true}}]
  if (includeTerms) {
    try {
      feedQuery = JSON.parse(includeTerms)
    } catch (error) {
      console.warn(`Failed to parse Include-Terms: ${includeTerms}`)
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

  const body = {
    query: {
      bool: {
        must: feedQuery,
      },
    },
  }

  // process the not query terms passed as object
  if (excludeTerms) {
    try {
      body.query.bool.must_not = JSON.parse(excludeTerms)
    } catch (error) {
      console.warn(`Failed to parse Exclude-Terms: ${excludeTerms}`)
      const err = new Error('Invalid Exclude-Terms')
      err.statusCode = 500
      throw err
    }
  }
  // Append Author to basic query
  if (author) {
    body.query.bool.must.push({
      term: {
        'credits.by._id': author.replace(/\//g, ''),
      },
    })
  }

  // Append Keywords to basic query
  // AIO-243 use simple_query_string to support multiple phrases using "phrase 1" | "phrase 2"
  if (keywords) {
    body.query.bool.must.push({
      simple_query_string: {
        query: `"${keywords
          .replace(/\//g, '')
          .replace(/%20/g, '+')
          .split(',')
          .join('" | "')}"`,
        fields: ['taxonomy.seo_keywords'],
      },
    })
  }

  // Append Tags text to basic query
  if (tagsText) {
    body.query.bool.must.push({
      terms: {
        'taxonomy.tags.text.raw': tagsText
          .replace(/\//g, '')
          .replace(/%20/g, '+')
          .split(','),
      },
    })
  }

  // Append Tags slug to basic query
  if (tagsSlug) {
    body.query.bool.must.push({
      terms: {
        'taxonomy.tags.slug': tagsSlug.replace(/\//g, '').split(','),
      },
    })
  }

  // if Section and/or Exclude-Sections append section query to basic query
  const cleanSection =
    section && hasSitemapAtRoot ? section.replace(/-/g, '/') : section

  if (cleanSection || excludeSections) {
    const nested = {
      nested: {
        path: 'taxonomy.sections',
        query: {
          bool: {
            must: [
              {
                term: {
                  'taxonomy.sections._website': website,
                },
              },
            ],
          },
        },
      },
    }

    const mustNested = JSON.parse(JSON.stringify(nested))

    if (cleanSection && cleanSection !== '/') {
      mustNested.nested.query.bool.must.push(formatSections(cleanSection))
    }
    body.query.bool.must.push(mustNested)

    if (excludeSections && excludeSections !== '/') {
      const notNested = JSON.parse(JSON.stringify(nested))
      notNested.nested.query.bool.must = [formatSections(excludeSections)]
      if (!body.query.bool.must_not) body.query.bool.must_not = []
      body.query.bool.must_not.push(notNested)
    }
  }

  const urlSearch = new URLSearchParams({
    body: JSON.stringify(body),
    from,
    size,
    sort,
    website,
    ...generateDistributor(key),
    ...(sourceExcludes?.length
      ? { _sourceExclude: sourceExcludes.join(',') }
      : {}),
    _sourceInclude: ansFields.join(','),
  })

  const ret = axios({
    url: `${CONTENT_BASE}/content/v4/search/published?${urlSearch.toString()}`,
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
    .then(({ data }) => data)
    .catch((error) => console.log('== error ==', error))

  return ret
}

export default {
  fetch,
  schemaName: 'feeds',
  params: {
    Author: 'text',
    'Exclude-Distributor-Category': 'text',
    'Exclude-Distributor-Name': 'text',
    'Exclude-Sections': 'text',
    'Exclude-Terms': 'text',
    'Feed-Offset': 'text',
    'Feed-Size': 'text',
    'Include-Distributor-Category': 'text',
    'Include-Distributor-Name': 'text',
    'Include-Terms': 'text',
    Keywords: 'text',
    Section: 'text',
    'Sitemap-at-root': 'text',
    Sort: 'text',
    'Source-Exclude': 'text',
    'Source-Include': 'text',
    'Tags-Slug': 'text',
    'Tags-Text': 'text',
  },
  ttl: 300,
}
