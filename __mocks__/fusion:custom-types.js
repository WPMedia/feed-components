const PropTypes = require('../node_modules/prop-types')
const { taggable } = require('./fusion:taggables')

module.exports = {
  boolean: taggable(PropTypes.bool, 'boolean'),
  contentConfig: require('./fusion:content-config'),
  date: taggable(PropTypes.string, 'date'),
  dateTime: taggable(PropTypes.string, 'dateTime'),
  disabled: taggable(PropTypes.string, 'disabled'),
  email: taggable(PropTypes.string, 'email'),
  json: require('./fusion:json'), // Taggable(PropTypes.string, 'json'),
  kvp: taggable(PropTypes.object, 'kvp'),
  label: taggable(PropTypes.string, 'label'),
  list: taggable(PropTypes.arrayOf(PropTypes.string), 'list'),
  richtext: taggable(PropTypes.string, 'richtext'),
  select: taggable(PropTypes.oneOf, 'select'),
  text: taggable(PropTypes.string, 'text'),
  url: taggable(PropTypes.string, 'url'),
}
