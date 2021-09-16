export const formatSections = (section) => {
  const sectionArray = section
    .split(',')
    .map((item) => item.trim().replace(/\/$/, ''))
    .map((item) => (item.startsWith('/') ? item : `/${item}`))
  return {
    terms: {
      'taxonomy.sections._id': sectionArray,
    },
  }
}
