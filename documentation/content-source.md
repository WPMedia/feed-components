# Content Source

This block is used to call external API's, like Content API or Site-Service API. A content source can also be used to call a third party service like Chartbeat or Google Analytics. The feeds-source-content-api-block calls Content-API and returns a results set. You can find the fusion content source documentation [here](https://redirector.arcpublishing.com/alc/arc-products/pagebuilder/fusion/documentation/recipes/defining-content-source.md?version=2.6).

## CONTENT_BASE

The content source uses the CONTENT_BASE environment variable that is set in environment/index.js. It should look like `https://api.ORG.arcpublishing.com` where ORG is your Organization name in Arc. For example if your org name was demo then you can use:

- demo - this will use your production environment
- sandbox.demo - this will use your sandbox environment

When running locally this value should be set in your `.env`.

# exports

Each content source must have either a resolve or a fetch function that will be called by fusion. In addition all parameters must be exported under the params key:

```javascript
export default {
  resolve,
  schemaName: 'feeds',
  params: {
    Section: 'text',
    Author: 'text',
    Keywords: 'text',
  },
}
```
