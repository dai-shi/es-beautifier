const {
  fixingNodes,
} = require('./es-beautifier-state.js');

const create = (context) => {
  const option = context.options[0] || {
    allowSingleLine: true,
    maxLenInSingleLine: 80,
  };
  const allowSingleLine = option.allowSingleLine;
  const maxElements = option.maxElementsInSingleLine;
  const maxLen = option.maxLenInSingleLine;
  const indentStr = option.indentStr || '  ';

  const sourceCode = context.getSourceCode();

  const enterJSXElement = (node) => {
    if (allowSingleLine &&
        node.loc.start.line === node.loc.end.line &&
        (!maxElements || node.elements.length <= maxElements) &&
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

    const children = node.children.filter(x => x.type === 'JSXElement');

    let fixed = false;
    let prev = null;
    children.forEach((curr) => {
      if (prev && prev.loc.end.line === curr.loc.start.line) {
        context.report({
          node,
          message: 'Element in JSX should be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr, '\n'),
        });
        fixed = true;
      }
      prev = curr;
    });

    if (children.length) {
      const firstChild = children[0];
      const lastChild = children[children.length - 1];
      if (node.openingElement.loc.end.line === firstChild.loc.start.line) {
        context.report({
          node,
          message: 'Element in JSX should be on a new line.',
          loc: node.loc.start,
          fix: fixer => fixer.insertTextAfter(node.openingElement, '\n'),
        });
        fixed = true;
      }
      if (node.closingElement.loc.start.line === lastChild.loc.end.line) {
        context.report({
          node,
          message: 'Element in JSX should be on a new line.',
          loc: node.loc.start,
          fix: fixer => fixer.insertTextBefore(node.closingElement, '\n'),
        });
        fixed = true;
      }
    } else if (node.children.length === 1 && node.children[0].type === 'Literal') {
      // special case for literal node
      // XXX this is very limited, we should do it better.
      const src = sourceCode.getText(node, node.loc.start.column);
      const currIndent = src.substring(0, node.loc.start.column).match(/(\s*)$/)[1];
      const literal = node.children[0];
      if (!literal.value.match(/^\n/)) {
        context.report({
          node,
          message: 'Element in JSX should be on a new line.',
          loc: node.loc.start,
          fix: fixer => fixer.insertTextAfter(node.openingElement, `\n${currIndent}${indentStr}`),
        });
        fixed = true;
      }
      if (!literal.value.match(/\n\s*$/)) {
        context.report({
          node,
          message: 'Element in JSX should be on a new line.',
          loc: node.loc.start,
          fix: fixer => fixer.insertTextBefore(node.closingElement, `\n${currIndent}`),
        });
        fixed = true;
      }
    }

    const openingParen = sourceCode.getTokenBefore(node.openingElement);
    if (openingParen &&
        openingParen.value === '(' &&
        openingParen.loc.end.line === node.openingElement.loc.start.line) {
      context.report({
        node,
        message: 'Element in JSX should be on a new line.',
        loc: node.loc.start,
        fix: fixer => fixer.insertTextBefore(node.openingElement, '\n'),
      });
      fixed = true;
    }

    const closingParen = sourceCode.getTokenAfter(node.closingElement);
    if (closingParen &&
        closingParen.value === ')' &&
        closingParen.loc.start.line === node.closingElement.loc.end.line) {
      context.report({
        node,
        message: 'Element in JSX should be on a new line.',
        loc: node.loc.end,
        fix: fixer => fixer.insertTextAfter(node.closingElement, '\n'),
      });
      fixed = true;
    }

    if (fixed) fixingNodes.push(node);
  };

  return {
    JSXElement: enterJSXElement,
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce multi-line elements in JSX',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        allowSingleLine: { type: 'boolean' },
        maxElementsInSingleLine: { type: 'integer' },
        maxLenInSingleLine: { type: 'integer' },
      },
      additionalProperties: false,
    }],
  },
  create,
};
