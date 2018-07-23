const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/jsx-separateline-literals.js');

const ruleTester = new RuleTester();

const parserOptions = {
  ecmaVersion: 2015,
  ecmaFeatures: { jsx: true },
};

ruleTester.run('jsx-separateline-literals', rule, {
  valid: [{
    code: 'x=(<div>aaa</div>)',
    parserOptions,
  }, {
    code: 'x=(\n  <div>\n    aaa\n  </div>\n)',
    parserOptions,
  }],
  invalid: [{
    code: 'x=(\n  <div>aaa\n</div>\n);',
    errors: [1, 2].map(() => ({
      message: 'JSXText in JSX Element should be on a separate line.',
      type: 'JSXElement',
    })),
    parserOptions,
  }, {
    code: 'x=(\n  <div>\naaa</div>\n);',
    errors: [1, 2].map(() => ({
      message: 'JSXText in JSX Element should be on a separate line.',
      type: 'JSXElement',
    })),
    parserOptions,
  }],
});
