module.exports = {
  rules: {
    'multiline-block-statements': require('./rules/multiline-block-statements.js'),
    'no-spaces-in-empty-block': require('./rules/no-spaces-in-empty-block.js'),
    'multiline-object-properties': require('./rules/multiline-object-properties.js'),
    'multiline-array-elements': require('./rules/multiline-array-elements.js'),
    'multiline-class-body': require('./rules/multiline-class-body.js'),
    'jsx-multiline-elements': require('./rules/jsx-multiline-elements.js'),
  },
  configs: {
    standard: require('./configs/standard.js'),
  },
};
