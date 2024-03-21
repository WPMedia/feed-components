jest.mock('fusion:environment', () => ({
  RESIZER_TOKEN_VERSION: 1,
}))
// eslint-disable-next-line import/first
import { buildResizerURL } from '.' // Adjust the path as necessary

describe('buildResizerURL', () => {
  beforeEach(() => {
    // Reset mocks
    jest.resetModules()
    jest.clearAllMocks()

    // Mock 'thumbor-lite' for each test to ensure a fresh mock
    jest.mock('thumbor-lite', () => {
      return function () {
        return {
          setImagePath: jest.fn().mockReturnThis(),
          resize: jest.fn().mockReturnThis(),
          buildUrl: jest
            .fn()
            .mockReturnValue('http://resizer.url/resized-image.jpg'),
        }
      }
    })
    jest.mock('./calculateWidthAndHeight', () => ({
      __esModule: true, // This is required to mock a module that has a default export
      default: jest.fn(),
    }))
  })

  it('formats URL correctly for ANS image with auth token', () => {
    const ansImage = {
      auth: { 1: 'someAuthToken' },
    }

    require('./calculateWidthAndHeight').default.mockReturnValue({
      width: 100,
      height: 100,
    })

    const result = buildResizerURL(
      'http://example.com/image.jpg',
      'dummyResizerKey',
      'http://resizer.url',
      100,
      100,
      ansImage,
    )

    expect(result).toContain('http://resizer.url/')
    expect(result).toContain('width=100')
    expect(result).toContain('height=100')
    expect(result).toContain('auth=someAuthToken')
    expect(result).toContain('smart=true')
  })

  it('uses Thumbor for resizing', () => {
    const originalUrl = 'http://example.com/image.jpg'
    const resizerKey = 'dummyResizerKey'
    const resizerURL = 'http://resizer.url'

    const result = buildResizerURL(
      originalUrl,
      resizerKey,
      resizerURL,
      100,
      100,
    )

    expect(result).toEqual('http://resizer.url/resized-image.jpg')
  })

  it('returns the original URL if no resizing is needed and no auth token is present', () => {
    const originalUrl = 'http://example.com/image.jpg'
    const result = buildResizerURL(originalUrl, '', '', 0, 0)

    expect(result).toEqual(originalUrl)
  })
})
