const {
  fixingClassBody,
} = require('./es-beautifier-state.js');

const create = (context) => {
  const sourceCode = context.getSourceCode();

  const enterClassBody = (node) => {
    let fixed = false;
    let prev = null;
    node.body.forEach((curr) => {
      if (prev && prev.loc.end.line === curr.loc.start.line) {
        context.report({
          node,
          message: 'Method definition in a class body must be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr, '\n'),
        });
        fixed = true;
      }
      prev = curr;
    });

    if (node.body.length) {
      const firstToken = sourceCode.getFirstToken(node);
      const lastToken = sourceCode.getLastToken(node);
      const firstChild = node.body[0];
      const lastChild = node.body[node.body.length - 1];
      if (firstToken.loc.end.line === firstChild.loc.start.line) {
        context.report({
          node,
          message: 'Method definition in a class body must be on a new line.',
          loc: firstToken.loc.start,
          fix: fixer => fixer.insertTextBefore(firstChild, '\n'),
        });
        fixed = true;
      }
      if (lastToken.loc.start.line === lastChild.loc.end.line) {
        context.report({
          node,
          message: 'Method definition in a class body must be on a new line.',
          loc: lastToken.loc.end,
          fix: fixer => fixer.insertTextAfter(lastChild, '\n'),
        });
        fixed = true;
      }
    }

    if (fixed) fixingClassBody.push(node);
  };

  return {
    ClassBody: enterClassBody,
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce multi-line method definitions in a class body',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
  },
  create,
};
