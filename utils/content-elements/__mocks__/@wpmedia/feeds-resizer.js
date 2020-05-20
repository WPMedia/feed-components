;`use strict`

export const buildResizerURL = (url, resizerKey, resizerURL) =>
  `${resizerURL}/abcdefghijklmnopqrstuvwxyz=/${url.replace('https://', '')}`
