# Resizer

Many of the outbound feeds need to generate resizer URLs. This package provides a function (`buildResizerURL`) to generate those URLs.

`buildResizerURL(_url, resizerKey, resizerURL, width, height)`

- `_url`: Usually an image URL from the content API
- `resizerKey`: Resizer key for a client environment, stored in a fustion environment variable in the feature bundle
- `resizerURL`: Base URL
- `width`: Optional integer value to resize the image width
- `height`: Optional integer value to resize the image height

images need to use the resizer regardless of if the image size is going to change. If the width and height and omited the image will maintain it's original size, but still get passed to the resizer.
