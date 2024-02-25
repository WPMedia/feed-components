import axios from 'axios'

import {
  ARC_ACCESS_TOKEN,
  CONTENT_BASE,
  RESIZER_TOKEN_VERSION,
  resizerKey,
} from 'fusion:environment'

import { signImagesInANSObject } from '@wpmedia/feeds-resizer'
import { defaultANSFields } from '@wpmedia/feeds-content-source-utils'
import { fetch as resizerFetch } from '@wpmedia/signing-service-content-source-block'

const sortStories = (idsResp, collectionResp, ids, site) => {
  idsResp.content_elements.forEach((item) => {
    const storyIndex = ids.indexOf(item._id)
    // transform websites to sections
    if (item?.websites?.[site]?.website_section && !item?.taxonomy?.sections) {
      if (!item.taxonomy) item.taxonomy = {}
      item.taxonomy.sections = [item.websites[site].website_section]
    }
    if (item?.websites?.[site]?.website_url)
      item.website_url = item.websites[site].website_url
    item.website = site
    collectionResp.content_elements.splice(storyIndex, 1, item)
  })
  return collectionResp
}

const fetch = async (key, { cachedCall }) => {
  const {
    'arc-site': site,
    _id,
    content_alias: contentAlias,
    from = 0,
    size = 20,
    includeFields,
    excludeFields,
  } = key

  const collectionsQuery = new URLSearchParams({
    website: site,
    from,
    size,
    published: true,
    ...(_id && { _id: _id.replace(/\//g, '') }),
    ...(contentAlias && { content_alias: contentAlias.replace(/\/$/, '') }),
  })

  const options = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${ARC_ACCESS_TOKEN}`,
    },
    method: 'GET',
  }

  const collectionResp = await axios({
    url: `${CONTENT_BASE}/content/v4/collections?${collectionsQuery.toString()}`,
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
    .then(({ data }) => data)
    .catch((error) => console.log('== error ==', error))

  const ids = await collectionResp.content_elements.map((item) => {
    return item._id
  })

  const ansFields = [
    ...defaultANSFields,
    'content_elements',
    `websites.${site}`,
  ]

  if (excludeFields) {
    excludeFields.split(',').forEach((i) => {
      if (i && ansFields.indexOf(i) !== -1) {
        ansFields.splice(ansFields.indexOf(i), 1)
      }
    })
  }

  if (includeFields) {
    includeFields
      .split(',')
      .forEach((i) => i && !ansFields.includes(i) && ansFields.push(i))
  }
  // If excluding content_elements, don't call the IDS endpoint
  if (!ansFields.includes('content_elements') || ids.length === 0)
    return collectionResp

  const idsQuery = new URLSearchParams({
    ids: ids.join(','),
    website: site,
    included_fields: ansFields.join(','),
  })
  const idsResp = await axios({
    url: `${CONTENT_BASE}/content/v4/ids?${idsQuery.toString()}`,
    ...options,
  })
    .then(({ data }) => data)
    .catch((error) => console.log('== error ==', error))
  return await sortStories(idsResp, collectionResp, ids, site)
}

export default {
  fetch,
  params: [
    {
      name: '_id',
      displayName: 'Collection ID',
      type: 'text',
    },
    {
      name: 'content_alias',
      displayName: 'Collection Alias (Only populate ID or Alias)',
      type: 'text',
    },
    {
      name: 'from',
      displayName: 'From - Integer offset to start from',
      type: 'number',
    },
    {
      name: 'size',
      displayName: 'Number of records to return, Integer 1 - 20',
      type: 'number',
    },
    {
      name: 'includeFields',
      displayName: 'ANS Fields to include, use commas between fields',
      type: 'text',
    },
    {
      name: 'excludeFields',
      displayName: 'ANS Fields to Exclude, use commas between fields',
      type: 'text',
    },
  ],
  ttl: 300,
}
