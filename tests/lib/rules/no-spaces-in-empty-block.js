const rule = require('../../../lib/rules/no-spaces-in-empty-block.js');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('no-spaces-in-empty-block', rule, {
  valid: [
    'function f(){}',
    'if(true){}',
    'function f(){/*comment*/}',
    'function f(){/*comment*/\n}',
    'function f(){//comment\n}',
  ],
  invalid: [{
    code: 'function f(){ }',
    errors: [
      { message: 'Spaces in an empty block is not allowed.', type: 'BlockStatement' },
    ],
  }, {
    code: 'function f(){\n}',
    errors: [
      { message: 'Spaces in an empty block is not allowed.', type: 'BlockStatement' },
    ],
  }, {
    code: 'function f(){\t}',
    errors: [
      { message: 'Spaces in an empty block is not allowed.', type: 'BlockStatement' },
    ],
  }],
});
