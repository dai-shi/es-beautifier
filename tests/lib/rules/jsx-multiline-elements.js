const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/jsx-multiline-elements.js');

const ruleTester = new RuleTester();

const parserOptions = {
  ecmaVersion: 2015,
  ecmaFeatures: { jsx: true },
};

ruleTester.run('jsx-multiline-elements', rule, {
  valid: [{
    code: 'x=<div>aaa</div>',
    parserOptions,
  }, {
    code: 'x=(<div>aaa</div>)',
    parserOptions,
  }, {
    code: 'x=<div>\naaa\n</div>',
    parserOptions,
  }, {
    code: 'x=(\n<div>\naaa\n</div>\n)',
    parserOptions,
  }],
  invalid: [{
    code: 'x=<div><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></div>',
    errors: [1, 'and finally the end'].map(() => ({
      message: 'Element in JSX should be on a new line.',
      type: 'JSXElement',
    })),
    parserOptions,
  }, {
    code: 'x=(<div><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></div>)',
    errors: [1, 2, 3, 'and finally the end'].map(() => ({
      message: 'Element in JSX should be on a new line.',
      type: 'JSXElement',
    })),
    parserOptions,
  }],
});
