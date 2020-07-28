const path = require('path');

const ASSETS = 'assets';
const BUILD = 'build';
const CSS = 'css';
const IMAGES = 'images';
const JS = 'js';
const NODE = 'node_modules';
const SOURCE = 'src';
const STATIC = 'static';

const ROOT = path.resolve(__dirname, '../..');

module.exports = {
  ABS: {
    BUILD: path.resolve(ROOT, BUILD),
    ENTRY: path.resolve(ROOT, `${SOURCE}/index.js`),
    NODE: path.resolve(ROOT, NODE),
    SOURCE: path.resolve(ROOT, SOURCE),
  },
  REL: {
    STATIC_ASSETS_IMAGES: path.join(STATIC, `${ASSETS}/${IMAGES}`),
    STATIC_CSS: path.join(STATIC, CSS),
    STATIC_JS: path.join(STATIC, JS),
  }
};
