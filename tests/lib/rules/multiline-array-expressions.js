const rule = require('../../../lib/rules/multiline-array-expressions.js');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('multiline-array-expressions', rule, {
  valid: [
    '[1,2,3]',
    '[\n1,\n2,\n3\n]',
  ],
  invalid: [{
    code: '[\'loooooooooooooooooooong\',\'loooooooooooooooooooong\',\'loooooooooooooooooooong\',\'loooooooooooooooooooong\']',
    errors: [1, 2, 3, 4, 'and finally the end'].map(() => ({
      message: 'Expression in an array should be on a new line.',
      type: 'ArrayExpression',
    })),
  }],
});
