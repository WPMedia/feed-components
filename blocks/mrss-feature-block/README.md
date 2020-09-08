# RSS

## Globals

feedTitle
feedLanguage
feedDomainURL
feedResizer

## Custom Fields

channelTitle: defaults to global website name
channelDescription: defaults to global website name + "News Feed"
channelPath: defaults to /arc/outboundfeeds/mrss/
channelCopyright: defaults to Copyright YYYY global website name
channelTTL: number of mins, defaults to 1
channelUpdatePeriod: update period hours, days, weeks, months, years. Defaults to hours
channelUpdateFrequency: Number, defaults to 1
channelCategory: optional
channelLogo: Should be a url to their logo, optional

itemTitle: jmespath for title mapping headlines.basic
itemDescription: jmespath for description mapping description.basic
pubDate: date field defaults to display_date
itemCategory: jmespath for category (eg. taxonomy.primary_section.name), defaults to no category
includeContent: number of paragraphs to include 0-10, all

includePromo: bool to include promo image
imageTitle: defaults to title
imageCaption: defaults to caption
ImageCredits: defaults to credits.by[].name

selectVideo: This criteria is used to filter videos encoded in the streams array, defaults to
`{ bitrate: 5400, stream_type: 'mp4' }`

### Usage
