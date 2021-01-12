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
    resizerKVP: {
      type: 'kvp',
      tag: {
        label: 'Image height and or width',
        group: 'Format',
        description: 'Optional height and or width to resize all images to',
        defaultValue: { width: 0, height: 0 },
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
  rss: {
    channelTitle: {
      type: 'string',
      tag: {
        label: 'RSS Title',
        group: 'Channel',
        description: 'RSS Channel Title, defaults to website name',
        defaultValue: '',
      },
    },
    channelDescription: {
      type: 'string',
      tag: {
        label: 'RSS Description',
        group: 'Channel',
        description:
          'RSS Channel Description, defaults to website name + " News Feed"',
        defaultValue: '',
      },
    },
    channelCopyright: {
      type: 'string',
      tag: {
        label: 'Copyright',
        group: 'Channel',
        description: 'RSS Copyright value otherwise it will be excluded',
        defaultValue: '',
      },
    },
    channelTTL: {
      type: 'string',
      tag: {
        label: 'Time To Live',
        group: 'Channel',
        description:
          'Number of minutes to wait to check for new content, defaults to 1',
        defaultValue: '1',
      },
    },
    channelUpdatePeriod: {
      type: 'oneOf',
      args: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
      tag: {
        label: 'Update Period',
        group: 'Channel',
        description: 'Which period of time should be used, defaults to hourly',
        defaultValue: 'hourly',
      },
    },
    channelUpdateFrequency: {
      type: 'string',
      tag: {
        label: 'Update Frequency',
        group: 'Channel',
        description:
          'Number of Update Periods to wait to check for new content, defaults to 1',
        defaultValue: '1',
      },
    },
    channelCategory: {
      type: 'string',
      tag: {
        label: 'Category',
        group: 'Channel',
        description:
          'Category that describes this RSS feed, if blank it will be excluded',
        defaultValue: '',
      },
    },
    channelLogo: {
      type: 'string',
      tag: {
        label: 'Logo URL',
        group: 'Channel',
        description: 'URL to the logo for this RSS feed',
        defaultValue: '',
      },
    },
    itemTitle: {
      type: 'string',
      tag: {
        label: 'Title',
        group: 'Item',
        description:
          'ANS fields to use for article title, defaults to headlines.basic',
        defaultValue: 'headlines.basic',
      },
    },
    itemDescription: {
      type: 'string',
      tag: {
        label: 'Description',
        group: 'Item',
        description:
          'ANS fields to use for article description, defaults to description.basic',
        defaultValue: 'description.basic',
      },
    },
    pubDate: {
      type: 'oneOf',
      args: [
        'created_date',
        'display_date',
        'first_publish_date',
        'last_updated_date',
        'publish_date',
      ],
      tag: {
        label: 'Publication Date',
        group: 'Item',
        description:
          'Which date field should be used, defaults to display_date',
        defaultValue: 'display_date',
      },
    },
    itemCredits: {
      type: 'string',
      tag: {
        label: 'ANS credits key',
        group: 'Item',
        description:
          'ANS value for credits in the <dc:creator> tag, will join multiple names with a comma. defaults to credits.by[].name',
        defaultValue: 'credits.by[].name',
      },
    },
    itemCategory: {
      type: 'string',
      tag: {
        label: 'Category',
        group: 'Item',
        description:
          'ANS field to use for article category, if blank will be excluded',
        defaultValue: '',
      },
    },
    includePromo: {
      type: 'bool',
      tag: {
        label: 'Include promo images',
        group: 'Featured Image',
        description: 'Include the featured image in <media:content>',
        defaultValue: true,
      },
    },
    resizerKVP: {
      type: 'kvp',
      tag: {
        label: 'Image height and or width',
        group: 'Featured Image',
        description: 'Optional height and or width to resize all images to',
        defaultValue: { width: 0, height: 0 },
      },
    },
    imageTitle: {
      type: 'string',
      tag: {
        label: 'ANS image title key',
        group: 'Featured Image',
        description:
          'ANS value for associated story used for the <media:title> sitemap tag, defaults to title',
        defaultValue: 'title',
      },
    },
    imageCaption: {
      type: 'string',
      tag: {
        label: 'ANS image caption key',
        group: 'Featured Image',
        description:
          'ANS value for associated story image used for the <media:caption> sitemap tag, defaults to caption',
        defaultValue: 'caption',
      },
    },
    imageCredits: {
      type: 'string',
      tag: {
        label: 'ANS image credits key',
        group: 'Featured Image',
        description:
          'ANS value for associated story image credits for the <media:credits> sitemap tag, defaults to credits.by[].name',
        defaultValue: 'credits.by[].name',
      },
    },
    includeContent: {
      type: 'oneOf',
      args: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'all'],
      tag: {
        label: 'Number of paragraphs to include',
        group: 'Item',
        description: 'Number of paragraphs to include, defaults to all',
        defaultValue: 'all',
      },
    },
  },
}
