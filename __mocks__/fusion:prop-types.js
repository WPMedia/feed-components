/**
 * Global mock for a fusion:prop-types. This is required
 * when running unit tests for anything that uses the
 * .tag() in the prop-types. Instead of importing normal react prop-types
 * you will need to instead do:
 *
 * import PropTypes from 'fusion:prop-types';
 *
 * and then in your test file the prop-types will be auto-mocked with
 * with the .tag() functionality so you don't get unit test errors
 * */
const PropTypes = require('../node_modules/prop-types')

const { taggable } = require('./fusion:taggables')

const isPropTypeSelfRef = (key) => {
  return ['PropTypes', 'checkPropTypes'].includes(key)
}
const isPropTypeMethod = (key) => {
  return ['isRequired', 'tag'].includes(key)
}

const ignorePropTypeSelfRefs = (key) => {
  return !isPropTypeSelfRef(key)
}
const ignorePropTypeMethods = (key) => {
  return !isPropTypeMethod(key)
}

const FusionPropTypes = Object.assign(
  ...Object.keys(PropTypes)
    .filter(ignorePropTypeSelfRefs)
    .map((key) => {
      return { [key]: taggable(PropTypes[key], key) }
    }),
  require('./fusion:custom-types'),
)

// The basic JSON.stringify function ignores functions
// but functions can have properties, just like any other object
// this implementation exposes the properties of functions (while still ignoring their source)
function _stringify(value) {
  const exists = (key) => {
    return value[key] !== undefined
  }

  return Array.isArray(value)
    ? `[${value.map(_stringify).join(',')}]`
    : value instanceof Object
    ? `{${Object.keys(value)
        .filter(ignorePropTypeMethods)
        .filter(exists)
        .map((key) => {
          return `"${key}":${_stringify(value[key])}`
        })
        .join(',')}}`
    : JSON.stringify(value)
}
FusionPropTypes.stringify = function stringify(value, replacer, space) {
  const str = _stringify(value)
  return str ? JSON.stringify(JSON.parse(str), replacer, space) : str
}

module.exports = FusionPropTypes
