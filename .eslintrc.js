module.exports = {
  extends: ['standard', 'prettier'],
  plugins: ['standard', 'prettier'],
  rules: {},
  overrides: [
    {
      files: ['*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
}
