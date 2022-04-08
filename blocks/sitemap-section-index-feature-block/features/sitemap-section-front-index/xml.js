import PropTypes from 'fusion:prop-types'
import Consumer from 'fusion:consumer'
import getProperties from 'fusion:properties'

const sitemapIndexTemplate = ({
  feedPath,
  feedAtRoot,
  feedExtension,
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
      feedAtRoot,
      feedExtension,
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
  const { excludeLinks = true } = customFields

  const checkForLinks = (section) => {
    if (excludeLinks && section.node_type === 'link') return true
  }

  const buildSitemapIndexLinks = (
    sections,
    excludeSections,
    domain,
    feedPath,
    feedAtRoot,
    feedExtension,
    feedParam,
  ) => {
    const parameters = feedParam ? `?${feedParam}` : ''
    const matchTerm = feedAtRoot ? /\//g : ''
    const replaceTerm = feedAtRoot ? '-' : ''
    return sections.reduce((accum, section) => {
      const sectionId = (section._id || '').replace(matchTerm, replaceTerm)
      if (
        sectionId &&
        !excludeSections.includes(sectionId) &&
        !checkForLinks(section)
      ) {
        accum.push({
          loc: `${domain}${feedPath}${sectionId}${
            feedExtension || '/'
          }${parameters}`,
        })
        if (section.children?.length) {
          const subSections = buildSitemapIndexLinks(
            section.children,
            excludeSections,
            domain,
            feedPath,
            feedAtRoot,
            feedExtension,
            feedParam,
          )
          accum.push(...subSections)
        }
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
      description: 'Relative URL path used in the generated link',
      defaultValue: '/arc/outboundfeeds/sitemap/category',
    }),
    feedAtRoot: PropTypes.bool.tag({
      label: 'Sitemap at root',
      group: 'Format',
      description:
        'Set if sitemaps are redirected from root. This will replace slashes with dashes',
      defaultValue: false,
    }),
    feedExtension: PropTypes.string.tag({
      label: 'URL extention',
      group: 'Format',
      description:
        'Optional file extention to append to URL. Set if sitemaps are redirected from root. For example .xml',
      defaultValue: '',
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
  }),
}
SitemapSectionFrontIndex.label = 'Sitemap Section Front Index'
SitemapSectionFrontIndex.icon = 'browser-page-hierarchy'
export default Consumer(SitemapSectionFrontIndex)
