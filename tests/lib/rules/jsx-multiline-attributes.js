const rule = require('../../../lib/rules/jsx-multiline-attributes.js');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

const parserOptions = {
  ecmaVersion: 2015,
  ecmaFeatures: { jsx: true },
};

ruleTester.run('jsx-multiline-attributes', rule, {
  valid: [{
    code: 'x=<div aaa="111">yyy</div>',
    parserOptions,
  }, {
    code: 'x=<div\naaa="111"\nbbb="222"\nccc="333"\nddd="444"\n>yyy</div>',
    parserOptions,
  }],
  invalid: [{
    code: 'x=<div aaa="111" bbb="222" ccc="333" ddd="444">yyy</div>',
    errors: [1, 2, 3, 4, 'and finally the end'].map(() => ({
      message: 'Attribute in JSX should be on a new line.',
      type: 'JSXOpeningElement',
    })),
    parserOptions,
  }],
});
