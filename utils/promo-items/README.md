# Feeds Promo Items

A constructor to process `promo_items` for sitemaps and RSS feeds. It supports sitemap image tag, rss media:content and enclosure tags. It handles images, galleries and videos objects and tries to handle them in a consistent way.

## functions

- BuildPromoItems.imageTag - generate image tag
- BuildPromoItems.mediaTag - generate content:media tag
- BuildPromoItems.enclosureTag - generate enclosure tag

### constructor

BuildPromoItems() - The constructor, needs a new instance created first

### member functions

this.parse(ANS, jmespathString, resizerKey, resizerURL, width, height, imageTitle, imageCaption, imageCredits, videoSelect) - pass in ANS and jmespath statement. If the jmespath search returns something it's type is used to call the correct object parser.
this.gallery - process content_elements, calling this.image on each one
this.image - process image, returning url, type, title, caption, credits, height, width
this.video - process video, returning url, type, title, caption, credits, duration, filesize, height, width (of video), thumbnail

## usage

```
import { BuildPromoItems } from './promoItems'

const MyPromoItems = new BuildPromoItems()

const promo = MyBuildPromoItems.mediaTag(ans, promoItemsJmespath, resizerKey, resizerURL, resizeWidth, resizeHeight, imageTitle, imageCaption, imageCredits, videoSelect)
```

Using a constructor allows use of prototype inheritance to override functions

```
import { BuildPromoItems } from './promoItems'

const MyPromoItems() {
  BuildPromoItems.call(this)

  this.image(options) {
    // custom image logic here to override existing functionality
  }
}

const NewPromoItems = new MyPromoItems()

const promo = NewPromoItems.imageTag(ans, promoItemsJmespath, resizerKey, resizerURL, resizeWidth, resizeHeight, imageTitle, imageCaption, imageCredits, videoSelect)
```
