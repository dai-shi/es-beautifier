const {
  fixingNodes,
} = require('./es-beautifier-state.js');

const create = (context) => {
  const option = context.options[0] || {
    allowSingleLine: true,
    maxStatementsInSingleLine: 2,
    maxlenInSingleLine: 80,
  };
  const allowSingleLine = option.allowSingleLine;
  const maxStatements = option.maxStatementsInSingleLine;
  const maxLen = option.maxLenInSingleLine;

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

    if (node.cases.length) {
      const firstToken = sourceCode.getFirstToken(node);
      const lastToken = sourceCode.getLastToken(node);
      const firstChild = node.cases[0];
      const lastChild = node.cases[node.cases.length - 1];
      if (firstToken.loc.end.line === firstChild.loc.start.line) {
        context.report({
          node,
          message: 'Switch case in a switch statement must be on a new line.',
          loc: firstToken.loc.start,
          fix: fixer => fixer.insertTextBefore(firstChild, '\n'),
        });
      }
      if (lastToken.loc.start.line === lastChild.loc.end.line) {
        context.report({
          node,
          message: 'Switch case in a switch statement must be on a new line.',
          loc: lastToken.loc.end,
          fix: fixer => fixer.insertTextAfter(lastChild, '\n'),
        });
      }
    }
  };

  const enterSwitchCase = (node) => {
    if (allowSingleLine &&
        node.loc.start.line === node.loc.end.line &&
        (!maxStatements || node.consequent.length <= maxStatements) &&
        (!maxLen || sourceCode.lines[node.loc.end.line - 1].length < maxLen)) {
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
      let parent = node.parent;
      while (parent && parent.loc.start.line === node.loc.start.line) {
        if (fixingNodes.indexOf(parent) >= 0) {
          // we ignore this time as we are still in the process
          return;
        }
        parent = parent.parent;
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

    if (fixed) fixingNodes.push(node);
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
