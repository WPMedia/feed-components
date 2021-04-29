# Sitemap-Section-Index

Sitemaps provide search engines with metadata regarding the specific news content on a website. Using the Sitemap, bots can quickly find the news articles contained on a site
These Sitemap identify the url of every section in Site Service.

Requires a Site Service Content Source like this one from themes
"@wpmedia/site-hierarchy-content-block"

## Custom Fields

- feedPath - path to use to call feed used to display sitemap. default - /arc/outboundfeeds/sitemap/category
- feedParam - Additional params to add to sitemap request. default - ?outputType=xml
- excludeSections - sections to exclude from results
