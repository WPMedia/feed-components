import request from 'request-promise-native'
import { CONTENT_BASE, ARC_ACCESS_TOKEN } from 'fusion:environment'

const params = {
  _id: 'text',
  content_alias: 'text',
  from: 'text',
  size: 'text',
  includedFields: 'text',
  ttl: 'number',
}

const options = {
  gzip: true,
  json: true,
  auth: { bearer: ARC_ACCESS_TOKEN },
}

const fetch = (key = {}) => {
  const {
    'arc-site': site,
    _id,
    contentAlias,
    from,
    size,
    includedFields,
  } = key

  const qs = {
    website: site,
    from: from || 0,
    size: size || 20,
    published: true,
  }
  _id ? (qs._id = _id) : (qs.content_alias = contentAlias)

  return request({
    uri: `${CONTENT_BASE}/content/v4/collections`,
    qs: qs,
    ...options,
  })
    .then((collectionResp) => {
      const ids = collectionResp.content_elements
        .map((item) => {
          return item._id
        })
        .join(',')

      // ids results does not include content_elements unless specified in included_fields
      const idsIncludedFields =
        includedFields ||
        [
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
          'subheadlines',
          'taxonomy',
          'website_url',
        ].join(',')

      return request({
        uri: `${CONTENT_BASE}/content/v4/ids`,
        qs: {
          ids: ids,
          website: site,
          included_fields: idsIncludedFields,
        },
        ...options,
      })
    })
    .catch((err) => {
      throw err
    })
}

export default {
  fetch,
  params,
  ttl: 300,
}
