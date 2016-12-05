module.exports = {
  rules: {
    'multiline-block-statements': require('./rules/multiline-block-statements.js'),
    'no-spaces-in-empty-block': require('./rules/no-spaces-in-empty-block.js'),
    'multiline-object-properties': require('./rules/multiline-object-properties.js'),
    'multiline-array-elements': require('./rules/multiline-array-elements.js'),
    'multiline-switch-cases': require('./rules/multiline-switch-cases.js'),
    'multiline-class-body': require('./rules/multiline-class-body.js'),
    'multiline-import-specifiers': require('./rules/multiline-import-specifiers'),
    'jsx-multiline-elements': require('./rules/jsx-multiline-elements.js'),
    'jsx-separateline-literals': require('./rules/jsx-separateline-literals'),
    'jsx-multiline-attributes': require('./rules/jsx-multiline-attributes.js'),
  },
  configs: {
    standard: require('./configs/standard.js'),
  },
};
