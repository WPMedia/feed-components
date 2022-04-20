# google-news-feed

Always includes Featured Media. <img> tags are wrapped in <figure> tag

## Globals

feedTitle
feedLanguage
feedDomainURL
feedResizer

## Custom Fields

channelTitle: defaults to global website name
channelDescription: defaults to global website name + "News Feed"
channelLanguage: defaults to feedLanguage, use Exclude to remove field
channelCopyright: defaults to Copyright YYYY global website name
channelTTL: number of mins, defaults to 1
channelUpdatePeriod: update period hours, days, weeks, months, years. Defaults to hours
channelUpdateFrequency: Number, defaults to 1
channelCategory: optional
channelLogo: Should be a url to their logo, optional

itemTitle: jmespath for title mapping headlines.basic
itemDescription: jmespath for description mapping description.basic
pubDate: date field defaults to display_date
itemCategory: jmespath for category mapping headlines.basic
includeContent: number of paragraphs to include 0-10, all

promoItemsJmespath: jmespath to promo_items (promo_items.basic || promo_items.lead_art)
resizerKVP: key value pair of width and or height to use with the resizer
imageTitle defaults to title
imageCaption defaults to caption
ImageCredits defaults to credits.by[].name

### Usage
