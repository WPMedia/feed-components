// eslint-disable-next-line react/prop-types
const Json = ({ children }) => {
  return Array.isArray(children) ? children[0] : null
}

Json.contentType = 'application/json'
export default Json
