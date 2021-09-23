export const genParams = (paramList) => {
  return Object.keys(paramList)
    .reduce((acc, key) => {
      return [...acc, `${key}=${paramList[key]}`]
    }, [])
    .join('&')
}
