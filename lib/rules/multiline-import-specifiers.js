const { multilineFixer } = require('./es-beautifier-common.js');

const create = (context) => {
  const option = context.options[0] || {
    allowSingleLine: true,
    maxSpecifiersInSingleLine: 3,
    maxLenInSingleLine: 80,
  };
  const {
    allowSingleLine,
    maxSpecifiersInSingleLine: maxChildren,
    maxLenInSingleLine: maxLen,
  } = option;

  const sourceCode = context.getSourceCode();

  const enterImportDeclaration = multilineFixer({
    allowSingleLine,
    maxChildren,
    maxLen,
    context,
    sourceCode,
    childrenName: 'specifiers',
    message: 'Specifiers in an import should be on a new line.',
  });

  return { ImportDeclaration: enterImportDeclaration };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce multi-line specifiers in an import',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        allowSingleLine: { type: 'boolean' },
        maxSpecifiersInSingleLine: { type: 'integer' },
        maxLenInSingleLine: { type: 'integer' },
      },
      additionalProperties: false,
    }],
  },
  create,
};
