const { fixingNodes } = require('./es-beautifier-common.js');

const create = (context) => {
  const option = context.options[0] || {
    allowSingleLine: true,
    maxLenInSingleLine: 80,
  };
  const allowSingleLine = option.allowSingleLine;
  const maxLen = option.maxLenInSingleLine;
  const indentStr = option.indentStr || '  ';

  const sourceCode = context.getSourceCode();

  const enterJSXElement = (node) => {
    if (allowSingleLine &&
        node.loc.start.line === node.loc.end.line &&
        (!maxLen || sourceCode.lines[node.loc.end.line - 1].length < maxLen)) {
      // we accept one line
      return;
    }

    let parent = node.parent;
    while (parent && parent.loc.start.line === node.loc.start.line) {
      if (fixingNodes.indexOf(parent) >= 0) {
        // we ignore this time as we are still in the process
        return;
      }
      parent = parent.parent;
    }

    if (node.children.length) {
      const src = sourceCode.getText(node, node.loc.start.column);
      const currIndent = src.substring(0, node.loc.start.column).match(/(\s*)$/)[1];
      if (node.children[0].type === 'Literal') {
        const literal = node.children[0];
        const headingSpaces = literal.value.match(/^(\s*)/)[1];
        const expectedHeading = `\n${currIndent}${indentStr}`;
        if (headingSpaces !== expectedHeading) {
          const range = [
            literal.range[0],
            literal.range[0] + headingSpaces.length,
          ];
          context.report({
            node,
            message: 'Literal in JSX Element should be on a separate line.',
            loc: node.loc.start,
            fix: fixer => fixer.replaceTextRange(range, expectedHeading),
          });
        }
      }
      if (node.children[node.children.length - 1].type === 'Literal') {
        const literal = node.children[node.children.length - 1];
        const tailingSpaces = literal.value.match(/(\s*)$/)[1];
        const expectedTailing = `\n${currIndent}`;
        if (tailingSpaces !== expectedTailing) {
          const range = [
            literal.range[1] - tailingSpaces.length,
            literal.range[1],
          ];
          context.report({
            node,
            message: 'Literal in JSX Element should be on a separate line.',
            loc: node.loc.start,
            fix: fixer => fixer.replaceTextRange(range, expectedTailing),
          });
        }
      }
      if (node.children[0].type === 'JSXExpressionContainer') {
        context.report({
          node,
          message: 'Literal in JSX Element should be on a separate line.',
          loc: node.loc.start,
          fix: fixer => fixer.insertTextBefore(node.children[0], '\n'),
        });
      }
      if (node.children[node.children.length - 1].type === 'JSXExpressionContainer') {
        context.report({
          node,
          message: 'Literal in JSX Element should be on a separate line.',
          loc: node.loc.start,
          fix: fixer => fixer.insertTextBefore(node.closingElement, '\n'),
        });
      }
    }
  };

  return {
    JSXElement: enterJSXElement,
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce literals in elements on separte lines in JSX',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        allowSingleLine: { type: 'boolean' },
        maxLenInSingleLine: { type: 'integer' },
        indentStr: { type: 'string' },
      },
      additionalProperties: false,
    }],
  },
  create,
};
