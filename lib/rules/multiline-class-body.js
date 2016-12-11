const { multilineFixer } = require('./es-beautifier-common.js');

const create = (context) => {
  const sourceCode = context.getSourceCode();

  const enterClassBody = multilineFixer({
    context,
    sourceCode,
    childrenName: 'body',
    message: 'Method definition in a class body must be on a new line.',
  });

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
