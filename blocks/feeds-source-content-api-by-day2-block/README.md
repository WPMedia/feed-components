# Content-API By Day2 content source

Creates an ElasticSearch DSL syntax to query Content-API limited to a single day. This is
for sitemap/YYYY-MM-DD formats with 1 hour TTL (3600).

## Globals

- CONTENT_BASE
- feedDefaultQuery

## Parameters

- dateField: ANS date field to use in range statement
- dateRange: date to use in YYYY-MM-DD format or 'latest' for today. latest is use instead of generating todays date because of the chance that the process making the request (fusion) is in a different tz then the ES cluster.
- Section: Maps to taxonomy.sections.\_id. It needs to start with a slash “/news”
- Author: Maps to credits.by.\_id
- Keywords: Maps to taxonomy.seo_keywords. It can be a comma separated list of values
- Tags-Text: Maps to taxonomy.tags.text. It can be a comma separated list of values
- Tags-Slug: Maps to taxonomy.tags.slug
- Include-Terms: If you don’t want to use the default query you can enter a query here. It must be an array formatted like `[{"term":{"type": "story"}},{"range":{"last_updated_date:{"gte":"now-2d","lte":"now"}}}]`
- Exclude-Terms: If you need to exclude terms in your query (NOT) enter them here as an array formatted the same as the Include-Terms
- Feed-Size: Integer 1 to 100. Defaults to 100
- Feed-Offset: Integer. Defaults to 0
- Source-Exclude: ANS fields to exclude from the response. Defaults to `related_content`
- Sort: Comma separated list of fields to sort on. Defaults to `publish_date:desc`

### Usage

Default query: [{"term":{"type": "story"}}]
range is passed from dateField and dateRange.
latest:
{range: {gte: YYYY-MM-DD, lte: now}} YYYY-MM-DD is calculated from now - 1
YYYY-MM-DD:
{range: {gte: YYYY-MM-DD, lte: YYYY-MM-DD}}

You can create a feedDefaultQuery in blocks.json to override the default query.
If no value in passed in Include-Terms the default query will be used.

The `/content/v4/search/published` content-api is used
