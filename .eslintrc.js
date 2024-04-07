module.exports = {
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@next/next/no-img-element': 'off',
    'jsx-a11y/alt-text': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': ['error', {forbid: ['>', '}']}],
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-indent': [2, 2, {indentLogicalExpressions: true}],
    'react-hooks/rules-of-hooks': 'warn',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {argsIgnorePattern: '^_', varsIgnorePattern: '^_|React'}
    ],
    '@typescript-eslint/space-infix-ops': ['error', {}],
    '@typescript-eslint/comma-spacing': ['error', {before: false, after: true}],
    'comma-spacing': 'off',
    'key-spacing': ['error', {beforeColon: false, afterColon: true}],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          [
            '!/.next/',
          ],
        ],
      },
    ],
    'simple-import-sort/exports': 'error'
  },
  ignorePatterns: ['/ignore/', '/out'],
  plugins: ['simple-import-sort'],
  overrides: [
    {
      "files": ["*.js", "*.jsx", "*.ts", "*.tsx"],
      "rules": {
        "simple-import-sort/imports": [
          "error",
          {
            "groups": [
              // React, next and another packages
              ["^react(?!-)\\b", "^next\\b", "^[^@]\\w", "^@\\w"],
              // Style imports.
              ["^.+\\.?(css)$"],
              // Internal components packages.
              ["^(@components)(/.*|$)"],
              // Internal constants packages.
              ["^(@constants)(/.*|$)"],
              // Internal core packages.
              ["^(@core)(/.*|$)"],
              // Internal lib packages.
              ["^(@lib)(/.*|$)"],
              // Internal state manager packages.
              ["^(@store)(/.*|$)"],
              // Internal hooks packages.
              ["^(@hooks)(/.*|$)"],
              // Internal utils packages.
              ["^(@utils)(/.*|$)"],
              // Internal ui packages.
              ["^(@ui)(/.*|$)"],
              // Internal context packages.
              ["^(@context)(/.*|$)"],
              // Side effect imports.
              ["^(@utils)(/.*|$)"],
              // Side effect imports.
              ["^\\u0000"],
              // Parent imports. Put .. last.
              ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
              // Other relative imports. Put same-folder imports and . last.
              ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
              // Internal public and assets packages.
              ["^(@public)(/.*|$)", "^(@assets)(/.*|$)"]
            ]
          }
        ]
      }
    }
  ]
}