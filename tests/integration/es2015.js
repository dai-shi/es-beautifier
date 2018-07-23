const path = require('path');
const assert = require('assert');
const { execFileSync } = require('child_process');
const mocha = require('mocha');

const { describe, it } = mocha;

const execCLI = input => execFileSync(path.resolve(__dirname, '../../lib/cli.js'), {
  input,
  encoding: 'utf8',
});

describe('classes', () => {
  it('class declaration 1', () => {
    const input = `
class Hello{constructor(m){this.message=m;}say(){console.log(this.message);}}
`;
    const output = `
class Hello {
  constructor(m) {
    this.message = m;
  }
  say() {
    console.log(this.message);
  }
}
`;
    assert.equal(execCLI(input), output);
  });
});

describe('modules', () => {
  it('import declaration 1', () => {
    const input = `
import {exampleA,exampleB,exampleC,exampleD,exampleE,exampleF,exampleG,exampleH} from 'example';
`;
    const output = `
import {
  exampleA,
  exampleB,
  exampleC,
  exampleD,
  exampleE,
  exampleF,
  exampleG,
  exampleH,
} from 'example';
`;
    assert.equal(execCLI(input), output);
  });
});
