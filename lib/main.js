module.exports = {
  rules: {
    'multiline-block-statements': require('./rules/multiline-block-statements.js'),
    'no-spaces-in-empty-block': require('./rules/no-spaces-in-empty-block.js'),
  },
  configs: {
    standard: require('./configs/standard.js'),
  },
};
