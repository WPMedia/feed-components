export * from './formatSections'
export * from './generateDistributor'
export * from './generateParamList'
export * from './transform'

export const defaultANSFields = [
  'canonical_url',
  'canonical_website',
  'created_date',
  'credits',
  'description',
  'display_date',
  'duration',
  'first_publish_date',
  'headlines',
  'last_updated_date',
  'promo_image',
  'promo_items',
  'publish_date',
  'streams',
  'subheadlines',
  'subtitles',
  'subtype',
  'taxonomy.primary_section',
  'taxonomy.seo_keywords',
  'taxonomy.tags',
  'type',
  'video_type',
]

export const validANSDates = [
  'created_date',
  'last_updated_date',
  'display_date',
  'first_publish_date',
  'publish_date',
]
