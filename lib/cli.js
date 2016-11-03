#!/usr/bin/env node

const program = require('commander');
const CLIEngine = require('eslint').CLIEngine;
const pjson = require('../package.json');
const configs = require('./main.js').configs;

program
  .version(pjson.version)
  .usage('[options] <file ...>')
  .option('-c, --config [name]', 'Specify config name [standard]', 'standard')
  .parse(process.argv);

const config = configs[program.config];
config.fix = true;
config.useEslintrc = false;
const cli = new CLIEngine(config);

if (program.args.length) {
  const report = cli.executeOnFiles(program.args);
  CLIEngine.outputFixes(report);
} else {
  process.stdin.setEncoding('utf8');
  const chunks = [];
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) chunks.push(chunk);
  });
  process.stdin.on('end', () => {
    const text = chunks.join('');
    const report = cli.executeOnText(text);
    process.stdout.write(report.results[0].output, 'utf8');
  });
}
