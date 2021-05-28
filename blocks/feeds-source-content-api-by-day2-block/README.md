# Content-API By Day2 content source

Creates an ElasticSearch DSL syntax to query Content-API limited to a single day. This is
for sitemap/YYYY-MM-DD formats with 1 hour TTL (3600).

## Globals

- CONTENT_BASE

## Parameters

- dateField: ANS date field to use in range statement
- dateRange: date to use in YYYY-MM-DD format or 'latest' for today. latest is used instead of generating today's date because of the chance that the process making the request (fusion) is in a different tz then the ES cluster.
- Include-Terms: If you don’t want to use the default query you can enter a query here. It must be an array formatted like `[{"term":{"type": "story"}},{"range":{"last_updated_date:{"gte":"now-2d","lte":"now"}}}]`
- Exclude-Terms: If you need to exclude terms in your query (NOT) enter them here as an array formatted the same as the Include-Terms
- Feed-Size: Integer 1 to 100. Defaults to 100
- Feed-Offset: Integer. Defaults to 0
- Source-Exclude: ANS fields to exclude from the response. Defaults to `related_content`
- Sort: Comma separated list of fields to sort on. Defaults to `publish_date:desc`
- Include-Distributor-Name: distributor name, only the first populated distributor field will be used
- Exclude-Distributor-Name: distributor name, only the first populated distributor field will be used
- Include-Distributor-Category: distributor category, only the first populated distributor field will be used
- Exclude-Distributor-Category: distributor category, only the first populated distributor field will be used

### Usage

Default query: [{"term":{"type": "story"}}]
range is passed from dateField and dateRange.
latest:
{range: {gte: YYYY-MM-DD, lte: now}} YYYY-MM-DD is calculated from now - 1
YYYY-MM-DD:
{range: {gte: YYYY-MM-DD, lte: YYYY-MM-DD}}

If no value in passed in Include-Terms the default query will be used.

The `/content/v4/search/published` content-api is used
