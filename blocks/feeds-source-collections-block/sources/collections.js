import request from 'request-promise-native'
import { CONTENT_BASE, ARC_ACCESS_TOKEN } from 'fusion:environment'

const options = {
  gzip: true,
  json: true,
  auth: { bearer: ARC_ACCESS_TOKEN },
}

const defaultIncludedFields = [
  'content_elements',
  'created_date',
  'credits',
  'description',
  'display_date',
  'first_publish_date',
  'headlines',
  'last_updated_date',
  'promo_items',
  'publish_date',
  'source',
  'subheadlines',
  'taxonomy',
  'website_url',
].join(',')

const sortStories = (idsResp, collectionResp, ids) => {
  idsResp.content_elements.forEach((item) => {
    const storyIndex = ids.indexOf(item._id)
    collectionResp.content_elements.splice(storyIndex, 1, item)
  })
  return collectionResp
}

const fetch = async (key = {}) => {
  const {
    'arc-site': site,
    _id,
    content_alias: contentAlias,
    from,
    size,
    included_fields: includedFields,
  } = key
  const id = _id.replace(/\//g, '')
  const qs = {
    website: site,
    from: from || 0,
    size: size || 20,
    published: true,
    ...(id && { _id: id }),
    ...(contentAlias && { content_alias: contentAlias }),
  }

  // ids results does not include content_elements unless specified in included_fields
  const idsIncludedFields = includedFields || defaultIncludedFields

  const collectionResp = await request({
    uri: `${CONTENT_BASE}/content/v4/collections`,
    qs: qs,
    ...options,
  })
  const ids = await collectionResp.content_elements.map((item) => {
    return item._id
  })
  const idsResp = await request({
    uri: `${CONTENT_BASE}/content/v4/ids`,
    qs: {
      ids: ids.join(','),
      website: site,
      included_fields: idsIncludedFields,
    },
    ...options,
  })
  return await sortStories(idsResp, collectionResp, ids)
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
      name: 'include_fields',
      displayName: 'ANS Fields to include, use commas between fields',
      type: 'text',
    },
  ],
  ttl: 300,
}
