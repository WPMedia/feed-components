'use strict'

import { buildResizerURL } from '@wpmedia/feeds-resizer'
const jmespath = require('jmespath')
const { fragment } = require('xmlbuilder2')

export const absoluteUrl = (url, domain) => {
  // if url isn't fully qualified, try to make it one
  if (url && url.startsWith('//')) {
    url = `${domain.substring(0, domain.indexOf('//'))}${url}`
  } else if (url && !url.startsWith('http')) {
    url = `${domain}${url}`
  }
  return url
}

export const buildContentCorrection = (element) =>
  element.text && {
    i: element.text,
  }

export const buildContentEndorsement = (element) =>
  element.endorsement && {
    p: element.endorsement,
  }

const buildContentGallery = (element) => {
  const gallery = []
  element.content_elements.map((image) => {
    gallery.push(buildContentImage(image))
  })
  return gallery
}

export const buildContentImage = (element, resizerKey, resizerURL) => ({
  img: {
    '@': {
      src: buildResizerURL(element.url, resizerKey, resizerURL),
      ...(element.caption && { alt: element.caption }),
      ...(element.height && { height: element.height }),
      ...(element.width && { width: element.width }),
    },
  },
})

export const buildContentLinkList = (element) => {
  return ''
}

export const buildContentList = (element) => {
  const listElement = (element) => {
    const listType = element.list_type === 'ordered' ? 'ol' : 'ul'
    const innerList = {}
    innerList[listType] = { li: [] }
    element.items.map((i) =>
      i.type === 'list'
        ? innerList[listType].li.push(listElement(i))
        : innerList[listType].li.push(i.content),
    )
    return innerList
  }
  const list = []
  list.push(listElement(element))
  return list
}

export const buildContentListElement = (element) => {
  return ''
}

export const buildContentListNumericRating = (element) =>
  element.numeric_rating && { p: `${element.numeric_rating} ${element.units}` }

export const buildContentTable = (element) => {
  const header = []
  const rows = []
  let row

  element.header &&
    element.header.map((headerItem) => {
      header.push(headerItem.content)
    })

  element.rows &&
    element.rows.map((tableRows) => {
      row = []
      tableRows.map((rowItem) => {
        row.push(rowItem.content)
      })
      rows.push({ tr: { td: row } })
    })

  return {
    table: {
      thead: { tr: { th: header } },
      tbody: { '#': rows },
    },
  }
}

export const buildContentText = (element) => {
  // handle text, raw_html, header, blockquote
  // all have a string in element.content
  // this is also used by buildContentQuote
  let item
  if (element.content && typeof element.content === 'string') {
    switch (element.type) {
      case 'header':
        item = {}
        item[`h${element.level || 1}`] = element.content
        break
      case 'blockquote':
        item = { q: element.content }
        break
      default:
        item = { p: element.content }
        break
    }
  }
  return item
}

export const buildContentInterstitial = (element, domain) =>
  element.url && {
    p: {
      a: {
        '@href': absoluteUrl(element.url, domain),
        '#': element.content,
      },
    },
  }

export const buildContentOembed = (element) => {
  let embed = element.raw_oembed.html

  // some <blockquote> have a <script> at then end, remove the script tag
  if (
    (embed && element.subtype === 'twitter') ||
    element.subtype === 'instagram'
  ) {
    const idx = embed.indexOf('</blockquote>')
    embed = embed.substring(0, idx + 13)
  }
  return { '#': embed }
}

export const buildContentQuote = (element) => {
  const quote = []

  element.content_elements.map((quoteItem) => {
    switch (quoteItem.type) {
      case 'list':
        quote.push(buildContentList(quoteItem))
        break
      default:
        quote.push(buildContentText(quoteItem))
    }
  })
  const citation = jmespath.search(element, 'citation.content')
  citation && quote.push({ p: { '@class': 'citation', '#': citation } })

  return quote.length ? { blockquote: { '#': quote } } : ''
}

export const buildContentVideo = (element) => {
  return ''
}

export const buildContent = (
  contentElements,
  numRows,
  domain,
  resizerKey,
  resizerURL,
) => {
  let item
  const body = []
  const maxRows = numRows === 'all' ? 9999 : parseInt(numRows)
  contentElements.map((element) => {
    if (body.length <= maxRows) {
      switch (element.type) {
        case 'blockquote':
          item = buildContentText(element)
          break
        case 'code':
          item = ''
          break
        case 'correction':
          item = buildContentCorrection(element)
          break
        case 'custom_embed':
          item = ''
          break
        case 'divider':
          item = ''
          break
        case 'element_group':
          item = ''
          break
        case 'endorsement':
          item = buildContentEndorsement(element)
          break
        case 'gallery':
          item = buildContentGallery(element)
          break
        case 'header':
          item = buildContentText(element)
          break
        case 'image':
          item = buildContentImage(element, resizerKey, resizerURL)
          break
        case 'interstitial_link':
          item = buildContentInterstitial(element, domain)
          break
        case 'link_list':
          item = buildContentLinkList(element, domain)
          break
        case 'list':
          item = buildContentList(element)
          break
        case 'list_element':
          item = buildContentListElement(element)
          break
        case 'numeric_rating':
          item = buildContentListNumericRating(element)
          break
        case 'oembed_response':
          item = buildContentOembed(element)
          break
        case 'quote':
          item = buildContentQuote(element)
          break
        case 'raw_html':
          item = buildContentText(element)
          break
        case 'story':
          item = ''
          break
        case 'table':
          item = buildContentTable(element)
          break
        case 'text':
          item = buildContentText(element)
          break
        case 'video':
          item = buildContentVideo(element)
          break
        default:
          item = buildContentText(element)
          break
      }

      console.log(item)
      // empty array breaks xmlbuilder2, but empty '' is OK
      if (Array.isArray(item) && item.length === 0) {
        item = ''
      }
      item && body.push(item)
    }
  })
  return body.length ? fragment(body).toString() : ''
}
