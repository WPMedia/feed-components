# Feeds Content Elements

A constructor to process the various content_element types.

## functions

### constructor

BuildContent() - The constructor
parse(element, numRows, resizerKey, resizerURL, width, height) - pass in content_elements array, returns an html fragment string

### member functions

blockquote(element)
correction(element)
endorsement(element)
gallery(element, resizertKey. resizerURL, width, height)
header(element)
image(element, resizerKey, resizerURL, width, height)
interstitial(element, domain)
linkList(element)
list(element)
listElement(element)
numericRating(element)
oembed(element)
quote(element)
table(element)
text(element)
video(element)

### helpers

absoluteUrl(url, domain) - make url fully qualified

## usage

```
import { BuildContent } from './contentElements'

const MyBuildContent = new BuildContent()

const myContent = MyBuildContent.parse(elements, numRows, resizerKey, resizerURL, width, height)
```

Using a constructor allows use of prototype inheritance to override functions

```
import { BuildContent } from './contentElements'

const MyBuildContent() {
  BuildContent.call(this)

  this.image(element, resizerKey, resizerURL, width, height) {
    // custom image logic here to override existsing functionality
  }
}

const NewBuildContent = new MyBuildContent()

const myContent = NewBuildContent.parse(elements, numRows, resizerKey, resizerURL, width, height)
```
