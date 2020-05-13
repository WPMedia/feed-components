/**
 * See https://staging.arcpublishing.com/alc/arc-products/pagebuilder/fusion/documentation/api/feature-pack/components/custom-fields.md
 * for available PropTypes and tag optionMap.
 *
 * @param {Object} propInfo
 * @param {Object} propInfo.feedType
 * @param {Object} propInfo.feedType.customField
 * @param {string} propInfo.feedType.customField.type - A Fusion PropType
 * @param {Object} propInfo.feedType.customField.tag - any of Fusions tag optionMap values
 * @param {string[]} [propInfo.feedType.customField.args] - optional args to pass to PropType if it is a functional
 *  PropType (e.g., oneOf)
 */
export const propInfo = {
  sitemap: {
    includePromo: {
      type: 'bool',
      tag: {
        label: 'Include promo images?',
        group: 'Format',
        description: 'Include an image in the sitemap',
        defaultValue: true,
      },
    },
    lastMod: {
      type: 'oneOf',
      args: [
        'created_date',
        'display_date',
        'first_publish_date',
        'last_updated_date',
        'publish_date',
      ],
      tag: {
        label: 'Last Modified Date',
        group: 'Format',
        description: 'Which date field should be used in the sitemap',
        defaultValue: 'last_updated_date',
      },
    },
    priority: {
      type: 'oneOf',
      args: [
        '0.0',
        '0.1',
        '0.2',
        '0.3',
        '0.4',
        '0.5',
        '0.6',
        '0.7',
        '0.8',
        '0.9',
        '1.0',
        'Exclude from sitemap',
      ],
      tag: {
        label: 'priority',
        group: 'Format',
        description: 'What is the priority of the sitemap',
        defaultValue: '0.5',
      },
    },
    changeFreq: {
      type: 'oneOf',
      args: [
        'always',
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'never',
        'Exclude from sitemap',
      ],
      tag: {
        label: 'change frequency',
        group: 'Format',
        description: 'What is the Change frequency of the sitemap',
        defaultValue: 'always',
      },
    },
  },
}
