const path = require('path');
const assert = require('assert');
const { execFileSync } = require('child_process');
const mocha = require('mocha');

const { describe, it } = mocha;

const execCLI = input => execFileSync(path.resolve(__dirname, '../../lib/cli.js'), {
  input,
  encoding: 'utf8',
});

describe('blocks', () => {
  it('function declaration 1', () => {
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

  it('function declaration 2', () => {
    const input = `
function f(){/* comment */a();b();}
`;
    const output = `
function f() { /* comment */
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

describe('objects in arrays', () => {
  it('object/array declaration 1', () => {
    const input = `
var x=[{a:1},{b:2},{c:3}];
`;
    const output = `
var x = [{ a: 1 }, { b: 2 }, { c: 3 }];
`;
    assert.equal(execCLI(input), output);
  });

  it('object/array declaration 2', () => {
    const input = `
var x=[{a:1,b:2,c:3},{a:1,b:2,c:3},{a:1,b:2,c:3},{a:1,b:2,c:3},{a:1,b:2,c:3}];
`;
    const output = `
var x = [{
  a: 1,
  b: 2,
  c: 3,
}, {
  a: 1,
  b: 2,
  c: 3,
}, {
  a: 1,
  b: 2,
  c: 3,
}, {
  a: 1,
  b: 2,
  c: 3,
}, {
  a: 1,
  b: 2,
  c: 3,
}];
`;
    assert.equal(execCLI(input), output);
  });
});

describe('arrays in objects', () => {
  it('array/object declaration 1', () => {
    const input = `
var x={a:[1,2,3],b:[1,2,3],c:[1,2,3],d:[1,2,3],e:[1,2,3]};
`;
    const output = `
var x = {
  a: [1, 2, 3],
  b: [1, 2, 3],
  c: [1, 2, 3],
  d: [1, 2, 3],
  e: [1, 2, 3],
};
`;
    assert.equal(execCLI(input), output);
  });
});

describe('switch statements', () => {
  it('switch statement 1', () => {
    const input = `
function f(){switch(x){case 1:return'1';case 2:return'2';default:return'0';}}
`;
    const output = `
function f() {
  switch (x) {
    case 1: return '1';
    case 2: return '2';
    default: return '0';
  }
}
`;
    assert.equal(execCLI(input), output);
  });
});
