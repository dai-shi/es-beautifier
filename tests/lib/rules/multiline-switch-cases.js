const rule = require('../../../lib/rules/multiline-switch-cases.js');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

const t1 = 'SwitchStatement';
const t2 = 'SwitchCase';

ruleTester.run('multiline-switch-cases', rule, {
  valid: [
    'switch(x){\ncase 1:\ny=1;\nbreak;\n}',
    'switch(x){\ncase 1: y=1;break;\n}',
    'switch(x){\ncase 1:\ny=1;\nz=1;\nbreak;\n}',
  ],
  invalid: [{
    code: 'switch(x){case 1: y=1;z=1;break;}',
    errors: [t1, t2, t2, t2, t1].map(type => ({
      message: type === t1 ?
        'Switch case in a switch statement must be on a new line.' :
        'Statement in a switch case must be on a new line.',
      type,
    })),
  }, {
    code: 'switch(x){\ncase 1:y=1;break;\n}',
    errors: [{
      message: 'Test in a switch case shoule follow a space.',
      type: t2,
    }],
  }],
});
