# Content-API content source

Creates an ElasticSearch DSL syntax to query Content-API

## Globals

- CONTENT_BASE
- feedDefaultQuery

## Parameters

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

Default query: [{"term":{"type": "story"}},{"range":{"last_updated_date:{"gte":"now-2d","lte":"now"}}}]
You can create a feedDefaultQuery in blocks.json to override the default query.
If no value in passed in Include-Terms the default query will be used.

The `/content/v4/search/published` content-api is used
