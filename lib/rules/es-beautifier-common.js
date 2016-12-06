const { fixingNodes } = require('./es-beautifier-state.js');

const findPunctuator = (targetValue, nodeOrToken, nextFunc) => (
  nodeOrToken && (
    nodeOrToken.type === 'Punctuator' && nodeOrToken.value === targetValue ?
    nodeOrToken :
    findPunctuator(targetValue, nextFunc(nodeOrToken), nextFunc)
  )
);

exports.multilineFixer = ({
  allowSingleLine,
  maxChildren,
  maxLen,
  context,
  sourceCode,
  childrenName,
  message,
  startPunctuator = '{',
  endPunctuator = '}',
}) => (node) => {
  const children = node[childrenName];

  if (allowSingleLine &&
    node.loc.start.line === node.loc.end.line &&
    (!maxChildren || children.length <= maxChildren) &&
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
  children.forEach((curr) => {
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

  if (children.length) {
    const firstChild = children[0];
    const lastChild = children[children.length - 1];
    const firstToken = findPunctuator(startPunctuator, firstChild, sourceCode.getTokenBefore);
    const lastToken = findPunctuator(endPunctuator, lastChild, sourceCode.getTokenAfter);
    if (firstToken && firstToken.loc.end.line === firstChild.loc.start.line) {
      context.report({
        node,
        message,
        loc: firstChild.loc.start,
        fix: fixer => fixer.insertTextBefore(firstChild, '\n'),
      });
      fixed = true;
    }
    if (lastToken && lastToken.loc.start.line === lastChild.loc.end.line) {
      context.report({
        node,
        message,
        loc: lastToken.loc.start,
        fix: fixer => fixer.insertTextBefore(lastToken, '\n'),
      });
      fixed = true;
    }
  }

  if (fixed) fixingNodes.push(node);
};
