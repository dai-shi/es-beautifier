const create = (context) => {
  const option = context.options[0] || {};
  const allowSingleLine = option.allowSingleLine;
  const maxStatements = option.maxStatementsInSingleLine;
  const maxLen = option.maxLenInSingleLine;

  const sourceCode = context.getSourceCode();

  const enterBlockStatementOrProgram = (node) => {
    if (allowSingleLine &&
        node.loc.start.line === node.loc.end.line &&
        (!maxStatements || node.body.length <= maxStatements) &&
        (!maxLen || sourceCode.lines[node.loc.end.line - 1].length < maxLen)) {
      // we accept one line
      return;
    }

    let prev = null;
    node.body.forEach((curr) => {
      if (prev && prev.loc.end.line === curr.loc.start.line) {
        context.report({
          node,
          message: 'Statement in a block must be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr, '\n'),
        });
      }
      prev = curr;
    });

    if (node.body.length && node.type === 'BlockStatement') {
      const firstToken = sourceCode.getFirstToken(node);
      const lastToken = sourceCode.getLastToken(node);
      const firstChild = node.body[0];
      const lastChild = node.body[node.body.length - 1];
      if (firstToken.loc.end.line === firstChild.loc.start.line) {
        context.report({
          node,
          message: 'Statement in a block must be on a new line.',
          loc: firstToken.loc.start,
          fix: fixer => fixer.insertTextAfter(firstToken, '\n'),
        });
      }
      if (lastToken.loc.start.line === lastChild.loc.end.line) {
        context.report({
          node,
          message: 'Statement in a block must be on a new line.',
          loc: lastToken.loc.end,
          fix: fixer => fixer.insertTextBefore(lastToken, '\n'),
        });
      }
    }
  };

  return {
    BlockStatement: enterBlockStatementOrProgram,
    Program: enterBlockStatementOrProgram,
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
