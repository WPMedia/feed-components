# RSS Alexa

Either text content that Alexa reads to the customer or audio content that Alexa plays to the customer.

## Globals

feedTitle
feedLanguage
feedDomainURL
feedResizer

## Custom Fields

enclosure: defaults to mp3 type.

channelTitle: defaults to global website name
channelDescription: defaults to global website name + "News Feed"
channelCopyright: defaults to Copyright YYYY global website name
channelTTL: number of mins, defaults to 1
channelCategory: optional
channelLogo: Should be a url to their logo, optional

itemTitle: jmespath for title mapping headlines.basic
itemCategory: jmespath for category mapping headlines.basic
includeContent: number of paragraphs to include 0-10, all

pubDate: date field defaults to display_date

### Usage
