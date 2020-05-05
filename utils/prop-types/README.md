# Feeds Prop Types

Fusion allows features to define custom fields used configure the feature. Many of the outbound feeds share custom fields. This package stores shared custom fields PropType information to use in features.

## Usage

Fusion custom fields are defined as React PropTypes.

### `propType` definitions

Fusion `propTypes` are the same as React `propTypes`, but they are extended with a `tag` function to add metadata to the custom field. See the [Fusion custom field docs](https://staging.arcpublishing.com/alc/arc-products/pagebuilder/fusion/documentation/api/feature-pack/components/custom-fields.md) for more detail.

In `propInfo.js`, custom field props are grouped by feed type. If you wanted to add a shared RSS PropType, you would do the following:

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

PropTypes are generally defined as `PropType.[type].tag([tagOptions])`. The object above corresponds to this format, e.g., using the above custom field,

```js
Feature.propTypes = {
  sharedProp: PropTypes[propInfo.rss.sharedProp.type].tag(
    propInfo.rss.sharedProp.tag,
  ),
}
```

### Functional `propType` definitions

Some PropType [validation options are functions](https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes), i.e., `oneOf`. You can define a functional PropType as well.

```js
const propInfo = {
  rss: {
    funcProp: {
      type: 'oneOf',
      args: ['News', 'Photos'],
      tag: {
        defaultValue: 'News',
      },
    },
  },
}
```

Which is used similar to what was shown above:

```js
Feature.propTypes = {
  sharedProp: PropTypes[propInfo.rss.funcProp.type](
    propInfo.rss.funProp.args,
  ).tag(propInfo.rss.sharedProp.tag),
}
```

### Generating `propTypes` for a feed type

Defining all shared custom fields as shown above can get tedious. This package provides a `generatePropsForFeed` function that will return the right shape for custom fields.

```js
Feature.propTypes = {
  customFields: PropTypes.shape(generatePropsForFeed('rss', PropTypes)),
}
```

If you'd like to add additional custom fields, you can spread the return value into your `customFields` shape:

```js
Feature.propTypes = {
  customFields: PropTypes.shape({
    ...generatePropsForFeed('rss', PropTypes),
    featureSpecific: PropTypes.string.tag(),
  }),
}
```
