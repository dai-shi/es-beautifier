const path = require('path');
const execFileSync = require('child_process').execFileSync;
const vscode = require('vscode');

function execCLI(input) {
  return execFileSync(path.resolve(__dirname, 'node_modules/es-beautifier/lib/cli.js'), {
    input,
    encoding: 'utf8',
  });
}

function beautify() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const text = editor.document.getText();
    const beautified = execCLI(text);
    editor.edit((builder) => {
      const start = editor.document.positionAt(0);
      const end = editor.document.positionAt(text.length);
      const range = new vscode.Range(start, end);
      builder.replace(range, beautified);
    });
  }
}

exports.activate = function activate(context) {
  const disposable = vscode.commands.registerCommand('extension.es-beautifier', beautify);
  context.subscriptions.push(disposable);
};
