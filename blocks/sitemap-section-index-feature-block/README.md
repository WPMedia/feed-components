# Sitemap-Section-Index

Sitemaps provide search engines with metadata regarding the specific news content on a website. Using the Sitemap, bots can quickly find the news articles contained on a site
This Sitemap identifies the url of every section in Site Service.

This feed can be used to generate links to sitemaps like

`http://wwww.example.com/arc/outboundfeeds/sitemap/category/{category}/`

or it can be used to generate links to sitemaps at root like

`http://wwww.example.com/sitemap-category-{category}.xml`

Requires a Site Service Content Source like this one from themes
"@wpmedia/site-hierarchy-content-block"

## Custom Fields

- feedPath - path to use to call feed used to display sitemap. default - /arc/outboundfeeds/sitemap/category
- feedAtRoot - boolean should it replace / for -
- feedExtension - add extention like .xml to end of url || /
- feedParam - Additional params to add to sitemap request. default - outputType=xml
- excludeSections - sections to exclude from results
