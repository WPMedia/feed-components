const resolve = ({ website }) => `/site/v3/website/${website}`

export default {
  resolve,
  params: [
    {
      name: 'website',
      displayName: 'Website',
      type: 'text',
    },
  ],
}