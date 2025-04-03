module.exports = {
  arrowParens: 'always',
  bracketSameLine: false,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^@formatjs/intl-numberformat/locale-data/', // For å sørge for at polyfill-force kommer før locale-data i LanguageProvider.tsx
    '^@navikt',
    '^@/',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
