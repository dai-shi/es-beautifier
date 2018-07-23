const { multilineFixer } = require('./es-beautifier-common.js');

const create = (context) => {
  const option = context.options[0] || {
    allowSingleLine: true,
    maxLenInSingleLine: 80,
  };
  const {
    allowSingleLine,
    maxPropertiesInSingleLine: maxChildren,
    maxLenInSingleLine: maxLen,
  } = option;

  const sourceCode = context.getSourceCode();

  const enterObjectExpression = multilineFixer({
    allowSingleLine,
    maxChildren,
    maxLen,
    context,
    sourceCode,
    childrenName: 'properties',
    message: 'Property in an object should be on a new line.',
  });

  return { ObjectExpression: enterObjectExpression };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce multi-line properties in an object',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        allowSingleLine: { type: 'boolean' },
        maxPropertiesInSingleLine: { type: 'integer' },
        maxLenInSingleLine: { type: 'integer' },
      },
      additionalProperties: false,
    }],
  },
  create,
};
