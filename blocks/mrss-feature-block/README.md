# MRSS

Intended for videos. Uses media:content tag with additions of
<media:keywords>
<media:transcript>
<media:category>

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
itemCategory: jmespath for category (eg. taxonomy.primary_section.name), defaults to no category
includeContent: number of paragraphs to include 0-10, all

promoItemsJmespath: Hard coded to \* since all content is assumed to be videos
resizerKVP: key value pair of width and or height to use with the resizer
imageTitle: defaults to title
imageCaption: defaults to caption
ImageCredits: defaults to credits.by[].name

selectVideo: This criteria is used to filter videos encoded in the streams array, defaults to
`{ bitrate: 5400, stream_type: 'mp4' }`

### Usage
