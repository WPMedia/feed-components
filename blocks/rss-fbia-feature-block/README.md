# Facebook Instant Articles

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

includePromo: bool to include promo image
promoItemsJmespath: jmespath to promo_items (promo_items.basic || promo_items.lead_art)
resizerKVP: key value pair of width and or height to use with the resizer
imageTitle: defaults to title
imageCaption: defaults to caption
ImageCredits: defaults to credits.by[].name

articleStyle: This parameter is optional and your default style is applied to this article if you do not specify an article style in your markup
likesAndComments: Enable or disable, defaults to disable
adPlacement: Enables automatic placement of ads within this article. This parameter is optional and defaults to false if you do not specify
adDensity: How frequently you would like ads to appear in your article: default (<250 word gap), medium (350 word gap), low (>450 word gap)
placementSection: Enter Javascript that goes between <section class="op-ad-template"></section> in beginning of the body\'s header for recirculation ads that come from Facebook advertisers; leave blank if not used.,
adScripts: Enter third party scripts wrapped in a <figure class=‘op-tracker’> tag. It will be added to the end of the article body. Multiple scripts can be included, usually each in its own iframe. If you need to reference data from the ANS content, use place holders in the format of <<ANS_field>> like <<taxonomy.primary_section.\_id>>
`<figure class="op-tracker"><iframe><script>console.log("_id=<<_id>> headlines=<<headlines.basic>> primary_section=<<taxonomy.sections[0]._id>> junk=<<invalid.field>> empty=<<>>");</script></iframe></figure>`
iframeHxW: Height and/or width to use in oembed iframes
raw_html_processing: should raw_html be excluded, included or wrapped in <figure><iframe> tags

### Usage

To use this feature in your repo, add the dependencies to your repos package.json
"jmespath": "^0.15.0",
"moment": "^2.24.0",
"xmlbuilder2": "^3.1.1",
For xmlbuilder2 be sure to use version <= 2.1.7 or >= 3.0.0
