import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'
import { resizerKey } from 'fusion:environment'
import { buildResizerURL } from '@wpmedia/feeds-resizer'

const jmespath = require('jmespath')
export function ANSFeed({ globalContent, customFields, arcSite }) {
  const { resizerURL = '', feedDomainURL = '' } = getProperties(arcSite)
  const { width = 0, height = 0 } = customFields.resizerKVP || {}

  const resizeImage = (img) => {
    if (img && img.url) {
      if (
        img.additional_properties &&
        img.additional_properties.fullSizeResizeUrl
      ) {
        img.url = `${feedDomainURL}${img.additional_properties.fullSizeResizeUrl}`
      } else {
        img.url = buildResizerURL(
          img.url,
          resizerKey,
          resizerURL,
          width,
          height,
        )
      }
      return img
    }
  }

  const resizedContent = (
    jmespath.search(globalContent, 'content_elements||children') || []
  ).map((i) => {
    i.promo_items &&
      Object.keys(i.promo_items).forEach((e) => {
        const promo = i.promo_items[e]
        const resizedPromo = resizeImage(promo)
        if (resizedPromo) i.promo_items[e] = resizedPromo
      })
    i.content_elements &&
      i.content_elements.map((e) => {
        switch (e.type) {
          case 'image':
            e = resizeImage(e)
            break
          case 'gallery':
            e.content_elements.forEach((i) => resizeImage(i))
            break
        }
        return e
      })
    i.related_items &&
      Object.keys(i.related_content).forEach((k) => {
        i.related_content[k].map((e) => {
          switch (e.type) {
            case 'image':
              e = resizeImage(e)
              break
            case 'gallery':
              e.content_elements.forEach((i) => resizeImage(i))
              break
          }
          return e
        })
      })
    i.promo_image &&
      i.promo_image.url &&
      (i.promo_image = resizeImage(i.promo_image))
    return i
  })
  return [resizedContent || []]
}

ANSFeed.label = 'ANS'
export default Consumer(ANSFeed)
