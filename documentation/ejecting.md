# Ejecting a block

To do local development of a feed, either modifying an existing block or creating your own will follow the standard fusion development pattern. Using a local repository add files into the components and content directories, run fusion locally and build pages and templates using your new components.

If you want to start with an existing feed block you need to download it and add it to your repo. This is called "ejecting the block."

## download the block

Although blocks are just npm packages, they are not installed in the typical way a npm package would be. They are only loaded at run time by the @arc-fusion/cli. You can confirm this by doing an `npm list` in your local repo.

To get a block locally, get the block name from [blocks.json](./blocks.json.md) and use npm to install the package. For this example we will use "@wpmedia/rss-feature-block"
`npm install @wpmedia/rss-feature-block`

If that was successful you now have the package downloaded to your node_modules directory. You can confirm that by listing the contents of your node_modules
`ls mode_modules/@wpmedia/rss-feature-block`

You should see a directory listing like:

```
CHANGELOG.md
README.md
features/
   │
   └───rss
       │
       └───__snapshots__
        xml.js
        xml.test.js
index.js
package.json
```

The `rss` directory needs to be copied to the components/features directory. You should rename it to distinguish it from the Feed Block you copied it from. Your components directory should look like:

```
components
   │
   └───features
        │
        └───customRSS
            │
            └───__snapshots__
             xml.js
             xml.test.js
```

In the xml.js file, there is an assignment of the objects label

```javascript
Rss.label = 'RSS Standard'
```

That is the name that will appear when the PageBuilder Editor lists all features. Change the label to something meaningful. The xml.js file should not be renamed. It needs to be named for the outputType that should be used to generate it.

## dependencies

Compare the blocks package.json dependencies with your repos package.json and add anything missing to your repos package.json.
