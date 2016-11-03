const create = (context) => {
  const enterBlockStatement = (node) => {
    let prev = node;
    node.body.forEach((curr) => {
      if (prev.loc.start.line === curr.loc.start.line) {
        context.report({
          node,
          message: 'statement in a block to be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr, '\n'),
        });
      }
      prev = curr;
    });
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
  },
  create,
};
