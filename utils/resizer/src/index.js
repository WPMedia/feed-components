import { RESIZER_TOKEN_VERSION } from 'fusion:environment'

import { imageANSToImageSrc } from '@wpmedia/arc-themes-components'

import calculateWidthAndHeight from './calculateWidthAndHeight'

const formatSrc = (srcWithResizerUrl, resizedOptions) => {
  return srcWithResizerUrl.concat(
    '?',
    new URLSearchParams({
      ...resizedOptions,
      width: Math.floor(resizedOptions.width),
      height: Math.floor(resizedOptions.height),
    }).toString(),
  )
}

export function buildResizerURL(
  _url,
  resizerKey,
  resizerURL,
  width = 0,
  height = 0,
  ansImage,
) {
  if (ansImage?.auth?.[RESIZER_TOKEN_VERSION]) {
    const imageWidthAndHeight = calculateWidthAndHeight({
      width,
      height,
      ansImage,
    })

    const defaultSrc = formatSrc(
      resizerURL.concat('/', imageANSToImageSrc(ansImage)),
      {
        ...imageWidthAndHeight,
        auth: ansImage.auth[RESIZER_TOKEN_VERSION],
        smart: true,
      },
    )
    console.log(defaultSrc)
    return defaultSrc
  } else {
    if (resizerKey) {
      if (_url && typeof window === 'undefined') {
        const Thumbor = require('thumbor-lite')
        const thumbor = new Thumbor(resizerKey, resizerURL)
        let imgSrc = _url.replace(/^http[s]?:\/\//, '').replace(' ', '%20')
        if (imgSrc.includes('?')) {
          imgSrc = imgSrc.replace('?', '%3F')
        }

        return thumbor.setImagePath(imgSrc).resize(width, height).buildUrl()
      }
    }
    return _url
  }
  return null
}
