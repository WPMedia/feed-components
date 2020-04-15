# Feeds

The repo contains the work to migrate partner feeds to fusion compatible blocks. Mono repo workflow managed using tools from this [Monorepo Guide](https://monorepo.guide/).

## Requirements

Make you you have [`yarn` classic](https://classic.yarnpkg.com/en/) installed.

## Local Development

1. Clone the the [skeleton-fusion-feeds](https://github.com/WPMedia/skeleton-fusion-feeds) project and follow the setup instructions
2. In this repository, `cd` into the package(s) you'd like to test, then run `yarn link`
3. In the skeleton repository, run `npm link "@wpmedia/package-name"` (name will be output by `yarn link`)
4. Verify package linked correctly. In the skeleton repository, there should be a symlink for your package in `node_modules`
5. In `skeleton-fusion-feeds`, add the package you are testing to the `blocks.json` blocks array
6. Set `useLocal` in `blocks.json` to `true`

## Caveats/Gotchas

For a currently unknown reason, the package linking **does not work** correctly when importing that module in any output type component.

## Preferred Architecture

If possible, feed logic should be contained in a fusion `feature` component.

Leverage the infratructure setup by the themes team, by putting code in corresponding fusion component folders. See `packages/sitemaps` for an example.