# OBF block development - Output Types

The xml output-type is not a block, but it is still an npm package. Because it's not a block it must be listed as a dependency in your package.json.

```json
"dependencies": {
    "@wpmedia/feeds-xml-output": "^0.2.2"
  },
```

To use this module a components/output-types/xml.js file must be created that contains the following:

```javascript
import { XmlOutput } from '@wpmedia/feeds-xml-output'

export default XmlOutput
```

Now all requests to fusion with the parameter ?outputType=xml will use this output-type to generate content.
