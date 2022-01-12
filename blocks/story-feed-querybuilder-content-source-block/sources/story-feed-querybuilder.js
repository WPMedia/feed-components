import getResizedImageData from '@wpmedia/resizer-image-block'

export default {
  resolve: (params) => {
    const paramList = [
      ...(params.queryParams || '').split(','),
      `website=${params['arc-site']}`,
    ]
    return `/content/v4/search/published?body=${encodeURI(
      params.queryBody,
    )}&${paramList.join('&')}`
  },
  schemaName: 'ans-feed',
  queryBuilder: true,
  params: {
    queryName: 'text',
    queryBody: 'text',
    queryParams: 'text',
    arcQL: 'text',
  },
  transform: (data, query) =>
    getResizedImageData(data, null, null, null, query['arc-site']),
  ttl: 300,
}