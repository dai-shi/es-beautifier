const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/multiline-import-specifiers.js');

const ruleTester = new RuleTester();

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

ruleTester.run('multiline-import-specifiers', rule, {
  valid: [{
    code: 'import foo from \'foo\'',
    parserOptions,
  }, {
    code: 'import {bar} from \'foo\'',
    parserOptions,
  }, {
    code: 'import {\na,\nb,\nc,\n} from \'foo\'',
    parserOptions,
  }],
  invalid: [{
    code: 'import {a,b,c,d} from \'foo\'',
    errors: [1, 2, 3, 4, 'and finally the end'].map(() => ({
      message: 'Specifiers in an import should be on a new line.',
      type: 'ImportDeclaration',
    })),
    parserOptions,
  }],
});
