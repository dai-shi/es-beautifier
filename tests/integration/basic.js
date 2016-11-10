const path = require('path');
const assert = require('assert');
const execFileSync = require('child_process').execFileSync;
const mocha = require('mocha');

const { describe, it } = mocha;

const execCLI = input =>
  execFileSync(path.resolve(__dirname, '../../lib/cli.js'), {
    input,
    encoding: 'utf8',
  });

describe('blocks', () => {
  it('function expression 1', () => {
    const input = `
function f(){a();b();}
`;
    const output = `
function f() {
  a();
  b();
}
`;
    assert.equal(execCLI(input), output);
  });

  it('program 1', () => {
    const input = `
var x=1;var y=2;console.log(x+y);
`;
    const output = `
var x = 1;
var y = 2;
console.log(x + y);
`;
    assert.equal(execCLI(input), output);
  });
});

describe('arrays', () => {
  it('variable declaration 1', () => {
    const input = `
var x=[1,2,3,4,5];
`;
    const output = `
var x = [1, 2, 3, 4, 5];
`;
    assert.equal(execCLI(input), output);
  });
});

describe('objects', () => {
  it('object declaration 1', () => {
    const input = `
var x={a:1,b:2,c:3};
`;
    const output = `
var x = { a: 1, b: 2, c: 3 };
`;
    assert.equal(execCLI(input), output);
  });
});
