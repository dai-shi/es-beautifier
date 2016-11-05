const rule = require('../../../lib/rules/multiline-object-properties.js');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('multiline-object-properties', rule, {
  valid: [
    'x={a:1,b:2,c:3}',
    'x={\na:1,\nb:2,\nc:3\n}',
  ],
  invalid: [{
    code: 'x={a:\'loooooooooooooooooooong\',b:\'loooooooooooooooooooong\',c:\'loooooooooooooooooooong\',d:\'loooooooooooooooooooong\'}',
    errors: [1, 2, 3, 4, 'and finally the end'].map(() => ({
      message: 'Property in an object should be on a new line.',
      type: 'ObjectExpression',
    })),
  }],
});
