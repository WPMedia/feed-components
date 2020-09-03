# video-sitemap

The video-sitemap format returns sitemap for Videos

## Custom Fields

- lastMod - The date field to use to display the lastmod. It will get only the date from the first article returned and repeat that date for every link. Defaults to `last_updated_date`

- videoTitle - The field to use to describe video: theoptions are `description and subheadlines basic`
- videoKeywords - The field to use to get keywords from taxonomy: the options are seo_keywords or tags
- videoSelect - object used to search streams for video encoding default: { bitrate: 5400, stream_type: 'mp4' }
- includePromo - Include an image in Sitemap
- lastMod - The date field to use to display the lastmod.
- priority - What is the priority of the sitemap
- changeFreq - What is the change frequency of the Sitemap
