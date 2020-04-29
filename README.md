# Feeds

The repo contains the work to migrate partner feeds to [arc-fusion compatible blocks](https://github.com/WPMedia/fusion)
This [Monorepo](https://monorepo.guide)'s is versioning and changelogs are managed by tools from [changset](https://github.com/atlassian/changesets).
The changesets workflow is designed to help from when people are making changes, all the way through to publishing. It lets contributors declare how their changes should be released, then we automate updating package versions, and changelogs, and publishing new versions of packages based on the provided information.

Changesets has a focus on solving these problems for multi-package repositories, and keeps packages that rely on each other within the multi-package repository up-to-date, as well as making it easy to make changes to groups of packages.

## Requirements

Make sure you have [`yarn` classic](https://classic.yarnpkg.com/en/) installed.

## Local Development

1. Clone the the [skeleton-fusion-feeds](https://github.com/WPMedia/skeleton-fusion-feeds) project and follow the setup instructions
2. In this repository, `cd` into the package(s) you'd like to test, then run `yarn link`
3. In `skeleton-fusion-feeds`, add the package you are testing to the `blocks.json` blocks array
4. Set `useLocal` in `blocks.json` to `true`
5. In `skeleton-fusion-feeds`, run `npx fusion start-theme --links`

## Caveats/Gotchas/Workaround

For a currently unknown reason, the package linking **does not work** correctly when importing that module in any output type component. An error of the following kind gets thrown when tryjng to link the output component
`Error: EROFS: read-only file system, open '/opt/engine/bundle/linked_modules/@wpmedia/sitemaps-xml-block/output-types/xml.js'`
If you need to work on creating an output block, put the content of the output block within `skeleton-fusion-feeds` output component with a name that corresponds to the feature block's name.
For example if you have a feature file with in your block named `xml.js` like

```
blocks
   │
   └───facebook-feed-block
   │
   └───features
   │
   └───facebook-feed
   |      xml.js

```

create an output component called `xml.js`

## Preferred Architecture

If possible, feed logic should be contained in a fusion `feature` component.

Leverage the infrastructure setup by the themes team, by putting code in corresponding fusion component folders. See `blocks/sitemaps-feature-block` for an example.
