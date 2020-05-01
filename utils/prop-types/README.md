# Feeds Prop Types

Fusion allows features to define custom fields to configure the feature. With outbound feeds,
many of these custom fields are the same. This package stores shared custom field PropType information to use
in features.

## Usage

### Adding a PropType

Fusion PropTypes are the same as React proptypes, but they extend them with a `tag` function to add metadat to the custom field.

In `propInfo.js`, custom field props are separated by feed type. If you wanted to add a shared RSS PropType, you would do the following:

```js
const propInfo = {
  rss: {
    sharedProp: {
      type: 'boolean',
      tag: {
        label: 'Include this shared value?',
        defaultValue: true,
      },
    },
  },
}
```

In your feature code, calling the `generatePropsForFeed` method will generate the correct PropType information.

```js
Feature.propTypes = {
  customFields: PropTypes.shape(generatePropsForFeed('rss', PropTypes)),
}
```

```js
Feature.propTypes = {
  customFields: PropTypes.shape({
    sharedProp: PropTypes.boolean.tag({
      label: 'Include this shared value?',
      defaultValue: true,
    }),
  }),
}
```
