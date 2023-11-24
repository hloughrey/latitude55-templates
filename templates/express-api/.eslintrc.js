module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    emitDecoratorMetadata: true,
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'import', 'unicorn'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  rules: {
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used' }],
    '@typescript-eslint/no-floating-promises': 'error',
    'no-duplicate-imports': 'error',
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          ['parent', 'internal', 'sibling', 'index']
        ],
        pathGroups: [
          {
            pattern: '@wk/**',
            group: 'internal',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: {
          order: 'desc'
        }
      }
    ]
  }
};
