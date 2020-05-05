# XML Output Type

Currently, Fustion blocks do not correctly link output-types. This package is a simple wrapper around `xmlbuilder2` that provides the necessary code for an XML output type.

In your Fusion feature bundle, add an `xml.js` file to the `components/output-types` with the following:

```js
import { XmlOutput } from '@wpmedia/feeds-xml-output'

export default XmlOutput
```
