function formatSearchObject(searchObject) {
  const keys = Object.keys(searchObject)
  const jsmSearcher = keys.reduce((acc, key) => {
    return [...acc, `${key} == \`${searchObject[key]}\``]
  }, [])

  return jsmSearcher
}

export default formatSearchObject
