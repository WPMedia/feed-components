# OBF block development

Themes allows you to easily use the existing Arc OutboundFeeds (OBF) blocks in your repo by listing them
in [blocks.json](./blocks.json.md). Themes also makes it possible to modify the Arc OBF Blocks to change the way they work, or to create completely new custom feeds. Because OBF is based on themes which is based on fusion, a basic understanding of the [fusion development process](https://redirector.arcpublishing.com/alc/arc-products/pagebuilder/fusion/documentation/recipes/intro.md?version=2.6) is recommended. But don't worry, even if you are not currently using themes, you can still use OBF.

## Blocks

Outbound Feeds is based on blocks, which are just npm packages. A block can be any fusion component or content. OBF blocks are either features which generate the output and end with "-feature-block" or they are content sources which call API's to get data and start with "feeds-source-". There is a third type, a custom output-type, but it is not technically a block.

## features

All OBF feeds are features intended to be the only thing on a page or template. No layout or other components need to added to the page. The feature blocks have the following structure.

```
CHANGELOG.md
README.md
features/
   │
   └───rss
       │
       __snapshots__
        xml.js
        xml.test.js
index.js
package.json
```

In the features directory is a single directory holding the feature code and tests. The feature code will always be called xml.js. The feature code returns an object that gets converted to xml by the output-type.

Each feed block is organized using the same structure which is described in [feature-block](./feature-block.md). Feed blocks use several javascript [dependencies](./dependencies.md) to make it easier to work with ANS and xml. To reduce the amount of duplicate code a set of [utilities](./utilities.md) has been created that can be used in any block.

## content sources

All feeds are designed to work with globalContent returned as a "results set", an object with a content_elements array of content. Usually this content comes from Content-API. For this we have the feeds-source-content-api-block [content source block](./content-source.md).

## output-types

There is a npm package for the xml [output-type](./output-types.md) called "@wpmedia/feeds-xml-output", but it must be used like a regular npm package by listing it as a dependency in the package.json.

If you want to modify a block you will first need to download it from the npm registry and copy it into your repo. This is known as [ejecting](./ejecting.md) a block. Once the code is in your local repo it will no longer receive updates from Arc.
