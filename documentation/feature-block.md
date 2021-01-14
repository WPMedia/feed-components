# OBF block development - Feature Blocks Architecture

There are three parts that make up each feature.

- Template function that generates the object that represents the xml
- The function that is called by fusion
- The customField and label assignments

## Template function

This function is passed all the customFields, global variables and globalContent and it returns an object that represents the xml output. By using an object to represent the xml it makes it clear where data comes from and how it gets represented in the final output.

```javascript
const rssTemplate = (
  elements,
  { ...customfields and environment variables... },
  ) => ({
    rss: {
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      '@xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
      '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
      '@xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
      '@version': '2.0',
      ...(includePromo && {
        '@xmlns:media': 'http://search.yahoo.com/mrss/',
      }),
    }})
```

This is an example of the root element of an rss feed is being created. The keys that start with an `@` are used by [xmlbuilder](./dependencies.md#xmlbuilder2) and will become attributes of the `<rss>` tag. The spread (...) statement will be evaluated and if it returns a falsey value it will be excluded.

## main function

This is the function called by fusion. It's exported so fusion can make it available. This function gets passed the global content, customFields and website. It can also get passed other values like `requestUri`. The function gets any needed siteProperties, defines any functions used by the template and returns the template to generate the feed.

```javascript
export function Rss({ globalContent, customFields, arcSite }) {
  const {
    resizerURL = '',
    feedDomainURL = '',
    feedTitle = '',
    feedLanguage = '',
  } = getProperties(arcSite)

  const rssBuildContent = new BuildContent()

  // can't return null for xml return type, must return valid xml template
  return rssTemplate(get(globalContent, 'content_elements', []), {
    ...customFields,
    resizerURL,
    domain: feedDomainURL,
    feedTitle,
    feedLanguage,
    rssBuildContent,
  })
}
```

The Rss function gets called with the data returned by the resolvers content source, all the customField values and the website that made the request.

Using the website the environment values from the blocks.json siteProperties are set. A new instance of the [BuildContent](./utilities.md#feeds-content-elements) utility is created. Finally the template is called.

## customFields

There is a utility [generatePropsForFeed](./utilities.md#feeds-prop-types) to create the shared customFields for a feed. Add any new customFields into the propTypes customFields.

```javascript
Rss.propTypes = {
  customFields: PropTypes.shape({
    channelPath: PropTypes.string.tag({
      label: 'Path',
      group: 'Channel',
      description:
        'Path to the feed, excluding the domain, defaults to /arc/outboundfeeds/rss',
      defaultValue: '/arc/outboundfeeds/rss/',
    }),
    ...generatePropsForFeed('rss', PropTypes),
  }),
}
```

You must set a label for the feed, this name will be what is displayed when you list the features in PBEditor.

```javascript
Rss.label = 'RSS Standard'
```

And finally the function must be exported for it to be used as a feature.

```javascript
export default Consumer(Rss)
```
