const create = (context) => {
  const sourceCode = context.getSourceCode();

  const enterBlockStatement = (node) => {
    if (!node.body.length &&
        !sourceCode.getComments(node).trailing.length) {
      const start = sourceCode.getFirstToken(node).range[1];
      const end = sourceCode.getLastToken(node).range[0];
      if (start !== end) {
        context.report({
          node,
          message: 'Spaces in an empty block is not allowed.',
          loc: node.loc.start,
          fix: fixer => fixer.removeRange([start, end]),
        });
      }
    }
  };

  return {
    BlockStatement: enterBlockStatement,
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'disallow spaces in empty blocks',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
  },
  create,
};
