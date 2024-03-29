module.exports = {
  extends: ['standard', 'prettier', 'plugin:react/recommended'],
  plugins: ['standard', 'prettier', 'react'],
  rules: {
    'react/prop-types': 'warn',
    'object-shorthand': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.test.js', '__mocks__/**'],
    },
  ],
  env: {
    jest: true,
  },
}
