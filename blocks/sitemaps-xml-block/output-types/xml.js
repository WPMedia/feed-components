import { create } from 'xmlbuilder2'

const XmlOutput = ({ children }) => {
  console.log({ children })
  return children ? create(children[0]).end({ pretty: true }) : null
}

XmlOutput.contentType = 'application/xml'

export default XmlOutput
