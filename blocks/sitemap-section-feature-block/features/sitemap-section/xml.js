import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'

const sitemapSectionTemplate = ({
  feedPath,
  feedParam,
  excludeSections,
  domain,
  sections,
  priority,
  changeFreq,
  buildIndexes,
}) => ({
  urlset: {
    '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
    url: buildIndexes(
      sections,
      excludeSections,
      domain,
      feedPath,
      feedParam,
      priority,
      changeFreq,
    ),
  },
})

export function SitemapSection({
  globalContent,
  customFields,
  arcSite,
}) {
  const { feedDomainURL = '' } = getProperties(arcSite)
  const { children: sections } = globalContent
  const { excludeLinks = true } = customFields

  const checkForLinks = (section) => {
    if (excludeLinks && section.node_type === 'link') return true
  }

  const buildSitemapSectionLinks = (
    sections,
    excludeSections,
    domain,
    feedPath,
    feedParam,
    priority,
    changeFreq,
  ) => {
    const parameters = feedParam ? `?${feedParam}` : ''
    return sections.reduce((accum, section) => {
      const sectionId = section._id || ''
      if (
        sectionId &&
        !excludeSections.includes(sectionId) &&
        !checkForLinks(section)
      ) {
        accum.push({
          loc: `${domain}${feedPath}${sectionId}/${parameters}`,
          ...(changeFreq !== 'Exclude field' &&
          changeFreq !== 'Exclude from sitemap' && {
            changefreq: changeFreq,
          }),
        ...(priority !== 'Exclude field' &&
          changeFreq !== 'Exclude from sitemap' && { priority: priority }),
        })
        if (section.children?.length) {
          const subSections = buildSitemapSectionLinks(
            section.children,
            excludeSections,
            domain,
            feedPath,
            feedParam,
            changeFreq,
            priority,
          )
          accum.push(...subSections)
        }
      }
      return accum
    }, [])
  }

  // can't return null for xml return type, must return valid xml template
  return sitemapSectionTemplate({
    ...customFields,
    excludeSections: (customFields.excludeSections || '').split(','),
    domain: feedDomainURL,
    sections,
    buildIndexes: buildSitemapSectionLinks,
  })
}

SitemapSection.propTypes = {
  customFields: PropTypes.shape({
    feedPath: PropTypes.string.tag({
      label: 'Feed Path',
      group: 'Format',
      description: 'Relative URL path used in the generated link',
      defaultValue: '/arc/outboundfeeds/sitemap/category',
    }),
    feedParam: PropTypes.string.tag({
      label: 'URL Parameters',
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
    excludeLinks: PropTypes.bool.tag({
      label: 'Exclude links',
      group: 'Format',
      description: 'Should links be excluded from the output',
      defaultValue: true,
    }),
    priority: PropTypes.oneOf(['0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0', 'Exclude field']).tag({
      label: 'priority',
      group: 'Format',
      description: 'What is the priority of the content in the sitemap, hint for bots',
      defaultValue: '0.5',
    }),
    changeFreq: PropTypes.oneOf(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never', 'Exclude field']).tag({
      label: 'change frequency',
      group: 'Format',
      description: 'What is the expected Change frequency of the sitemap, hint for bots',
      defaultValue: 'always',
      ordered: false,
    }),
  }),
}
SitemapSection.label = 'Sitemap Section'
SitemapSection.icon = 'browser-page-hierarchy'
export default Consumer(SitemapSection)
