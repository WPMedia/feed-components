import { create } from 'xmlbuilder2'

const CHANGE_FREQ = 'always'
const PRIORITY = '0.5'

const makeElement = (el) => ({
  loc: el.canonical_url,
  ...(el.last_updated_date && { lastmode: el.last_updated_date }),
  changefeq: CHANGE_FREQ,
  priority: PRIORITY,
  'image:image': getImages(el),
})

const getImages = (el) => {
  const images = el.content_elements.filter((e) => e.type === 'image')
  return images.map((i) => ({ 'image:loc': i.url }))
}

const Json = ({ globalContent, ...props }) => {
  const { content_elements: elements } = globalContent

  return create({
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
      url: elements.map(makeElement),
    },
  })
}

// Specify content type
Json.contentType = 'application/xml'

export default Json
