// eslint-disable-next-line no-unused-vars
import { formatSections } from './'

it('Test with single section data no slash', () => {
  const sections = formatSections('test')
  expect(sections).toEqual({ terms: { 'taxonomy.sections._id': ['/test'] } })
})

it('Test with multiple section and subsection data no slash', () => {
  const sections = formatSections('world/uk/,/sports/highschool/football/')
  expect(sections).toEqual({
    terms: {
      'taxonomy.sections._id': ['/world/uk', '/sports/highschool/football'],
    },
  })
})
