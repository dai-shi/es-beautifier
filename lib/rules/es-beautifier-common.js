const { fixingNodes } = require('./es-beautifier-state.js');

exports.multilineFixer = ({
  allowSingleLine,
  maxChildren,
  maxLen,
  context,
  sourceCode,
  childrenName,
  message,
}) => (node) => {
  if (allowSingleLine &&
    node.loc.start.line === node.loc.end.line &&
    (!maxChildren || node[childrenName].length <= maxChildren) &&
    (!maxLen || sourceCode.lines[node.loc.end.line - 1].length < maxLen)) {
    // we accept one line
    return;
  }

  let parent = node.parent;
  while (parent && parent.loc.start.line === node.loc.start.line) {
    if (fixingNodes.indexOf(parent) >= 0) {
      // we ignore this time as we are still in the process
      return;
    }
    parent = parent.parent;
  }

  let fixed = false;
  let prev = null;
  node[childrenName].forEach((curr) => {
    if (prev && prev.loc.end.line === curr.loc.start.line) {
      context.report({
        node,
        message,
        loc: curr.loc.start,
        fix: fixer => fixer.insertTextBefore(curr, '\n'),
      });
      fixed = true;
    }
    prev = curr;
  });

  if (node[childrenName].length) {
    const firstToken = sourceCode.getFirstToken(node);
    const lastToken = sourceCode.getLastToken(node);
    const firstChild = node.properties[0];
    const lastChild = node.properties[node.properties.length - 1];
    if (firstToken.loc.end.line === firstChild.loc.start.line) {
      context.report({
        node,
        message,
        loc: firstToken.loc.start,
        fix: fixer => fixer.insertTextAfter(firstToken, '\n'),
      });
      fixed = true;
    }
    if (lastToken.loc.start.line === lastChild.loc.end.line) {
      context.report({
        node,
        message,
        loc: lastToken.loc.end,
        fix: fixer => fixer.insertTextBefore(lastToken, '\n'),
      });
      fixed = true;
    }
  }

  if (fixed) fixingNodes.push(node);
};
