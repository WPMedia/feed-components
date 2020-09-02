# Sitemap Index

The sitemap-index format returns paginated links to another format, usually sitemap. Content-API only returns 100 articles at a time. If they want to include all articles for a day that could be more than 100 articles. This will return a link to each set of 100 articles.

This format works by taking the count returned from the Content-API results set and looping throught that by 100 and generating links with the ?from= parameter.

This will require that the resolver for the feed it is linking to supports the from parameter.

## Custom Fields

- lastMod - The date field to use to display the lastmod. It will get only the date from the first article returned and repeat that date for every link. Defaults to `last_updated_date`

- feedPath - The path to the format to use. Defaults to `/arcio/sitemap/`

- feedName - The name of the feed used in the resolver. Defaults to `/sitemap-index/` This is used to split the requestURI to get anything in the path after the feed like a section. If a request is made using `/arc/outboundfeeds/sitemap-index/category/sports`. This will be split on `/sitemap-index/` which results in an array of `['/arc/outboundfeeds', 'category/sports']` the second array element, if any, will be appended to the generated sitemap url.
