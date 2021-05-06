# RSS Alexa

## Globals

feedTitle
feedLanguage
feedDomainURL
feedResizer

## Custom Fields

channelTitle: defaults to global website name
channelDescription: defaults to global website name + "News Feed"
channelPath: defaults to /arc/outboundfeeds/rss/
channelCopyright: defaults to Copyright YYYY global website name
channelTTL: number of mins, defaults to 1
channelCategory: optional
channelLogo: Should be a url to their logo, optional

itemTitle: jmespath for title mapping headlines.basic
pubDate: date field defaults to display_date
itemCategory: jmespath for category mapping headlines.basic
includeContent: number of paragraphs to include 0-10, all

includePromo: bool to include promo image
imageTitle defaults to title
imageCaption defaults to caption
ImageCredits defaults to credits.by[].name

### Usage
