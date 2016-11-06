const create = (context) => {
  const option = context.options[0] || {};
  const allowSingleLine = option.allowSingleLine !== false;
  const maxStatements = option.maxStatementsInSingleLine;
  const maxLen = option.maxLenInSingleLine || 80;

  const sourceCode = context.getSourceCode();

  const enterBlockStatement = (node) => {
    if (allowSingleLine &&
        node.loc.start.line === node.loc.end.line &&
        (!maxStatements || node.body.length <= maxStatements) &&
        (!maxLen || sourceCode.lines[node.loc.end.line - 1].length < maxLen)) {
      // we accept one line
      return;
    }

    let prev = node;
    node.body.forEach((curr) => {
      if (prev.loc.start.line === curr.loc.start.line) {
        context.report({
          node,
          message: 'Statement in a block must be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr, '\n'),
        });
      }
      prev = curr;
    });
    const last = prev;
    if (last !== node && node.loc.end.line === last.loc.end.line) {
      context.report({
        node,
        message: 'Statement in a block must be on a new line.',
        loc: last.loc.end,
        fix: fixer => fixer.insertTextAfter(last, '\n'),
      });
    }
  };

  return {
    BlockStatement: enterBlockStatement,
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce multi-line statements in a block',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        allowSingleLine: { type: 'boolean' },
        maxStatementsInSingleLine: { type: 'integer' },
        maxLenInSingleLine: { type: 'integer' },
      },
      additionalProperties: false,
    }],
  },
  create,
};
