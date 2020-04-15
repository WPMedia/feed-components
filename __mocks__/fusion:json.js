const isRequired = require('./fusion:is-required')
const { taggablePrimitive } = require('./fusion:taggables')

const json = (props, propName, componentName) => {
  const prop = props[propName]
  if (prop) {
    try {
      JSON.parse(prop)
    } catch (e) {
      return new Error(`${propName} is not valid JSON on ${componentName}`)
    }
  }
}

json.isRequired = isRequired(json)

module.exports = taggablePrimitive(json, 'json')
