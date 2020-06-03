export function buildResizerURL(
  _url,
  resizerKey,
  resizerURL,
  width = 0,
  height = 0,
) {
  if (_url && typeof window === 'undefined') {
    const Thumbor = require('thumbor-lite')
    const thumbor = new Thumbor(resizerKey, resizerURL)
    let imgSrc = _url.replace(/^http[s]?:\/\//, '').replace(' ', '%20')
    if (imgSrc.includes('?')) {
      imgSrc = imgSrc.replace('?', '%3F')
    }

    return thumbor.setImagePath(imgSrc).resize(width, height).buildUrl()
  }
  return null
}
