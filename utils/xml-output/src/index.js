import { create } from 'xmlbuilder2';

export const XmlOutput = ({ children }) => {
  return children
    ? create({ invalidCharReplacement: '' }, children[0])
        .dec({ encoding: 'UTF-8' })
        .end()
    : null;
};

XmlOutput.contentType = 'application/xml';
