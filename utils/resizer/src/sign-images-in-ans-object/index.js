const signImagesInANSObject =
  (cachedCall, fetcher, resizerAppVersion, cacheKey = 'image-token') =>
  ({ data, ...rest }) => {
    const replacements = new Set()

    const stringData = JSON.stringify(data, (key, value) => {
      if (value === null) {
				return value;
			}
      const { _id, type, auth, url } = value
      if (!auth?.[resizerAppVersion] && type === 'image') {
        replacements.add(_id || url)
        return {
          ...value,
          auth: {
            ...value.auth,
            [resizerAppVersion]: `__replaceMe${_id || url}__`,
          },
        }
      }
      return value
    })

    return Promise.all(
      Array.from(replacements).map((id) =>
        cachedCall(`${cacheKey}-${id}`, fetcher, {
          query: { id },
          ttl: 31536000,
          independent: true,
        })
          .then((auth) => ({ id, auth }))
          .catch(() => ({})),
      ),
    ).then((authResults) => {
      const replaced = authResults
        .filter(({ id, auth }) => id && auth)
        .reduce(
          (accumulator, { id, auth }) =>
            accumulator.replace(
              new RegExp(`__replaceMe${id}__`, 'g'),
              auth.hash,
            ),
          stringData,
        )
        .replace(/,*\s*"\d+"\s*:\s*"__replaceMe[^_]+__"/g, '')
        .replace(/,"auth"\s*:\s*{\s*}/g, '')
      return {
        data: JSON.parse(replaced),
        ...rest,
      }
    })
  }

export default signImagesInANSObject
