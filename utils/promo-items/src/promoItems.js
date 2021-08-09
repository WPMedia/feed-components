'use strict'

import { buildResizerURL } from '@wpmedia/feeds-resizer'
import { findVideo } from '@wpmedia/feeds-find-video-stream'
const jmespath = require('jmespath')

export function BuildPromoItems() {
  // A constructor to allow prototypal inheritance to override the behavior of member functions

  const imageRegex = /\.jpe?g|\.png|\.webp/i
  const videoRegex = /\.mp4|\.m3u8/i
  let match

  /* Sitemap <image:image> tag generator
    supports single or list of image url, title, caption
    data could be from a video where url is a video, image is thumbnail
    options = {
      ans,
      promoItemsJmespath,
      resizerKey,
      resizerURL,
      resizerWidth,
      resizerHeight,
      imageTitle,
      imageCaption,
      imageCredits,
    }
  */
  this.imageTag = (options) => {
    let imgs = this.parse(options)
    if (!imgs) return
    if (imgs && !Array.isArray(imgs)) imgs = [imgs]

    return imgs.map((img) => ({
      'image:image': {
        'image:loc': img.url.match(videoRegex) ? img.thumbnail : img.url,
        ...(img.caption && {
          'image:caption': { $: img.caption },
        }),
        ...(img.title && {
          'image:title': { $: img.title },
        }),
      },
    }))
  }

  /* RSS <media:content> tag generator
    supports single or list of media url (type, height, width), title, caption, credits
    video has additional bitrate, duration, thumbnail
    videos use a few different fields than images that had to be hardcoded
      headlines.basic vs title
      description.basic || subheadlines.basic vs caption

    options = {
      ans,
      promoItemsJmespath,
      resizerKey,
      resizerURL,
      resizerWidth,
      resizerHeight,
      imageTitle,
      imageCaption,
      imageCredits,
      videoSelect,
    }
  */
  this.mediaTag = (options) => {
    let imgs = this.parse(options)
    if (!imgs) return
    if (imgs && !Array.isArray(imgs)) imgs = [imgs]

    return imgs.map((img) => ({
      'media:content': {
        '@url': img.url,
        '@type': img.type,
        ...(img.duration && {
          '@duration': img.duration,
        }),
        ...(img.bitrate && {
          '@bitrate': img.bitrate,
        }),
        ...(img.height && {
          '@height': img.height,
        }),
        ...(img.width && {
          '@width': img.width,
        }),
        ...(img.filesize && {
          '@fileSize': img.filesize,
        }),
        ...(img.caption && {
          'media:description': { '@type': 'plain', $: img.caption },
        }),
        ...(img.title && {
          'media:title': { $: img.title },
        }),
        ...(img.credits && {
          'media:credit': {
            '@role': 'author',
            '@scheme': 'urn:ebu',
            '#': img.credits.join(','),
          },
        }),
        ...(img.thumbnail && {
          'media:thumbnail': {
            '@url': img.thumbnail,
          },
        }),
      },
    }))
  }

  /* RSS <enclosure> tag generator
    supports single or list of media; url, type, filesize
    the RSS spec isn't clear on support for multiple enclosures

    options = {
      ans,
      promoItemsJmespath,
      resizerKey,
      resizerURL,
      resizerWidth,
      resizerHeight,
      imageTitle,
      imageCaption,
      imageCredits,
      videoSelect,
    }
  */
  this.enclosureTag = (options) => {
    let imgs = this.parse(options)
    if (!imgs) return
    if (imgs && !Array.isArray(imgs)) imgs = [imgs]

    return imgs.map((img) => ({
      enclosure: {
        '@url': img.url,
        '@type': img.type,
        ...(img.filesize && {
          '@length': img.filesize,
        }),
      },
    }))
  }

  this.gallery = (options) => {
    const galleryArray = []
    const { element } = options
    element.content_elements.forEach((galleryItem) => {
      if (galleryItem && galleryItem.url) {
        galleryArray.push(
          this.image({
            ...options,
            element: galleryItem,
          }),
        )
      }
    })
    return galleryArray
  }

  this.image = ({
    element,
    resizerKey,
    resizerURL,
    resizerWidth,
    resizerHeight,
    imageTitle,
    imageCaption,
    imageCredits,
  }) => ({
    url: buildResizerURL(
      element.url,
      resizerKey,
      resizerURL,
      resizerWidth,
      resizerHeight,
    ),
    type: `image/${
      ((match = element.url.match(imageRegex)) &&
        match &&
        match[0].replace('.', '').toLowerCase().replace('jpg', 'jpeg')) ||
      'jpeg'
    }`,
    medium: 'image',
    title: jmespath.search(element, imageTitle),
    caption: jmespath.search(element, imageCaption),
    credits: jmespath.search(element, imageCredits),
    ...(element.height && { height: resizerHeight || element.height }),
    ...(element.width && { width: resizerWidth || element.width }),
  })

  this.video = ({
    element,
    resizerKey,
    resizerURL,
    resizerWidth,
    resizerHeight,
    imageCredits,
    videoSelect,
  }) => {
    if (element && element.streams) {
      const thumbnail = jmespath.search(
        element,
        'promo_items.basic.url || promo_items.lead_art.url || promo_image.url',
      )
      const title = jmespath.search(element, 'headlines.basic')
      const caption = jmespath.search(
        element,
        'description.basic || subheadlines.basic',
      )
      const credits = jmespath.search(element, imageCredits)
      const duration = element.duration
      const videoStream = findVideo(element, videoSelect)
      if (videoStream) {
        return {
          ...(thumbnail && {
            thumbnail: buildResizerURL(
              thumbnail,
              resizerKey,
              resizerURL,
              resizerWidth,
              resizerHeight,
            ),
          }),
          url: videoStream.url,
          type: videoStream.stream_type === 'ts' ? 'video/MP2T' : 'video/mp4',
          medium: 'video',
          bitrate: videoStream.bitrate,
          ...(videoStream.height && { height: videoStream.height }),
          ...(videoStream.width && { width: videoStream.width }),
          ...(videoStream.filesize && { filesize: videoStream.filesize }),
          ...(caption && { caption: caption }),
          ...(credits && { credits: credits }),
          ...(title && { title: title }),
          ...(duration && { duration: Math.trunc(duration / 1000) }),
        }
      }
    }
  }

  this.parse = ({
    ans = {},
    promoItemsJmespath = 'promo_items.basic || promo_items.lead_art',
    resizerKey,
    resizerURL,
    resizerWidth = 0,
    resizerHeight = 0,
    imageTitle = 'title',
    imageCaption = 'caption',
    imageCredits = 'credits.by[].name',
    videoSelect,
  }) => {
    let item
    const element = jmespath.search(ans, promoItemsJmespath)
    if (element && element.type) {
      switch (element.type) {
        case 'gallery':
          item = this.gallery({
            element,
            resizerKey,
            resizerURL,
            resizerWidth,
            resizerHeight,
            imageTitle,
            imageCaption,
            imageCredits,
          })
          break
        case 'image':
          item = this.image({
            element,
            resizerKey,
            resizerURL,
            resizerWidth,
            resizerHeight,
            imageTitle,
            imageCaption,
            imageCredits,
          })
          break
        case 'video':
          item = this.video({
            element,
            resizerKey,
            resizerURL,
            resizerWidth,
            resizerHeight,
            imageCredits,
            videoSelect,
          })
          break
      }
      return item
    }
  }
}
