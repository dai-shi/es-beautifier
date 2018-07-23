const { multilineFixer } = require('./es-beautifier-common.js');

const create = (context) => {
  const option = context.options[0] || {};
  const {
    allowSingleLine,
    maxStatementsInSingleLine: maxChildren,
    maxLenInSingleLine: maxLen,
  } = option;

  const sourceCode = context.getSourceCode();

  const enterBlockStatement = multilineFixer({
    allowSingleLine,
    maxChildren,
    maxLen,
    context,
    sourceCode,
    childrenName: 'body',
    message: 'Statement in a block must be on a new line.',
  });

  return {
    BlockStatement: enterBlockStatement,
    Program: enterBlockStatement, // we reuse this rule for probram
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
