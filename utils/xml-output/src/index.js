import { create } from 'xmlbuilder2'

export const XmlOutput = ({ children }) => {
  return children
    ? create(children[0], { invalidCharReplacement: '' })
        .dec({ encoding: 'UTF-8' })
        .end()
    : null
}

XmlOutput.contentType = 'application/xml'
