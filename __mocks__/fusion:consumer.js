/**
 * Global mock for a fusion:consumer when running
 * unit tests of anything using a consumer HOC.
 *
 * In order to use this mock you must do
 * `import Consumer from 'fusion:consumer';`
 * at the top of your unit test file, this will
 * trigger jest to mock the Consumer import below
 * */
jest.mock('fusion:consumer', (component) => {
  return function (component) {
    class element extends component {
      constructor(props) {
        super(props)
        this.props = props
      }

      addEventListener() {}

      dispatchEvent() {}

      getContent() {
        return {
          cached: new Promise((resolve) => {
            return resolve()
          }),
          fetched: new Promise((resolve) => {
            return resolve()
          }),
        }
      }

      removeEventListener() {}

      setContent() {}
    }

    return element
  }
})
