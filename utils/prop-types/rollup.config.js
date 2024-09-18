export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/es/index.js',
      format: 'es',
    },
  ],
  external: (id) => id.match(/^@wpmedia/i),
}
