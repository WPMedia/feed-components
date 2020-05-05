const xmlBuilder = require('xmlbuilder2')

const XmlOutput = ({ children }) => {
  return children
    ? xmlBuilder
        .create(children[0], { invalidCharReplacement: '' })
        .dec({ encoding: 'UTF-8' })
        .end()
    : null
}

XmlOutput.contentType = 'application/xml'

module.exports = XmlOutput
