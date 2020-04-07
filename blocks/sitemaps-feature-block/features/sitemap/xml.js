import PropTypes from 'prop-types'
import Consumer from 'fusion:consumer'
import get from 'lodash/get'
import getProperties from 'fusion:properties';
import {resizerKey} from 'fusion:environment'

export class Sitemap {
  constructor(props) {
    this.props = props
    const { arcSite } = props
    this.resizerURL = getProperties(arcSite).resizerURL
    this.feedDomainURL = getProperties(arcSite).feedDomainURL
    this.fetchContent({
      site: {
        source: 'feeds-site-service',
        query: {
          website: arcSite,
        },
      },
    })
  }

  getImgURL(element)  {
    const buildURL = _url => {
      if (typeof window === 'undefined') {
        const Thumbor = require('thumbor-lite')
        const thumbor = new Thumbor(resizerKey, this.resizerURL)
        let imgSrc = _url.replace(/^http[s]?:\/\//, '').replace(' ', '%20')
        if (imgSrc.includes('?')) {
          imgSrc = imgSrc.replace('?', '%3F')
        }

        return thumbor
          .setImagePath(imgSrc)
          .resize(1200, 630)
          .buildUrl()
      }
      return null
    }

    if (
      element.promo_items &&
      element.promo_items.basic &&
      element.promo_items.basic.url
    ) {
      return buildURL(element.promo_items.basic.url)
    }

    return ''
  }

  sitemapTemplate  (
    elements,
    { domain, lastMod, changeFreq, includePromo, priority, imageTitle, imageCaption }

  )  {
    return {
      urlset: {
        '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        ...(includePromo && {
          '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
        }),
        url: elements.map(s => {
          const img =
            s.promo_items && (s.promo_items.basic || s.promo_items.lead_art)
          return {
            loc: `${domain}${s.canonical_url}`,
            ...({ lastmod: s[lastMod] }),
            ...(changeFreq !== 'Exclude from sitemap' && { changefeq: changeFreq }),
            ...(priority !== 'Exclude from sitemap' && { priority: priority }),
            ...(includePromo &&
              img && {
                'image:image': {
                  'image:loc': this.getImgURL(s),
                  ...(img[imageCaption] && {
                    'image:caption': { $: img[imageCaption] },
                  }),
                  ...(img[imageTitle] && {
                    'image:title': { $: img[imageTitle] },
                  }),
                },
              }),
          }
        }),
      },
    }
  }

  render() {
    const { site } = this.state || {}
    const { globalContent, customFields } = this.props

    // can't return null for xml return type, must return valid xml template
    if(!site) {
      return this.sitemapTemplate([], customFields)
    }
    const elements = get(globalContent, 'content_elements', [])
    return this.sitemapTemplate(elements, { ...customFields, domain: this.feedDomainURL})
  }

}

Sitemap.propTypes = {
  customFields: PropTypes.shape({
    imageTitle: PropTypes.string.tag({
      label: 'ANS image title key',
      group: 'Field Mapping',
      description:
        'ANS value for associated story used for the <image:title> sitemap tag',
      defaultValue: 'title',
    }),
    imageCaption: PropTypes.string.tag({
      label: 'ANS image title key',
      group: 'Field Mapping',
      description:
        'ANS value for associated story image used for the <image:caption> sitemap tag',
      defaultValue: 'caption',
    }),
    lastMod: PropTypes.oneOf([
      'created_date', 'display_date', 'first_publish_date', 'last_updated_date', 'publish_date'
    ]).tag({
      label: 'Last Modified Date',
      group: 'Format',
      description: 'Which date field should be used in the sitemap',
      defaultValue: 'last_updated_date',
    }),
    changeFreq: PropTypes.oneOf([
      'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never', 'Exclude from sitemap'
    ]).tag({
      label: 'change frequency',
      group: 'Format',
      description: 'What is the Change frequency of the sitemap',
      defaultValue: 'always',
    }),
    includePromo: PropTypes.boolean.tag({
      label: 'Include promo images?',
      group: 'Format',
      description: 'Include an image in the sitemap',
      defaultValue: true,
    }),
    priority: PropTypes.oneOf([
        '0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0', 'Exclude from sitemap'
    ]).tag({
      label: 'priority',
      group: 'Format',
      description: 'What is the priority of the sitemap',
      defaultValue: '0.5',
    }),
  }),
}
Sitemap.label = 'Standard Sitemap'
export default Consumer(Sitemap)
