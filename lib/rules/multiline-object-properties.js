const {
  fixingNodes,
} = require('./es-beautifier-state.js');

const create = (context) => {
  const option = context.options[0] || {
    allowSingleLine: true,
    maxLenInSingleLine: 80,
  };
  const allowSingleLine = option.allowSingleLine;
  const maxProperties = option.maxPropertiesInSingleLine;
  const maxLen = option.maxLenInSingleLine;

  const sourceCode = context.getSourceCode();

  const enterObjectExpression = (node) => {
    if (allowSingleLine &&
        node.loc.start.line === node.loc.end.line &&
        (!maxProperties || node.elements.length <= maxProperties) &&
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
    node.properties.forEach((curr) => {
      if (prev && prev.loc.end.line === curr.loc.start.line) {
        context.report({
          node,
          message: 'Property in an object should be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr, '\n'),
        });
        fixed = true;
      }
      prev = curr;
    });

    if (node.properties.length) {
      const firstToken = sourceCode.getFirstToken(node);
      const lastToken = sourceCode.getLastToken(node);
      const firstChild = node.properties[0];
      const lastChild = node.properties[node.properties.length - 1];
      if (firstToken.loc.end.line === firstChild.loc.start.line) {
        context.report({
          node,
          message: 'Property in an object should be on a new line.',
          loc: firstToken.loc.start,
          fix: fixer => fixer.insertTextAfter(firstToken, '\n'),
        });
        fixed = true;
      }
      if (lastToken.loc.start.line === lastChild.loc.end.line) {
        context.report({
          node,
          message: 'Property in an object should be on a new line.',
          loc: lastToken.loc.end,
          fix: fixer => fixer.insertTextBefore(lastToken, '\n'),
        });
        fixed = true;
      }
    }

    if (fixed) fixingNodes.push(node);
  };

  return {
    ObjectExpression: enterObjectExpression,
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce multi-line properties in an object',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
  },
  create,
};
