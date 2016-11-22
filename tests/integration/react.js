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

describe('jsx', () => {
  it('jsx 1', () => {
    const input = `
const App = () => (<div><span><a href="http://localhost/index.html">index</a></span></div>);
`;
    const output = `
const App = () => (<div>
  <span><a href="http://localhost/index.html">index</a></span>
</div>);
`;
    assert.equal(execCLI(input), output);
  });

  it('jsx 2', () => {
    const input = `
const App = () => (<div><Component attribute1="value1" attribute2="value2" attribute3="value3">foo</Component></div>);
`;
    const output = `
const App = () => (<div>
  <Component
    attribute1="value1"
    attribute2="value2"
    attribute3="value3"
  >foo</Component>
</div>);
`;
    assert.equal(execCLI(input), output);
  });
});
