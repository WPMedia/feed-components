const xmlBuilder = require('xmlbuilder2')

const XmlOutput = ({ children }) => {
  return children ? xmlBuilder.create(children[0]).end({ pretty: true }) : null
}

XmlOutput.contentType = 'application/xml'

module.exports = XmlOutput
