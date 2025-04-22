import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import sonarjs from 'eslint-plugin-sonarjs'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const ignoredFiles = [
  'eslint.config.mjs',
  'dist/**',
  'dist-sanity/**',
  '.nginx/*',
  '.nais/*',
  'src/nais.js',
  '**/api',
  '**/coverage',
  '**/vite.config.ts*',
  '**/.stylelintrc.cjs',
  '**/tsconfig.json',
  '**/tsconfig.node.json',
  '**/*.scss.d.ts',
  '**/style.d.ts',
  'cypress.config.ts',
  '**/mockServiceWorker.js',
  '**/cypress',
  'public/src/nais.js',
  'scripts/FetchLandListe.js',
  'sanity.cli.ts',
]

const defaultEslintConfig = tseslint.config(
  {
    ...eslint.configs.recommended,
    ignores: [...ignoredFiles],
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    ignores: [...ignoredFiles],
  })),
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  sonarjs.configs.recommended
)

export default [
  ...defaultEslintConfig,
  {
    settings: { react: { version: 'detect' } }, // eslint-plugin-react needs this
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    ignores: [...ignoredFiles],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'no-debugger': 'warn',
      'no-irregular-whitespace': ['error', { skipTemplates: true }],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-duplicate-enum-values': 'warn',
      '@typescript-eslint/no-shadow': ['error'],
      '@typescript-eslint/naming-convention': 'off',
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],
      'react/hook-use-state': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-props-no-spread-multi': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/self-closing-comp': 'error',
      'react/style-prop-object': 'error',
      'import/export': 'error',
      'import/no-extraneous-dependencies': 'error',
      'import/no-duplicates': 'error',
      'sonarjs/no-all-duplicated-branches': 'warn',
      'sonarjs/no-element-overwrite': 'warn',
      'sonarjs/no-empty-collection': 'warn',
      'sonarjs/no-extra-arguments': 'warn',
      'sonarjs/no-identical-conditions': 'warn',
      'sonarjs/no-identical-expressions': 'warn',
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/no-nested-conditional': 'warn',
      'sonarjs/no-ignored-return': 'warn',
      'sonarjs/no-one-iteration-loop': 'warn',
      'sonarjs/no-use-of-empty-return-value': 'warn',
      'sonarjs/todo-tag': 'warn',
      'sonarjs/class-name': 'warn',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/concise-regex': 'warn',
      'sonarjs/max-switch-cases': 'warn',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/no-collection-size-mischeck': 'warn',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-duplicated-branches': 'warn',
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-inverted-boolean-check': 'warn',
      'sonarjs/no-redundant-assignments': 'warn',
      'sonarjs/no-redundant-boolean': 'warn',
      'sonarjs/no-redundant-jump': 'warn',
      'sonarjs/no-same-line-conditional': 'warn',
      'sonarjs/no-small-switch': 'warn',
      'sonarjs/no-unused-collection': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/prefer-object-literal': 'warn',
      'sonarjs/prefer-single-boolean-return': 'warn',
      'sonarjs/prefer-while': 'warn',
      'sonarjs/pseudo-random': 'warn',
      'sonarjs/regex-complexity': 'warn',
      'sonarjs/slow-regex': 'warn',
      'sonarjs/use-type-alias': 'warn',
    },
  },
]
