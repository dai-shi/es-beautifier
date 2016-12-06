const rule = require('../../../lib/rules/multiline-block-statements.js');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('multiline-block-statements', rule, {
  valid: [
    'function f(){\na();\nb();\n}',
    'function f(){\na();\n}',
    'function f(){/*comment*/\na();\n}',
  ],
  invalid: [{
    code: 'function f(){a();b();}',
    errors: [1, 2, 'and finally the end'].map(() => ({
      message: 'Statement in a block must be on a new line.',
      type: 'BlockStatement',
    })),
  }],
});
