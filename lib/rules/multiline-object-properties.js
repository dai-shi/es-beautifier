const create = (context) => {
  const sourceCode = context.getSourceCode();

  const enterObjectExpression = (node) => {
    if (node.loc.start.line === node.loc.end.line) {
      // we accept one line
      return;
    }

    let prev = null;
    node.properties.forEach((curr) => {
      if (prev && prev.loc.end.line === curr.loc.start.line) {
        context.report({
          node,
          message: 'Property in an object should be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr, '\n'),
        });
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
      }
      if (lastToken.loc.start.line === lastChild.loc.end.line) {
        context.report({
          node,
          message: 'Property in an object should be on a new line.',
          loc: lastToken.loc.end,
          fix: fixer => fixer.insertTextBefore(lastToken, '\n'),
        });
      }
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
  },
  create,
};
