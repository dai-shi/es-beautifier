const { multilineFixer } = require('./es-beautifier-common.js');

const findOpeningToken = sourceCode => node => sourceCode.getFirstToken(node);

const findClosingToken = sourceCode => node => sourceCode.getLastToken(node);

const create = (context) => {
  const option = context.options[0] || {
    allowSingleLine: true,
    maxAttributesInSingleLine: 3,
    maxLenInSingleLine: 80,
  };
  const {
    allowSingleLine,
    maxAttributesInSingleLine: maxChildren,
    maxLenInSingleLine: maxLen,
  } = option;

  const sourceCode = context.getSourceCode();

  const enterJSXOpeningElement = multilineFixer({
    allowSingleLine,
    maxChildren,
    maxLen,
    context,
    sourceCode,
    childrenName: 'attributes',
    message: 'Attribute in JSX should be on a new line.',
    findOpeningToken,
    findClosingToken,
  });

  return {
    JSXOpeningElement: enterJSXOpeningElement,
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce multi-line attributes in JSX',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        allowSingleLine: { type: 'boolean' },
        maxAttributesInSingleLine: { type: 'integer' },
        maxLenInSingleLine: { type: 'integer' },
      },
      additionalProperties: false,
    }],
  },
  create,
};
