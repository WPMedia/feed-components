function getImgURL (element, resizerKey, resizerURL)  {
  const buildURL = (_url) => {
    if (typeof window === 'undefined') {
      const Thumbor = require('thumbor-lite')
      const thumbor = new Thumbor(resizerKey, resizerURL)
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

export default getImgURL