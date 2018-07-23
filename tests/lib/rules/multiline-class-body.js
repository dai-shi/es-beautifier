const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/multiline-class-body.js');

const ruleTester = new RuleTester();

const parserOptions = {
  ecmaVersion: 2015,
};

ruleTester.run('multiline-class-body', rule, {
  valid: [{
    code: 'class X{}',
    parserOptions,
  }, {
    code: 'class X{\na(){}\n}',
    parserOptions,
  }, {
    code: 'class X{\na(){}\nb(){}\n}',
    parserOptions,
  }],
  invalid: [{
    code: 'class X{a(){}b(){}}',
    errors: [1, 2, 'and finally the end'].map(() => ({
      message: 'Method definition in a class body must be on a new line.',
      type: 'ClassBody',
    })),
    parserOptions,
  }],
});
