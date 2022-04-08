# Sitemap Index By Day

sitemap index by day is intended to generate large sitemaps going back weeks, months or years. It consists of three formats, sitemap-index-by-day, sitemap-by-day and sitemap with a date in the path (just a new resolver).

The sitemap-index-by-day format returns one link to sitemap-by-day for each day, starting with the current day which is called 'latest' and going back the number of days specified (defaults to 7). Each link should be to sitemap-by-day where the link looks like /arc/outboundedfeeds/sitemap-by-day/2021-04-06?outputType=xml.

This format works by using the customField maxDays. It does not use a content source so it should be created as a page. It starts with the current day and decrements the day by 1 until it's looped through maxDays. Optionally you can enter a date in YYYY-MM-DD format to use as the last day. Links with the date look like /arc/outboundfeeds/sitemap-by-day/YYYY-MM-DD.

Since this format doesn't need a content source, it can be created as a page.

## Custom Fields

- numberOfDays - The number of links (days back) to generate. Optionally if a valid date is entered in YYYY-MM-DD format it will be used to calculate the maxDays.

- feedPath - kvp of number of days and the path to use
  Defaults to { 0:'/arc/outboundfeeds/sitemap/', 2:'/arc/outboundfeeds/sitemap2', 7:'/arc/outboundfeeds/sitemap3'}

- feedName - The name of the feed used in the resolver. Defaults to `/sitemap-index/` This is used to split the requestURI to get anything in the path after the feed like a section. If a request is made using `/arc/outboundfeeds/sitemap-index/category/sports`. This will be split on `/sitemap-index/` which results in an array of `['/arc/outboundfeeds', 'category/sports']` the second array element, if any, will be appended to the generated sitemap url.

- feedExtension - file extention like .xml to add to urls, otherwise they end in '/'
- feedParams - optional url parameters separated with '&' no leading '?'
- feedDates2Split - kvp of dates to split and number of splits like
  { '2022-03-14': '2'} to create /sitemap/2022-03-14-1, sitemap/2022-03-14-2
