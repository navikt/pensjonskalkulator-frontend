import eslint from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import sonarjsPlugin from 'eslint-plugin-sonarjs'
import testingLibrary from 'eslint-plugin-testing-library'
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
  'server/server.ts',
  '**/tsconfig.node.json',
  '**/*.scss.d.ts',
  '**/style.d.ts',
  'cypress.config.ts',
  'playwright.config.ts',
  '**/mockServiceWorker.js',
  '**/cypress',
  'public/src/nais.js',
  'scripts/FetchLandListe.js',
  'sanity.cli.ts',
  'sanity.config.ts',
  'src/translations/**',
]

const defaultEslintConfig = tseslint.config(
  {
    ...eslint.configs.recommended,
    ignores: [...ignoredFiles],
  },
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    ignores: [...ignoredFiles],
  })),
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended
)

export default [
  ...defaultEslintConfig,
  {
    settings: {
      react: { version: 'detect' },
      'jsx-a11y': {
        polymorphicPropName: 'as',
        components: {
          Button: 'button',
          Link: 'a',
          Heading: 'h2',
          BodyLong: 'p',
          BodyShort: 'p',
          Label: 'label',
          TextField: 'input',
          Select: 'select',
          Checkbox: 'input',
          Radio: 'input',
          Alert: 'div',
          Panel: 'div',
          Modal: 'dialog',
        },
      },
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      // Needed for typed linting
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [...ignoredFiles],
    plugins: {
      import: importPlugin,
      sonarjs: sonarjsPlugin,
    },
    rules: {
      'no-debugger': 'warn',
      'no-irregular-whitespace': ['error', { skipTemplates: true }],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-duplicate-enum-values': 'warn',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-floating-promises': 'off',
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
      // SonarJS rules
      'sonarjs/no-duplicate-string': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-redundant-boolean': 'warn',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-useless-catch': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-gratuitous-expressions': 'error',
      'sonarjs/no-inverted-boolean-check': 'warn',
      'sonarjs/prefer-while': 'warn',
      // jsx-a11y rules
      // TODO: fjern når alle warns for feil er borte
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
    },
  },
  // Test files configuration
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/__tests__/**/*.ts',
      '**/__tests__/**/*.tsx',
      '**/cypress/**/*.ts',
      '**/cypress/**/*.tsx',
      '**/*.cy.ts',
      '**/*.cy.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/playwright/**/*.ts',
      '**/playwright/**/*.tsx',
    ],
    ...testingLibrary.configs['flat/react'],
    plugins: {
      ...testingLibrary.configs['flat/react'].plugins,
      vitest,
    },
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      ...vitest.configs.recommended.rules,
      'vitest/valid-title': 'off',
      'vitest/expect-expect': 'off',
      'vitest/no-identical-title': 'off',
      'vitest/no-commented-out-tests': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off', // Fjern når @ts-ignore ikke lenger er i bruk i testkode
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          allowForKnownSafeCalls: [
            {
              from: 'file',
              name: 'renderWithProviders',
              path: 'src/test-utils.tsx',
            },
          ],
        },
      ],
      // Relax SonarJS rules for test files
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-identical-functions': 'off',
      'sonarjs/prefer-immediate-return': 'off',
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  // Mock files configuration
  {
    files: ['**/mocks/**/*.ts', '**/mocks/**/*.tsx'],
    rules: {
      // Relax SonarJS rules for mock files
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-identical-functions': 'off',
      'sonarjs/prefer-immediate-return': 'off',
    },
  },
]
