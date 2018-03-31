module.exports = {
  root: true,
  env: {
    browser: true,
  },
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
    'space-before-function-paren': ['error', 'always'],
  },
}
