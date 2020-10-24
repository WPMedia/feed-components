# utilities

In addition to the blocks that have been created for feeds and content-sources several npm packages have been created to be used as utilities to reduce duplicate code. All of the blocks packages end in "-block" to designate they are blocks and should be in the blocks.json. These utilities are normal npm packages that start with "feeds-" and must be included in the package.json dependencies.

## feeds-content-elements

This package is designed to take an array of content_elements from a story and convert the different content_element types into xml. Each content_element type has it's own parser to convert the ANS to xml.
Call the parse function and pass in the content_elements array, it will return a string of formatted xml.

```javascript
import { BuildContent } from '@wpmedia/feeds-content-elements'

const rssBuildContent = new BuildContent()

const body = rssBuildContent.parse(
  story.content_elements,
  includeContent, // 0-10 or "all" for how many content_elements to include in the feed
  domain, // from blocks.json properties
  resizerKey, // from environment/index.js stored encrypted
  resizerURL, // from blocks.json properties
  resizerWidth, // optional width to resize all images
  resizerHeight, // optional height to resize all images
)
```

The parse function determines how much of each article to include and maps each content_element type to the correct parser. By putting each parser into it's own function you can easily change how any content_element type is processed. If we want to change how headers are created we can create a new rssBuildContent function and redefine just the header function like.

```javascript
import { BuildContent } from '@wpmedia/feeds-content-elements'

function rssBuildContent() {
  BuildContent.call(this)

  this.header = (element) => {
    return {
      h1: {
        '@class': 'headline',
        '#': element.content,
      },
    }
  }
}
```

## feeds-find-video-stream

ANS Video can have multiple video encodings. These can be different video types (mp4, m3u8) and bit rates (300, 600, 1200, 2400, 5400). The types and sizes are configurable in VideoCenter and might be different for each client. Each video has a streams array to hold the encodings. This utility will search for a single video encoding based on the fields and values you pass in.

```javascript
import { findVideo } from '@wpmedia/feeds-find-video-stream'

const selectVideo = {
  bitrate: 5400,
  stream_type: 'mp4',
}

const videoStream = findVideo(video.streams, selectVideo)
```

## feeds-prop-types

Most feeds can be broken down into sitemaps and rss feeds. Each type shares a common set of customFields. This utility is a convenient way to add some or all of the shared customFields to a feed. The function `generatePropsForFeed( feedType, PropTypes, omit )`

- feedType - either sitemap or rss
- PropType - the fusion:prop-types
- omit - Array of customFields to exclude

### sitemap customFields

- includePromo
- lastMod
- priority
- changeFreq

### rss customFields

- channelTitle
- channelDescription
- channelCopyright
- channelTTL
- channelUpdatePeriod
- channelUpdateFrequency
- channelCategory
- channelLogo
- itemTitle
- itemDescription
- pubDate
- itemCredits
- itemCategory
- includePromo
- imageTitle
- imageCaption
- imageCredits
- includeContent

To add the common customFields to an rss feed but exclude includePromo call generatePropsForFeed like:

```javascript
import PropTypes from 'fusion:prop-types'
import { generatePropsForFeed } from '@wpmedia/feeds-prop-types'

rss.propTypes = {
  customFields: PropTypes.shape({
    ...generatePropsForFeed('rss', PropTypes, [includePromo]
  })
}
```

If you want to add your own customFields, add them after the generatePropsForFeed call.

## feeds-resizer

All image urls must be generated using the resizer. This ensures the lowest latency and reduces potential impacts on your system. This also offers the opportunity to change the images width and or height if desired. The resizer function depends on a cryptographic key `resizerKey` that should be stored in `environment/index.js` as an encrypted value. The width and height are optional. If omitted the resizer will return the image's original size. Call the resizer like:

```javascript
import { resizerKey } from 'fusion:environment'
import { buildResizerURL } from '@wpmedia/feeds-resizer'

const resizedURL = buildResizerURL(
  imageURL,
  resizerKey,
  resizerURL,
  width,
  height,
)
```

## feeds-xml-output

By default PageBuilder generates html output. To generate xml output a new outputType must be created. The outputType expects an object and uses the xmlbuilder2 module to convert it to xml. In the skeleton repo the feeds-xml-output package has already been [added](./output-types.md) and the output-type configured. By including the parameter `?outputType=xml` in all feeds requests tells fusion to use the xml output-type.

