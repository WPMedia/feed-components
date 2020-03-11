import PropTypes from 'prop-types'
import Consumer from 'fusion:consumer'

/**
 * xmlbuilder object template for standard sitemaps
 * @param {ANS} elements list of content elements
 */
export const sitemapTemplate = (elements, { changeFreq }) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
    url: elements.map((s) => ({
      loc: s.canonical_url,
      ...(changeFreq && { changefeq: 'always' }),
    })),
  },
})

/**
 * Builder function for generating a class based on some configuration values
 */
const getSitemap = (config) => {
  class Sitemap {
    constructor(props) {
      this.props = props
      const { customFields: { website } = {} } = props

      this.fetchContent({
        result: {
          source: 'sitemap',
          query: {
            website,
          },
        },
      })
    }

    render() {
      const { result } = this.state || {}
      const elements = result ? result.content_elements : []
      return sitemapTemplate(elements, config)
    }
  }

  Sitemap.propTypes = {
    customFields: PropTypes.shape({
      website: PropTypes.string.tag({
        label: 'Website',
      }).isRequired,
    }),
  }

  return Consumer(Sitemap)
}

export default getSitemap
