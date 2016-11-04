const rule = require('../../../lib/rules/multiline-block-statements.js');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('multiline-block-statements', rule, {
  valid: [
    'function f(){\na();\nb();\n}',
    'function f(){a();}',
  ],
  invalid: [{
    code: 'function f(){a();b();}',
    errors: [
      { message: 'Statement in a block must be on a new line.', type: 'BlockStatement' },
      { message: 'Statement in a block must be on a new line.', type: 'BlockStatement' },
    ],
  }],
});
