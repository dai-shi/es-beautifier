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

  const sourceCode = context.getSourceCode();

  const enterArrayExpression = (node) => {
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

    let fixed = false;
    let prev = null;
    node.elements.forEach((curr) => {
      if (prev && prev.loc.end.line === curr.loc.start.line) {
        if (prev.type === 'ObjectExpression' &&
            curr.type === 'ObjectExpression') {
          // we simply ignore in this case
        } else {
          context.report({
            node,
            message: 'Expression in an array should be on a new line.',
            loc: curr.loc.start,
            fix: fixer => fixer.insertTextBefore(curr, '\n'),
          });
          fixed = true;
        }
      }
      prev = curr;
    });

    if (node.elements.length) {
      const firstToken = sourceCode.getFirstToken(node);
      const lastToken = sourceCode.getLastToken(node);
      const firstChild = node.elements[0];
      const lastChild = node.elements[node.elements.length - 1];
      if (firstToken.loc.end.line === firstChild.loc.start.line &&
        firstChild.type !== 'ObjectExpression') {
        context.report({
          node,
          message: 'Expression in an array should be on a new line.',
          loc: firstToken.loc.start,
          fix: fixer => fixer.insertTextAfter(firstToken, '\n'),
        });
        fixed = true;
      }
      if (lastToken.loc.start.line === lastChild.loc.end.line &&
          lastChild.type !== 'ObjectExpression') {
        context.report({
          node,
          message: 'Expression in an array should be on a new line.',
          loc: lastToken.loc.end,
          fix: fixer => fixer.insertTextBefore(lastToken, '\n'),
        });
        fixed = true;
      }
    }

    if (fixed) fixingNodes.push(node);
  };

  return {
    ArrayExpression: enterArrayExpression,
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce multi-line elements in an array',
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
