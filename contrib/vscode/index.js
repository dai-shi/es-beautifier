const path = require('path');
const execFileSync = require('child_process').execFileSync;
const vscode = require('vscode');

function execCLI(input, opts = []) {
  const cli = path.resolve(__dirname, 'node_modules/es-beautifier/lib/cli.js');
  return execFileSync('node', [cli, ...opts], { input, encoding: 'utf8' });
}

function beautify(document) {
  try {
    const config = vscode.workspace.getConfiguration('[es-beautifier]');
    const opts = [];
    if (config.useEslintrc) {
      opts.push('--use-eslintrc');
    }
    const text = document.getText();
    const beautified = execCLI(text, opts);
    const start = document.positionAt(0);
    const end = document.positionAt(text.length);
    const range = new vscode.Range(start, end);
    return [vscode.TextEdit.replace(range, beautified)];
  } catch (e) {
    console.error('es-beautifier failed:', e);
    vscode.window.showInformationMessage('es-beautifier failed. See the console log in the DevTools.');
    return [];
  }
}

exports.activate = function activate() {
  vscode.languages.registerDocumentFormattingEditProvider('es-beautifier', {
    provideDocumentFormattingEdits: beautify,
  });
};
