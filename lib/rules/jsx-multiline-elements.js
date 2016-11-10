const create = (context) => {
  const option = context.options[0] || {
    allowSingleLine: true,
    maxLenInSingleLine: 80,
  };
  const allowSingleLine = option.allowSingleLine;
  const maxElements = option.maxElementsInSingleLine;
  const maxLen = option.maxLenInSingleLine;

  const sourceCode = context.getSourceCode();

  const enterJSXElement = (node) => {
    if (allowSingleLine &&
        node.loc.start.line === node.loc.end.line &&
        (!maxElements || node.elements.length <= maxElements) &&
        (!maxLen || sourceCode.lines[node.loc.end.line - 1].length < maxLen)) {
      // we accept one line
      return;
    }

    if (node.parent.type === 'JSXElement' &&
        node.loc.start.line === node.loc.end.line &&
        node.loc.start.line === node.parent.loc.start.line) {
      // we ignore this time as we are still in the process
      return;
    }

    const children = node.children.filter(x => x.type === 'JSXElement');

    let prev = null;
    children.forEach((curr) => {
      if (prev && prev.loc.end.line === curr.loc.start.line) {
        context.report({
          node,
          message: 'Element in JSX should be on a new line.',
          loc: curr.loc.start,
          fix: fixer => fixer.insertTextBefore(curr.openingElement, '\n'),
        });
      }
      prev = curr;
    });

    if (children.length) {
      const firstChild = children[0];
      const lastChild = children[children.length - 1];
      if (node.openingElement.loc.end.line === firstChild.loc.start.line) {
        context.report({
          node,
          message: 'Element in JSX should be on a new line.',
          loc: node.loc.start,
          fix: fixer => fixer.insertTextAfter(node.openingElement, '\n'),
        });
      }
      if (node.closingElement.loc.start.line === lastChild.loc.end.line) {
        context.report({
          node,
          message: 'Element in JSX should be on a new line.',
          loc: node.loc.start,
          fix: fixer => fixer.insertTextBefore(node.closingElement, '\n'),
        });
      }
    }
  };

  return {
    JSXElement: enterJSXElement,
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'enforce multi-line elements in JSX',
      category: 'Stylistic Issues',
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        allowSingleLine: { type: 'boolean' },
        maxElementsInSingleLine: { type: 'integer' },
        maxLenInSingleLine: { type: 'integer' },
      },
      additionalProperties: false,
    }],
  },
  create,
};
