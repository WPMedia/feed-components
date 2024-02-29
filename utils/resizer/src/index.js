import Thumbor from 'thumbor-lite'

import { RESIZER_TOKEN_VERSION } from 'fusion:environment'

import calculateWidthAndHeight from './calculateWidthAndHeight'

import handleFetchError from './handle-fetch-error/index.js'
import imageANSToImageSrc from './image-ans-to-image-src/index.js'
import signImagesInANSObject from './sign-images-in-ans-object/index.js'
import { fetch as resizerFetch } from './signing-service/index.js'

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

function buildResizerURL(
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
    return defaultSrc
  } else {
    if (resizerKey) {
      if (_url && typeof window === 'undefined') {
        const thumbor = new Thumbor(resizerKey, resizerURL)
        let imgSrc = _url.replace(/^http[s]?:\/\//, '').replaceAll(' ', '%20')
        if (imgSrc.includes('?')) {
          imgSrc = imgSrc.replaceAll('?', '%3F')
        }

        return thumbor.setImagePath(imgSrc).resize(width, height).buildUrl()
      }
    }
    return _url
  }
}

export {
  buildResizerURL,
  imageANSToImageSrc,
  signImagesInANSObject,
  handleFetchError,
  resizerFetch,
}
