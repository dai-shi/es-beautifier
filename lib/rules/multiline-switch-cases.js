const { fixingNodes } = require('./es-beautifier-common.js');

const create = (context) => {
  const option = context.options[0] || {
    allowSingleLine: true,
    maxStatementsInSingleLine: 2,
    maxlenInSingleLine: 80,
  };
  const {
    allowSingleLine,
    maxStatementsInSingleLine: maxStatements,
    maxLenInSingleLine: maxLen,
  } = option;

  const sourceCode = context.getSourceCode();

  const enterSwitchStatement = (node) => {
    let prev = null;
    node.cases.forEach((curr) => {
      if (prev && prev.loc.end.line === curr.loc.start.line) {
        context.report({
          node,
          message: 'Switch case in a switch statement must be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr, '\n'),
        });
      }
      prev = curr;
    });
  };

  const enterSwitchCase = (node) => {
    if (allowSingleLine
      && node.loc.start.line === node.loc.end.line
      && (!maxStatements || node.consequent.length <= maxStatements)
      && (!maxLen || sourceCode.lines[node.loc.end.line - 1].length < maxLen)) {
      // we accept one line
      // but require a space
      if (node.consequent.length) {
        const punctuator = sourceCode.getTokenBefore(node.consequent[0]);
        if (punctuator.type === 'Punctuator' && punctuator.range[1] === node.consequent[0].range[0]) {
          context.report({
            node,
            message: 'Test in a switch case shoule follow a space.',
            loc: punctuator.loc.end,
            fix: fixer => fixer.insertTextAfter(punctuator, ' '),
          });
        }
      }
      return;
    }

    if (allowSingleLine) {
      let { parent } = node;
      while (parent && parent.loc.start.line === node.loc.start.line) {
        if (fixingNodes.has(parent)) {
          // we ignore this time as we are still in the process
          return;
        }
        ({ parent } = parent);
      }
    }

    let fixed = false;
    let prev = null;
    node.consequent.forEach((curr) => {
      if (prev && prev.loc.end.line === curr.loc.start.line) {
        context.report({
          node,
          message: 'Statement in a switch case must be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr, '\n'),
        });
        fixed = true;
      }
      prev = curr;
    });

    if (node.consequent.length) {
      const firstToken = sourceCode.getFirstToken(node);
      const firstChild = node.consequent[0];
      if (firstToken.loc.end.line === firstChild.loc.start.line) {
        context.report({
          node,
          message: 'Statement in a switch case must be on a new line.',
          loc: firstToken.loc.start,
          fix: fixer => fixer.insertTextBefore(firstChild, '\n'),
        });
        fixed = true;
      }
    }

    if (fixed) fixingNodes.add(node);
  };

  return {
    SwitchStatement: enterSwitchStatement,
    SwitchCase: enterSwitchCase,
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce multi-line switch cases in a switch statement',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        allowSingleLine: { type: 'boolean' },
        maxStatementsInSingleLine: { type: 'integer' },
        maxLenInSingleLine: { type: 'integer' },
      },
      additionalProperties: false,
    }],
  },
  create,
};
