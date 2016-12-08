const path = require('path');
const execFileSync = require('child_process').execFileSync;
const vscode = require('vscode');

function execCLI(input) {
  const cli = path.resolve(__dirname, 'node_modules/es-beautifier/lib/cli.js');
  return execFileSync('node', [cli], { input, encoding: 'utf8' });
}

function beautify() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    try {
      const text = editor.document.getText();
      const beautified = execCLI(text);
      editor.edit((builder) => {
        const start = editor.document.positionAt(0);
        const end = editor.document.positionAt(text.length);
        const range = new vscode.Range(start, end);
        builder.replace(range, beautified);
      });
    } catch (e) {
      console.error('es-beautifier failed:', e);
      vscode.window.showInformationMessage('es-beautifier failed. See the cons  ole log in the DevTools.');
    }
  }
}

exports.activate = function activate(context) {
  const disposable = vscode.commands.registerCommand('extension.esBeautifier', beautify);
  context.subscriptions.push(disposable);
};
