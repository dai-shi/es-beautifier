const path = require('path');
const execFileSync = require('child_process').execFileSync;
const vscode = require('vscode');

function execCLI(input) {
  const cli = path.resolve(__dirname, 'node_modules/es-beautifier/lib/cli.js');
  return execFileSync('node', [cli], { input, encoding: 'utf8' });
}

function beautify(document) {
  try {
    const text = document.getText();
    const beautified = execCLI(text);
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
