const resolve = function resolve(key) {
  const requestUri = '/content/v4/search/published'
  const uriParams = [
    `q=${key['Feed-Query'] || 'type:story+AND+revision.published:true'}`,
    `website=${key['arc-site']}`,
    `size=${key['Feed-Size'] || '100'}`,
    `from=${key['Feed-Offset'] || '0'}`,
    `_sourceExclude=${key['Source-Exclude'] || 'related_content'}`,
    `sort=${key.Sort || 'publish_date:desc'}`,
  ].join('&')

  return `${requestUri}?${uriParams}`
}

export default {
  resolve,
  schemaName: 'feeds',
  params: {
    'Feed-Query': 'text',
    'Feed-Size': 'text',
    'Feed-Offset': 'text',
    'Source-Exclude': 'text',
    Sort: 'text',
  },
}
