const create = (context) => {
  const option = context.options[0] || {
    allowSingleLine: true,
    maxPropertiesInSingleLine: 1,
    maxLenInSingleLine: 80,
  };
  const allowSingleLine = option.allowSingleLine;
  const maxProperties = option.maxPropertiesInSingleLine;
  const maxLen = option.maxLenInSingleLine;

  const sourceCode = context.getSourceCode();

  const enterObjectExpression = (node) => {
    if (allowSingleLine &&
        node.loc.start.line === node.loc.end.line &&
        (!maxProperties || node.properties.length <= maxProperties) &&
        (!maxLen || sourceCode.lines[node.loc.end.line - 1].length < maxLen)) {
      // we accept one line
      return;
    }

    if (['ArrayExpression', 'Property'].indexOf(node.parent.type) >= 0 &&
        node.loc.start.line === node.loc.end.line &&
        node.loc.start.line === node.parent.loc.start.line) {
      // we ignore this time as we are still in the process
      return;
    }

    let prev = null;
    node.properties.forEach((curr) => {
      if (curr.loc.start.line === (prev ? prev.loc.end.line : node.loc.start.line)) {
        context.report({
          node,
          message: 'Property in an object should be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr, '\n'),
        });
      }
      prev = curr;
    });

    const last = prev;
    if (last && node.loc.end.line === last.loc.end.line) {
      context.report({
        node,
        message: 'Property in an object should be on a new line.',
        loc: last.loc.end,
        fix: fixer => fixer.insertTextAfter(last, '\n'),
      });
    }
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
    schema: [{
      type: 'object',
      properties: {
        allowSingleLine: { type: 'boolean' },
        maxPropertiesInSingleLine: { type: 'integer' },
        maxLenInSingleLine: { type: 'integer' },
      },
      additionalProperties: false,
    }],
  },
  create,
};
