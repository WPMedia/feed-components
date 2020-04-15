const taggablePrimitive = (propType, typeName, complexArgs, isRequired) => {
  const propTypeCopy = (...args) => {
    return propType(...args)
  }

  const isRequiredName = `${typeName}.isRequired`

  propTypeCopy.type = typeName
  propTypeCopy.args = complexArgs

  propTypeCopy.tag = (tags) => {
    const instance = (...args) => {
      return propTypeCopy(...args)
    }
    instance.type = typeName
    instance.args = complexArgs
    instance.tags = tags
    if (!isRequired && propType.isRequired) {
      instance.isRequired = (...args) => {
        return propType.isRequired(...args)
      }
      instance.isRequired.type = isRequiredName
      instance.isRequired.args = complexArgs
      instance.isRequired.tags = tags
    }
    return instance
  }

  // In production, propType is just a placeholder function, so make sure we aren't recursing infinitely
  if (!isRequired && propType.isRequired) {
    propTypeCopy.isRequired = taggablePrimitive(
      propType.isRequired,
      isRequiredName,
      complexArgs,
      true,
    )
  }

  return propTypeCopy
}

const taggableComplex = (propType, typeName) => {
  return (complexArgs) => {
    // We need to make a new function even for complex types, because in production mode, all types share an empty shim
    const f = (...args) => {
      return propType(complexArgs)(...args)
    }
    return taggablePrimitive(f, typeName, complexArgs)
  }
}

const taggable = (propType, typeName) => {
  return propType && propType.isRequired // (['shim', 'bound checkType'].includes(propType.name))
    ? taggablePrimitive(propType, typeName)
    : taggableComplex(propType, typeName)
}

module.exports = {
  taggable,
  taggableComplex,
  taggablePrimitive,
}
