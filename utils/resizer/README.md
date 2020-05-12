# Resizer

Many of the outbound feeds need to generate resizer URLs. This package provides a function (`buildResizerURL`) to generate those URLs.

`buildResizerURL(_url, resizerKey, resizerURL)`

- `_url`: Usually an image URL from the content API
- `resizerKey`: Resizer key for a client environment, stored in a fustion environment variable in the feature bundle
- `resizerURL`: Base URL
