const fixingNodes = new Set();
exports.fixingNodes = fixingNodes;

const findPunctuator = (targetValue, nodeOrToken, nextFunc) => (
  nodeOrToken && (
    nodeOrToken.type === 'Punctuator' && nodeOrToken.value === targetValue
      ? nodeOrToken
      : findPunctuator(targetValue, nextFunc(nodeOrToken), nextFunc)
  )
);

const getFirstChild = childrenName => node => node[childrenName][0];
const getLastChild = childrenName => node => node[childrenName][node[childrenName].length - 1];

const findOpeningBrace = (sourceCode, childrenName) => node => findPunctuator('{', getFirstChild(childrenName)(node), sourceCode.getTokenBefore.bind(sourceCode));

const findClosingBrace = (sourceCode, childrenName) => node => findPunctuator('}', getLastChild(childrenName)(node), sourceCode.getTokenAfter.bind(sourceCode));

exports.multilineFixer = ({
  allowSingleLine = false,
  maxChildren = 0,
  maxLen = 0,
  context,
  sourceCode,
  childrenName,
  message,
  findOpeningToken = findOpeningBrace,
  findClosingToken = findClosingBrace,
}) => (node) => {
  const children = node[childrenName];

  if (allowSingleLine
    && node.loc.start.line === node.loc.end.line
    && (!maxChildren || children.length <= maxChildren)
    && (!maxLen || sourceCode.lines[node.loc.end.line - 1].length < maxLen)) {
    // we accept one line
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
  children.forEach((curr) => {
    if (prev && prev.loc.end.line === curr.loc.start.line) {
      context.report({
        node,
        message,
        loc: curr.loc.start,
        fix: fixer => fixer.insertTextBefore(curr, '\n'),
      });
      fixingNodes.add(prev); // XXX a hack (not sure how this works)
      fixingNodes.add(curr);
      fixed = true;
    }
    prev = curr;
  });

  if (children.length) {
    const firstChild = children[0];
    const lastChild = children[children.length - 1];
    const firstToken = findOpeningToken(sourceCode, childrenName)(node);
    const lastToken = findClosingToken(sourceCode, childrenName)(node);
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

  if (fixed) fixingNodes.add(node);
};
