# Content-API content source

Creates an ElasticSearch DSL syntax to query Content-API

## Globals

- CONTENT_BASE
- feedDefaultQuery

## Parameters

- Section: Comma separated list of sections, maps to taxonomy.sections.\_id
- Author: Maps to credits.by.\_id
- Keywords: Maps to taxonomy.seo_keywords. It can be a comma separated list of values
- Tags-Text: Maps to taxonomy.tags.text. It can be a comma separated list of values
- Tags-Slug: Maps to taxonomy.tags.slug
- Include-Terms: If you don’t want to use the default query you can enter a query here. It must be an array formatted like `[{"term":{"type": "story"}},{"range":{"last_updated_date:{"gte":"now-2d","lte":"now"}}}]`
- Exclude-Terms: If you need to exclude terms in your query (NOT) enter them here as an array formatted the same as the Include-Terms
- Exclude-Sections: Comma separated list of sections to exclude, maps to taxonomy.sections.\_id
- Feed-Size: Integer 1 to 100. Defaults to 100
- Feed-Offset: Integer. Defaults to 0
- Sort: Comma separated list of fields to sort on. Defaults to `publish_date:desc`
- Source-Exclude: ANS fields to remove from \_sourceIncludes default values
- Source-Include: ANS fields to add to \_sourceIncludes default values
- Sitemap-at-root: (string) if set replaces all '-' with '/' in Section field
- Include-Distributor-Name: pass to C-API only one distributor field can be set
- Exclude-Distributor-Name: pass to C-API only one distributor field can be set
- Include-Distributor-Category: pass to C-API only one distributor field can be set
- Exclude-Distributor-Category: pass to C-API only one distributor field can be set

### Usage

Default query: [{"term":{"type": "story"}},{"range":{"last_updated_date":{"gte":"now-2d","lte":"now"}}}]
You can create a feedDefaultQuery in blocks.json to override the default query.
If no value in passed in Include-Terms the default query will be used.

The `/content/v4/search/published` content-api is used
