import PropTypes from 'prop-types'

const TextOutputType = ({ children }) => {
  const generateText = (child) => {
	console.log('child', child)
    if (Array.isArray(child)) return child.map(generateText).join('\n')
    return child
  }
  console.log('children', children)
  return generateText(children)
}

TextOutputType.contentType = 'text/plain'
TextOutputType.fallback = false

TextOutputType.propTypes = {
  children: PropTypes.node,
}

export default TextOutputType
