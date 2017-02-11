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

describe('issue #10', () => {
  it('the minimal example', () => {
    const input = `
x = (<Marker lat={lat} lng={lng} onMarkerClick={onMarkerClick} {...entry}/>);
`;
    const output = `
x = (
  <Marker
    lat={lat}
    lng={lng}
    onMarkerClick={onMarkerClick}
    {...entry}
  />);
`;
    assert.equal(execCLI(input), output);
  });
});
