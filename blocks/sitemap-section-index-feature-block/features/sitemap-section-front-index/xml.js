import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'

const sitemapIndexTemplate = ({
  feedPath,
  feedParam,
  excludeSections,
  domain,
  sections,
  buildIndexes,
}) => ({
  sitemapindex: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    sitemap: buildIndexes(
      sections,
      excludeSections,
      domain,
      feedPath,
      feedParam,
    ),
  },
})

export function SitemapSectionFrontIndex({
  globalContent,
  customFields,
  arcSite,
}) {
  const { feedDomainURL = '' } = getProperties(arcSite)
  const { children: sections } = globalContent

  const buildSitemapIndexLinks = (
    sections,
    excludeSections,
    feedDomainUrl,
    feedPath,
    feedParam,
  ) => {
    return sections.reduce((accum, section) => {
      const sectionId = section._id || ''
      if (sectionId && !excludeSections.includes(sectionId)) {
        accum.push({
          loc: `${feedDomainURL}${feedPath}${sectionId}/?${feedParam || ''}`,
        })
      }
      return accum
    }, [])
  }

  // can't return null for xml return type, must return valid xml template
  return sitemapIndexTemplate({
    ...customFields,
    excludeSections: (customFields.excludeSections || '').split(','),
    domain: feedDomainURL,
    sections,
    buildIndexes: buildSitemapIndexLinks,
  })
}

SitemapSectionFrontIndex.propTypes = {
  customFields: PropTypes.shape({
    feedPath: PropTypes.string.tag({
      label: 'Feed Path',
      group: 'Format',
      description: 'Relative URL path to the specific sitemap call',
      defaultValue: '/arc/outboundfeeds/sitemap/category',
    }),
    feedParam: PropTypes.string.tag({
      label: 'Additional URL Parameters',
      group: 'Format',
      description:
        'Optional parameters to append to URL, join multiple parameters with &',
      defaultValue: 'outputType=xml',
    }),
    excludeSections: PropTypes.string.tag({
      label: 'Section IDs to exclude',
      group: 'Format',
      description:
        'Comma separated list of section IDs to exclude from the feed, i.e /subscribe,/test',
      defaultValue: '',
    }),
  }),
}
SitemapSectionFrontIndex.label = 'Sitemap Section Front Index'
export default Consumer(SitemapSectionFrontIndex)
