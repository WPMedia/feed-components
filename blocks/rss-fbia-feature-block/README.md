# Facebook Instant Articles

## Globals

feedTitle
feedLanguage
feedDomainURL
feedResizer

## Custom Fields

channelTitle: defaults to global website name
channelDescription: defaults to global website name + "News Feed"
channelPath: defaults to /arcio/fb-ia/
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

includePromo: bool to include promo image
imageTitle: defaults to title
imageCaption: defaults to caption
ImageCredits: defaults to credits.by[].name

articleStyle: This parameter is optional and your default style is applied to this article if you do not specify an article style in your markup
likesAndComments: Enable or disable, defaults to disable
adPlacement: Enables automatic placement of ads within this article. This parameter is optional and defaults to false if you do not specify
adDensity: How frequently you would like ads to appear in your article: default (<250 word gap), medium (350 word gap), low (>450 word gap)
placementSection: Javascript for recirculation ad placement; leave blank if not used. To obtain placement ID, sign up with Facebook Audience Network.
adScripts: Javascript can be added to the article for ads and analytics. Multiple scripts can be included, usually each in the own iframe

### Usage
