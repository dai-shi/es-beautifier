const rule = require('../../../lib/rules/multiline-block-statements.js');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('multiline-block-statements', rule, {
  valid: [
    'function f(){\na();\nb();\n}',
    'function f(){a();}',
  ],
  invalid: [
    {
      code: 'function f(){a();b();}',
      errors: [
        { message: 'statement in a block to be on a new line.', type: 'BlockStatement' },
        { message: 'statement in a block to be on a new line.', type: 'BlockStatement' },
      ],
    },
  ],
});
