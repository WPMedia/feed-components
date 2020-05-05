# Feeds

The repo contains the work to migrate partner feeds to [arc-fusion](https://github.com/WPMedia/fusion) compatible [blocks](https://github.com/WPMedia/fusion-news-theme-blocks).
This [Monorepo](https://monorepo.guide)'s versioning and changelogs are managed by tools from [changset](https://github.com/atlassian/changesets) and [yarn](https://classic.yarnpkg.com/en/docs/cli/workspaces/). Once a block's development is complete, it is published to wapo's private github NPM registry where it can be used in clients feature pack repos.

## Standard Out Of the Box Feeds

The most commonly used feeds from partner-feeds will be migrated to fusion as blocks. This work is in progress and each feed will be built in order of usage.

- sitemap
- news-sitemap
- video-sitemap
- sitemap-index
- rss
- google-news-feed
- fb-ia
- msn
- flipboard
- apple-news

Each feature will have customFields to configure the feeds to meet the most common customization requests. If a client needs a customization that is beyond what can be achieved with the customFields they will have to fork the repo and build a custom version.

## Block Architecture

If possible, feed logic should be contained in a fusion `feature` component.

Leverage the infrastructure setup by the themes team, by putting code in corresponding fusion component folders. See `blocks/sitemaps-feature-block` for an example.

```
blocks
   │
   └───facebook-feed-block
       │
       └───features
           │
           └───facebook-feed
               |
               xml.js
```

## Requirements

Make sure you have [`yarn` classic](https://classic.yarnpkg.com/en/) installed.

## Local Development

1. Clone the the [skeleton-fusion-feeds](https://github.com/WPMedia/skeleton-fusion-feeds) project and follow the setup instructions
2. In this repository, `cd` into the package(s) you'd like to test, then run `yarn link`
3. In `skeleton-fusion-feeds`, add the package you are testing to the `blocks.json` blocks array
4. Set `useLocal` in `blocks.json` to `true`
5. In `skeleton-fusion-feeds`, run `npx fusion start-theme --links` to test your changes
6. Write tests for your block
7. Create a changeset `yarn changeset`

## Caveats/Gotchas/Workaround

For a currently unknown reason, the package linking **does not work** correctly when importing that module in any output type component. An error of the following kind gets thrown when tryjng to link the output component
`Error: EROFS: read-only file system, open '/opt/engine/bundle/linked_modules/@wpmedia/sitemaps-xml-block/output-types/xml.js'`
If you need to work on creating an output block, put the content of the output block within `skeleton-fusion-feeds` output component with a name that corresponds to the feature block's name.
For example if you have a feature file with in your block named `xml.js` create an output component called `xml.js`
