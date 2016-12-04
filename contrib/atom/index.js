const path = require('path');
const execFileSync = require('child_process').execFileSync;
const atom = require('atom');

function execCLI(input) {
  return execFileSync(path.resolve(__dirname, 'node_modules/es-beautifier/lib/cli.js'), {
    input,
    encoding: 'utf8',
  });
}

function beautify() {
  const editor = atom.workspace.getActiveTextEditor();
  if (editor) {
    const text = editor.getText();
    const beautified = execCLI(text);
    editor.setText(beautified);
  }
}

exports.activate = function activate() {
  this.subscriptions = new atom.CompositeDisposable();
  this.subscriptions.add(atom.commands.add('atom-workspace', 'es-beautifier', beautify));
};

exports.deactivate = function activate() {
  this.subscriptions.dispose();
};
