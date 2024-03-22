import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'
import { resizerKey, ENVIRONMENT } from 'fusion:environment'
import { buildResizerURL } from '@wpmedia/feeds-resizer'

export function ANSFeed({ globalContent = {}, customFields, arcSite }) {
  let { resizerURL = '' } = getProperties(arcSite)
  const { feedDomainURL = '', resizerURLs = {}, } = getProperties(arcSite)
  const { width = 0, height = 0 } = customFields.resizerKVP || {}
  resizerURL = resizerURLs?.[ENVIRONMENT] || resizerURL;

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
          img,
        )
      }
      return img
    }
  }

  let contentType
  let contentMap = []
  if (
    globalContent?.type === 'results' ||
    globalContent?.type === 'collection'
  ) {
    contentMap = globalContent.content_elements
  } else if (globalContent?.children) {
    contentMap = globalContent.children
  } else {
    contentMap = [globalContent]
    contentType = 'item'
  }

  const resizedContent = contentMap.map((i) => {
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
  if (contentType === 'item') return resizedContent || {}
  return [resizedContent || []]
}

ANSFeed.label = 'ANS'
ANSFeed.icon = 'arc-json'
export default Consumer(ANSFeed)
