import { propInfo } from './propInfo'

/**
 * Generates shared PropType calls for a given feed.
 *
 * @param feedType - top level key from propInfo, e.g., rss, sitemap
 * @param omit - list of PropTypes to omit if you don't want the full set of shared values
 * @param PropTypes - to avoid having a dependency on any internal fusion modules, you need to pass PropTypes from 'fusion:prop-types'
 * @returns an object to be passed to `customFields: PropTypes.shape(...)`
 */
export const generatePropsForFeed = (feedType, PropTypes, omit = []) => {
  const feed = propInfo[feedType]
  if (!feed) {
    throw new Error(`${feed} is not a valid feed`)
  }

  const functionalPropTypes = [
    'arrayOf',
    'instanceOf',
    'objectOf',
    'oneOf',
    'oneOfType',
    'shape',
    'exact',
  ]
  return Object.keys(feed).reduce((props, key) => {
    const field = feed[key]
    if (omit.includes(key)) return props

    return {
      ...props,
      [key]: functionalPropTypes.includes(field.type)
        ? PropTypes[field.type](field.args).tag(field.tag)
        : PropTypes.string.tag(field.tag),
    }
  }, {})
}
