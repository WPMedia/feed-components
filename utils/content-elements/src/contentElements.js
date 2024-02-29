import { buildResizerURL } from '@wpmedia/feeds-resizer'
import { findVideo } from '@wpmedia/feeds-find-video-stream'
const cheerio = require('cheerio')
const { decode } = require('he')
const jmespath = require('jmespath')
const { fragment } = require('xmlbuilder2')

export const absoluteUrl = (url, domain) => {
  // if url isn't fully qualified, try to make it one
  if (url && url.startsWith('//')) {
    url = `${domain.substring(0, domain.indexOf('//'))}${url}`
  } else if (url && url.startsWith('/')) {
    url = `${domain}${url}`
  }
  return url
}

export function BuildContent() {
  // RSS src and href should be fully qualified urls. Fix links that start
  // with // or /
  //
  this.fixRelativeLinks = (element, domain) => {
    const item = cheerio.load(element, null, false)
    let found = false

    // look for <a> and <img> without FQDN urls
    const patternArray = [
      ['a[href^="//"]', 'href'],
      ['a[href^="/"]', 'href'],
      ['img[src^="//"]', 'src'],
      ['img[src^="/"]', 'src'],
    ]
    patternArray.forEach(([pattern, attrib]) => {
      item(pattern).each(function () {
        found = true
        const oldUrl = item(this).attr(attrib)
        item(this).attr(attrib, absoluteUrl(oldUrl, domain))
      })
    })

    if (found) {
      return item.xml()
    } else {
      return element
    }
  }

  // A constructor to allow prototypal inheritance to override the behavior of member functions
  this.correction = (element) =>
    element.text && {
      i: element.text,
    }

  this.code = (element) => ''
  this.custom_embed = (element) => ''
  this.divider = (element) => ''
  this.element_group = (element) => ''
  this.story = (element) => ''

  this.endorsement = (element) =>
    element.endorsement && {
      p: element.endorsement,
    }

  this.gallery = (
    element,
    resizerKey,
    resizerURL,
    resizeWidth,
    resizeHeight,
  ) => {
    const galleryArray = []
    element.content_elements.forEach((galleryItem) => {
      galleryArray.push(
        this.image(
          galleryItem,
          resizerKey,
          resizerURL,
          resizeWidth,
          resizeHeight,
        ),
      )
    })
    return galleryArray
  }

  this.image = (
    element,
    resizerKey,
    resizerURL,
    resizeWidth,
    resizeHeight,
  ) => ({
    img: {
      '@': {
        src: buildResizerURL(
          element.url,
          resizerKey,
          resizerURL,
          resizeWidth,
          resizeHeight,
          element,
        ),
        alt: element.caption || '',
        ...(element.height && { height: resizeHeight || element.height }),
        ...(element.width && { width: resizeWidth || element.width }),
      },
    },
  })

  this.linkList = (element) => {
    return ''
  }

  this.list = (element) => {
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
    const listArray = []
    listArray.push(listElement(element))
    return listArray
  }

  this.listElement = (element) => {
    return ''
  }

  this.numericRating = (element) =>
    element.numeric_rating && {
      p: `${element.numeric_rating} ${element.units}`,
    }

  this.table = (element) => {
    const header = []
    const rows = []
    let row

    element.header &&
      element.header.forEach((headerItem) => {
        header.push(headerItem.content)
      })

    element.rows &&
      element.rows.forEach((tableRows) => {
        row = []
        tableRows.forEach((rowItem) => {
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

  this.header = (element) => {
    let item
    if (element.content && typeof element.content === 'string') {
      item = {}
      item[`h${element.level || 1}`] = element.content
    }
    return item
  }

  this.blockquote = (element) => {
    let item
    if (element.content && typeof element.content === 'string') {
      item = { q: element.content }
    }
    return item
  }

  this.text = (element, domain) => {
    // handle text, raw_html
    // all have a string in element.content
    // this is also used by buildContentQuote
    let item
    if (element.content && typeof element.content === 'string') {
      item = { p: this.fixRelativeLinks(element.content, domain) }
    }
    return item
  }

  this.interstitial = (element, domain) =>
    element.url && {
      p: {
        a: {
          '@href': absoluteUrl(element.url, domain),
          '#': element.content,
        },
      },
    }

  this.oembed = (element) => {
    let embed = element.raw_oembed.html

    // some <blockquote> have a <script> at then end, remove the script tag
    if (
      embed &&
      (element.subtype === 'twitter' || element.subtype === 'instagram')
    ) {
      const idx = embed.indexOf('</blockquote>')
      embed = embed.substring(0, idx + 13)
    }
    return { '#': embed }
  }

  this.quote = (element, domain) => {
    const quoteArray = []

    element.content_elements.forEach((quoteItem) => {
      switch (quoteItem.type) {
        case 'header':
          quoteArray.push(this.header(quoteItem))
          break
        case 'list':
          quoteArray.push(this.list(quoteItem))
          break
        default:
          quoteArray.push(this.text(quoteItem, domain))
      }
    })
    const citation = jmespath.search(element, 'citation.content')
    citation && quoteArray.push({ p: { '@class': 'citation', '#': citation } })

    return quoteArray.length ? { blockquote: { '#': quoteArray } } : ''
  }

  this.video = (
    element,
    videoSelect = { bitrate: 2000, stream_type: 'mp4' },
  ) => {
    if (element && element.streams) {
      const promoItems =
        jmespath.search(element, 'promo_items.basic || promo_items.lead_art') ||
        {}
      const caption = jmespath.search(
        element,
        'description.basic || subheadlines.basic',
      )
      let credits = (jmespath.search(element, 'credits.by[].name') || []).join(
        ',',
      )
      credits = credits ? ` ${credits}` : ''
      const videoStream = findVideo(element, videoSelect)
      if (videoStream) {
        return {
          figure: {
            video: {
              '@': {
                ...(videoStream.height && { height: videoStream.height }),
                ...(videoStream.width && { width: videoStream.width }),
                ...(promoItems.url && { poster: promoItems.url }),
              },
              source: {
                '@': {
                  src: videoStream.url,
                  type:
                    videoSelect.stream_type === 'mp4'
                      ? 'video/mp4'
                      : 'video/MP2T',
                },
              },
            },
            ...(caption && { figcaption: `${caption}${credits}` }),
          },
        }
      }
    }
  }

  this.parse = (
    contentElements,
    numRows,
    domain,
    resizerKey,
    resizerURL,
    resizeWidth,
    resizeHeight,
    videoSelect,
  ) => {
    let item
    const body = []
    const maxRows = numRows === 'all' ? 9999 : parseInt(numRows)
    contentElements.forEach((element) => {
      if (body.length < maxRows) {
        switch (element.type) {
          case 'blockquote':
            item = this.blockquote(element)
            break
          case 'correction':
            item = this.correction(element)
            break
          case 'code':
            item = this.code(element)
            break
          case 'custom_embed':
            item = this.custom_embed(element)
            break
          case 'divider':
            item = this.divider(element)
            break
          case 'element_group':
            item = this.element_group(element)
            break
          case 'story':
            item = this.story(element)
            break
          case 'endorsement':
            item = this.endorsement(element)
            break
          case 'gallery':
            item = this.gallery(
              element,
              resizerKey,
              resizerURL,
              resizeWidth,
              resizeHeight,
            )
            break
          case 'header':
            item = this.header(element)
            break
          case 'image':
            item = this.image(
              element,
              resizerKey,
              resizerURL,
              resizeWidth,
              resizeHeight,
            )
            break
          case 'interstitial_link':
            item = this.interstitial(element, domain)
            break
          case 'link_list':
            item = this.linkList(element, domain)
            break
          case 'list':
            item = this.list(element)
            break
          case 'list_element':
            item = this.listElement(element)
            break
          case 'numeric_rating':
            item = this.numericRating(element)
            break
          case 'oembed_response':
            item = this.oembed(element)
            break
          case 'quote':
            item = this.quote(element, domain)
            break
          case 'raw_html':
            item = this.text(element, domain)
            break
          case 'table':
            item = this.table(element)
            break
          case 'text':
            item = this.text(element, domain)
            break
          case 'video':
            item = this.video(element, videoSelect)
            break
          default:
            item = this.text(element, domain)
            break
        }

        // empty array breaks xmlbuilder2, but empty '' is OK
        if (Array.isArray(item) && item.length === 0) {
          item = ''
        }
        item && body.push(item)
      }
    })
    return body.length ? decode(fragment(body).toString()) : ''
  }
}
