module.exports = {
  root: true,
  env: {
    browser: true,
    webextensions: true,
  },
  parser: 'typescript-eslint-parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  rules: {
    'class-methods-use-this': 'off',
    // 'import/extensions': ['error', 'always', {
    //   ts: 'never',
    // }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
      ],
    }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': [ 'error', {
      argsIgnorePattern: '^(_|event)$',
    }],
    'space-before-function-paren': ['error', 'always'],
    'strict': ['error', 'global'],
  },
}
