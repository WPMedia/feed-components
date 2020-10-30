# Setup a new Outbound Feeds repo

This is a fusion themes based repository and is intended to be used as the starting point for using _Arc Outboundfeeds_. It doesn't matter if a client is currently using themes or not. This repo will be used to run Outbound feeds in its own dedicated environment.

## Setup

Pre-requisites:

- node / npm installed (node version > 10).
- github personal access token with `read:packages` access and sso enabled for WPMedia
- docker

1. Create a template of this repo. Go to https://github.com/wapopartners/outboundfeeds-skeleton and click on the green "Use this template" button to create a new client repo. Name the new repo starting with the clients name like "ORG-outboundfeeds". Only include the prod branch. Once the new repo has been created, clone it to your local machine.

```
git clone git@github.com:wapopartners/ORG-outboundfeeds.git
```

2. Create a `.npmrc` in the projects root directory with your github access token. This file is in the .gitignore file and should never be checked into github.

```
@wpmedia:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken={ YOUR AUTH TOKEN HERE }
```

3. Install the packages

```
npm install
```

4. Create .env

   Copy env.example to .env and edit the file to replace the placeholders with your correct values.

   - CONTENT_BASE - Set your org in CONTENT_BASE [ALC](https://redirector.arcpublishing.com/alc/arc-products/pagebuilder/fusion/documentation/recipes/defining-arc-content-source.md#configuring-content_base-and-arc_access_token-for-local-development)
   - ARC_ACCESS_TOKEN - your readonly developer token. [ALC](https://redirector.arcpublishing.com/alc/arc-products/developer/user-documentation/accessing-the-arc-api/?product=)
   - resizerKey - your orgs resizerKey. If you don’t have it, please contact your Technical Delivery Manager (TDM)
   - BLOCK_DIST_TAG - To use production blocks, set this to 'stable', to use the most recent release use 'beta'

   The .env file is in .gitignore and should never be checked into github.

Run Fusion locally see [here](https://redirector.arcpublishing.com/alc/arc-products/pagebuilder/fusion/documentation/recipes/running-fusion-locally.md) for more details:

```
npx fusion start
```

Once fusion has finished starting you should be able to to get to the pagebuilder editor [pages](http://localhost/pagebuilder/pages) and [templates](http://localhost/pagebuilder/templates) to add and configure feeds locally.

Run tests with:

```
npm test
```

Run the linter with:

```
npm run lint
```

5. Once you are ready to deploy the bundle you will need to setup environment variables in the `environment/org-outboundfeeds.js` and or `environment/org-outboundfeeds-sandbox.js` files. Use the values from your local .env to set the `CONTENT_BASE` and `resizerKey`. Renamed the files replacing the clients org name with the `org` in the current names. Any values that should not be made public need to be [encrypted](https://redirector.arcpublishing.com/alc/arc-products/pagebuilder/fusion/documentation/recipes/using-environment-secrets.md).

Once you are ready to [deploy](https://staging.arcpublishing.com/alc/arc-products/pagebuilder/fusion/documentation/recipes/deploying-feature-pack.md) a bundle run the zip command.

```
npx fusion zip
```

For more information on developing outbound feeds:

- [documentation](documentation/README.md)
