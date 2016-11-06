module.exports = {
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['es-beautifier', 'react'],
  rules: {
    'es-beautifier/multiline-block-statements': 'error',
    'es-beautifier/no-spaces-in-empty-block': 'error',
    'es-beautifier/multiline-object-properties': 'error',
    'es-beautifier/multiline-array-expressions': 'error',
    curly: ['error', 'multi-line'],
    'dot-location': ['error', 'property'],
    'no-multi-spaces': 'error',
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': ['error', 'always'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': ['error', 'last'],
    'computed-property-spacing': ['error', 'never'],
    'eol-last': ['error', 'always'],
    'func-call-spacing': ['error', 'never'],
    indent: ['error', 2, { SwitchCase: 1, VariableDeclarator: 1, outerIIFEBody: 1 }],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'keyword-spacing': ['error', {
      before: true,
      after: true,
      overrides: {
        return: { after: true },
        throw: { after: true },
        case: { after: true },
      },
    }],
    'linebreak-style': ['error', 'unix'],
    'lines-around-comment': 'error',
    'lines-around-directive': ['error', {
      before: 'always',
      after: 'always',
    }],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'object-curly-spacing': ['error', 'always'],
    'one-var-declaration-per-line': ['error', 'always'],
    'padded-blocks': ['error', 'never'],
    'semi-spacing': ['error', { before: false, after: true }],
    semi: ['error', 'always'],
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': ['error', {
      words: true,
      nonwords: false,
      overrides: {},
    }],
    'spaced-comment': ['error', 'always', {
      exceptions: ['-', '+'],
      markers: ['=', '!'],
    }],
    'unicode-bom': ['error', 'never'],
    'arrow-body-style': ['error', 'as-needed', {
      requireReturnForObjectLiteral: false,
    }],
    'arrow-parens': ['error', 'as-needed', {
      requireForBlockBody: true,
    }],
    'arrow-spacing': ['error', { before: true, after: true }],
    'generator-star-spacing': ['error', { before: false, after: true }],
    'prefer-numeric-literals': 'error',
    'rest-spread-spacing': ['error', 'never'],
    'template-curly-spacing': 'error',
    'yield-star-spacing': ['error', 'after'],
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'react/jsx-curly-spacing': ['error', 'never', { allowMultiline: true }],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-space-before-closing': 'error',
    'react/jsx-wrap-multilines': ['error', { declaration: true, assignment: true, return: true }],
  },
};