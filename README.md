# Feeds

The repo contains the work to migrate partner feeds to [arc-fusion](https://github.com/WPMedia/fusion) compatible [blocks](https://github.com/WPMedia/fusion-news-theme-blocks).
This [Monorepo](https://monorepo.guide)'s versioning and changelogs are managed by tools from [changsets](https://github.com/atlassian/changesets) and [lerna](https://github.com/lerna/lerna). Once a block's development is complete, it is published to wapo's private github NPM registry where it can be used in clients feature pack repos.

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

1. link the block to make it available to the skeleton repo. From the blocks/{feature} directory run `npm link`
2. Clone the [skeleton-fusion-feeds](https://github.com/WPMedia/skeleton-fusion-feeds) project and follow the setup instructions
3. In `skeleton-fusion-feeds`, add the package you are testing to the `blocks.json` blocks array
4. Set `useLocal` in `blocks.json` to `true`
5. In `skeleton-fusion-feeds`, run `npx fusion start-theme --links`
6. When you are ready to create the PR create a changeset with `yarn changeset add` It will allow you to select which changes you want to include and designate them as major, minor or patch. Add any of the changeset files that were generated to the commit. There is a github action that will handle publishing the package once the PR is merged to master.

## Caveats/Gotchas/Workaround

For a currently unknown reason, the package linking **does not work** correctly when importing that module in any output type component. An error of the following kind gets thrown when trying to link the output component
`Error: EROFS: read-only file system, open '/opt/engine/bundle/linked_modules/@wpmedia/sitemaps-xml-block/output-types/xml.js'`
If you need to work on creating an output block, put the content of the output block within `skeleton-fusion-feeds` output component with a name that corresponds to the feature block's name.
For example if you have a feature file with in your block named `xml.js` create an output component called `xml.js`.

This monorepo now provides an `xml-output` package to help create a valid output type in a fusion bundle.

## Shared Modules

Some features use the same logic, so we've added the ability to create shared modules in this monorepo. These modules live in `utils`. We keep them separate in order to distinguish which packages are fusion themes blocks.

We weren't able to find a solution to use the `npm link` approach with shared modules. Instead, we'll use prerelease versions to denote "development" versions of these modules:

- **Before you start work on a shared module, enter prerelease mode.** To enter prerelease mode, run `yarn changeset pre enter {tag}` (see the [changesets prerelease documentation](https://github.com/atlassian/changesets/blob/master/docs/prereleases.md) for more information). To be clear who is doing the development, suggest using your initials as the tag. The packages will be published as `1.0.1-cw.0`.

- Use changesets as normal (`changeset add`). When you are ready to publish a prerelease, do a npm run build from the root of the repo, then `changeset version` and then `changetset publish`. Once you have a prerelease version published, you can update block dependencies to use it. You may also need to run these commands with a `GITHUB_TOKEN` env variable (which should be a [personal Github token](https://github.com/settings/tokens)). **Before you publish, run `npm run build` from the monorepo root directory.**

- To test these prereleases in the skeleton, you need to run `npm install` in the block's directory. The block linking does not work properly unless the `package-lock.json` file is correctly updated.

- When you are done testing locally, run `changeset pre exit` to exit prerelease mode. Commit the changesets you created during the prerelease mode. _DO NOT_ run `changeset version` or `changeset publish` once leaving prerelease mode. Add the changeset files to you commit and create the PR. There is a github action that will publish the package and handle versioning.
