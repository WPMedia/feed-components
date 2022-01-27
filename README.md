# Feed-Components

This is the lerna-managed monorepo for the blocks that make up Outbound Feeds (OBF).

This repo contains the OBF Blocks, utilities and their dependencies.  It is used by the Arc I/O team to develop OBF.  Clients do not need this repo to use OBF or run OBF locally.  We have made this repo available so you can see the code and to copy it if you would like to create custom blocks.

The steps to download and build your local OBF repo are [here](https://redirector.arcpublishing.com/alc/arc-products/arcio/user-docs/setup-a-new-outbound-feeds-repo/)

You can find more information about custom development in [ALC](https://redirector.arcpublishing.com/alc/arc-products/arcio/dev/)

## Blocks

All of the published blocks are located in the blocks directory.  Each block mirrors the structure of the component in the fusion repo.  For example, a feature block will have a features directory and a source block will have a sources directory. More details can be found [here](https://redirector.arcpublishing.com/alc/arc-products/arcio/user-docs/feature-blocks-architecture/)

All content source blocks start with feeds-source.  If the block has the work output in the name it is an output type.  All other blocks are feature blocks.  The xml output type can be found in the utils directory.  It is not included in the blocks.json, instead it's loaded via the repos package.json.  More details can be found [here](https://redirector.arcpublishing.com/alc/arc-products/arcio/user-docs/outbound-feeds-development-content-source/)

## Utils

There are a set of common utilities used in the blocks.  These are located in the utils directory.  Each is it's own NPM package that the blocks add as dependencies.  If you copy a block to your repo, be sure to add any dependencies required by the block to your OBF repo's package.json. More details can be found [here](https://redirector.arcpublishing.com/alc/arc-products/arcio/user-docs/outbound-feeds-development-utilities/)

## Custom Development

If you would like to create a custom block, you can start with one of the existing OBF blocks or create something new.  More details can be found [here](https://redirector.arcpublishing.com/alc/arc-products/arcio/user-docs/ejecting-a-block/)

