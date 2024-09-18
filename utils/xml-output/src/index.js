import { create } from 'xmlbuilder2'

// eslint-disable-next-line react/prop-types
export const XmlOutput = ({ children }) => {
  return children
    ? create({ invalidCharReplacement: '' }, children[0])
        .dec({ encoding: 'UTF-8' })
        .end()
    : null
}

XmlOutput.contentType = 'application/xml'
