module.exports = (instance) => {
  return (props, propName, componentName) => {
    const prop = props[propName]
    if (!prop) {
      return new Error(`${propName} is required on ${componentName}`)
    }
    return instance(props, propName, componentName)
  }
}
