// The frontend is built with Vite. Babel is only used by ESLint
// (@babel/eslint-parser) to parse the JavaScript files, so only syntax
// plugins are needed here.
module.exports = {
  presets: [
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-syntax-dynamic-import'
  ]
};
