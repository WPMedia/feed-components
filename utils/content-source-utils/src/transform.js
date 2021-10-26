export const transform = (data, query) => {
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
  }
  return source
}
