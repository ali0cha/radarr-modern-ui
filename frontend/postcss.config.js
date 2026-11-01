const path = require('path');

const mixinsFiles = [
  'cover.css',
  'linkOverlay.css',
  'scroller.css',
  'truncate.css',
  'visuallyHidden.css'
].map((file) => path.join(__dirname, 'src/Styles/Mixins', file));

module.exports = {
  plugins: {
    // Gives @custom-media (breakpoints) to every stylesheet, so that they do
    // not need to import it.
    '@csstools/postcss-global-data': {
      files: [path.join(__dirname, 'src/Styles/Variables/breakpoints.css')]
    },
    'postcss-custom-media': {},
    'postcss-mixins': {
      mixinsFiles
    },
    'postcss-nested': {},
    autoprefixer: {}
  }
};
