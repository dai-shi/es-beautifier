/* global atom */

const path = require('path');
const execFileSync = require('child_process').execFileSync;
const CompositeDisposable = require('atom').CompositeDisposable;

function execCLI(input, opts = []) {
  const cli = path.resolve(__dirname, 'node_modules/es-beautifier/lib/cli.js');
  return execFileSync('node', [cli, ...opts], { input, encoding: 'utf8' });
}

function beautify() {
  const opts = [];
  if (atom.config.get('es-beautifier.useEslintrc')) {
    opts.push('--use-eslintrc');
  }
  const editor = atom.workspace.getActiveTextEditor();
  if (editor) {
    const text = editor.getText();
    const beautified = execCLI(text, opts);
    editor.setText(beautified);
  }
}

exports.activate = function activate() {
  this.subscriptions = new CompositeDisposable();
  this.subscriptions.add(atom.commands.add('atom-text-editor', 'es-beautifier', beautify));
};

exports.deactivate = function activate() {
  this.subscriptions.dispose();
};
