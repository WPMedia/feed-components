const resolve = ({ website }) =>
  `/content/v4/search/?q=type:story+AND+revision.published:true+AND+display_date:%5Bnow-20d+TO+now%5D&sort=display_date%3Adesc&size=100&website=${website}`

export default {
  resolve,
  params: [
    {
      name: 'website',
      displayName: 'Website',
      default: 'demo',
      type: 'text',
    },
  ],
}
