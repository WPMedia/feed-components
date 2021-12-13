# `@wpmedia/story-feed-querybuilder-content-source-block`

_Content source block for for use with PB Editor/queryBuilder integration. It QB integration will cause a content source with a queryBuilder property to trigger the queryBuilder component to all the configuration of ES queries. When used with the integration component, the parameters will not be displayed to the user._

// TODO: add badge for passing/failing tests

## Acceptance Criteria

- Add AC relevant to the block

## Endpoint

- /content/v4/search/published?body={queryBody}&{queryParams.join('&')}

## ANS Schema

This returns a story feed. The GraphQL schema for story feeds can be found [here](https://github.com/wapopartners/core-components/blob/dev/packages/content-schema_ans-feed-v0.6.2/src/index.js).

## Configurable Params

| **Param**       | **Type** | **Description**                                                   |
| --------------- | -------- | ----------------------------------------------------------------- |
| **queryName**   | text     | The name of the query from queryBuilder                           |
| **queryBody**   | text     | string of ElasticSearch DSL query used with ?body= parameter      |
| **queryParams** | text     | string of Content-API query parameters; sort, size, from, website |
| **arcQL**       | text     | string of queryBuilder internal state                             |

## TTL

- `300`

## Additional Considerations

_This content source should only be added to blocks.json one the queryBuilder integration is available._
