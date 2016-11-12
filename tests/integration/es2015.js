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

describe('classes', () => {
  it('class deeclaration 1', () => {
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
