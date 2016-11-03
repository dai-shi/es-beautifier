#!/usr/bin/env node

const program = require('commander');
const CLIEngine = require('eslint').CLIEngine;
const pjson = require('../package.json');

program
  .version(pjson.version)
  .usage('[options] <file ...>')
  .option('-c, --config [name]', 'Specify config name [standard]', 'standard')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}

const configs = require('./main.js').configs;

const config = configs[program.config];
config.fix = true;
config.useEslintrc = false;
const cli = new CLIEngine(config);
const report = cli.executeOnFiles(program.args);
CLIEngine.outputFixes(report);
