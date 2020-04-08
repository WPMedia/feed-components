const isRequired = require('./fusion:is-required')
const { taggablePrimitive } = require('./fusion:taggables')

module.exports = (options, ...moreSchemas) => {
  const instance = (props, propName, componentName) => {
    const prop = props[propName]
    if (prop) {
      if (!(props.sourceName || prop.source || prop.contentService)) {
        return new Error(
          `${propName} is missing property 'contentService' on ${componentName}`,
        )
      }
      if (!(prop.key || prop.contentConfigValues)) {
        return new Error(
          `${propName} is missing property 'contentConfigValues' on ${componentName}`,
        )
      }
    }
  }

  instance.isRequired = isRequired(instance)

  const args = !(options instanceof Object)
    ? { schemas: [options].concat(...moreSchemas) }
    : Array.isArray(options)
    ? { schemas: options.concat(...moreSchemas) }
    : options

  return taggablePrimitive(instance, 'contentConfig', args)
}
