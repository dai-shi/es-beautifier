const create = (context) => {
  const option = context.options[0] || {};
  const allowOneLine = option.allowOneLine !== false;
  const maxStatementsInOneLine = option.maxStatementsInOneLine || 1;
  const maxLenInOneLine = option.maxLenInOneLine || 80;

  const sourceCode = context.getSourceCode();

  const enterBlockStatement = (node) => {
    if (allowOneLine &&
        node.body.length <= maxStatementsInOneLine &&
        node.loc.start.line === node.loc.end.line &&
        sourceCode.lines[node.loc.end.line - 1].length < maxLenInOneLine) {
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
        allowOneLine: { type: 'boolean' },
        maxStatementsInOneLine: { type: 'integer' },
        maxLenInOneLine: { type: 'integer' },
      },
      additionalProperties: false,
    }],
  },
  create,
};