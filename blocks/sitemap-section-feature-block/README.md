# Sitemap-Section

Sitemaps provide search engines with metadata regarding the specific news content on a website. Using the Sitemap, bots can quickly find the news articles contained on a site.
This Sitemap identifies the url of every section in Site Service.

This feed can be used to generate links to section fronts like

`http://wwww.example.com/{category}/`

Requires a Site Service Content Source like this one from themes
"@wpmedia/site-hierarchy-content-block"

## Custom Fields

- feedPath - path to use to call feed used to display sitemap. default - /arc/outboundfeeds/sitemap/category
- feedParam - Additional params to add to sitemap request. default - outputType=xml
- excludeSections - sections to exclude from results
- excludeLinks - exclude links from output
- priority - What is the priority of the sitemap
- changeFreq - What is the change frequency of the Sitemap
