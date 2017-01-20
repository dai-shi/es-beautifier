const path = require('path');
const execFileSync = require('child_process').execFileSync;
const wrapBeautifier = require('unibeautify-beautifier').wrapBeautifier;
const pkg = require('./package.json');

function execCLI(input) {
  const cli = path.resolve(__dirname, 'node_modules/es-beautifier/lib/cli.js');
  return execFileSync('node', [cli], { input, encoding: 'utf8' });
}

function beautify(data) {
  const text = data.text;
  const beautified = execCLI(text);
  return Promise.resolve(beautified);
}

const Beautifier = {
  name: 'es-beautifier',
  link: 'https://github.com/dai-shi/es-beautifier',
  options: {
    JSX: true,
    JavaScript: true,
  },
  beautify,
};

const config = {};

module.exports = wrapBeautifier(pkg, Beautifier, config);
