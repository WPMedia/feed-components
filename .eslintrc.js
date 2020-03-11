module.exports = {
  extends: ['standard', 'prettier', 'plugin:react/recommended'],
  plugins: ['standard', 'prettier'],
  rules: {
    'react/prop-types': 'warn',
  },
  overrides: [
    {
      files: ['*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
}
