import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import stylelint from 'vite-plugin-stylelint'
import sassDts from 'vite-plugin-sass-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import CustomPostCSSLoader from './scripts/CustomPostCSSLoader'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: '/pensjon/kalkulator',
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        appBorger: resolve(__dirname, './index.html'),
        appVeileder: resolve(__dirname, './veileder/index.html'),
      },
      external: ['./nais.js'],
      output: {
        manualChunks: {
          ['highcharts']: ['highcharts', 'highcharts/modules/accessibility'],
          ['react-redux']: [
            'react',
            'react-dom',
            'react-redux',
            'redux',
            'redux-thunk',
            '@reduxjs/toolkit',
            'react-router-dom',
          ],
          ['designsystem']: ['@navikt/ds-react'],
          ['faro']: ['@grafana/faro-web-sdk'],
          ['intl']: [
            'react-intl',
            'intl-messageformat',
            '@formatjs/ecma402-abstract',
            '@formatjs/intl',
            '@formatjs/intl-numberformat',
            '@formatjs/intl-datetimeformat',
          ],
        },
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: ['@babel/plugin-syntax-import-attributes'],
      },
    }),
    process.env.NODE_ENV !== 'test' && eslint(),
    process.env.NODE_ENV !== 'test' && stylelint({ fix: true }),
    process.env.NODE_ENV !== 'test' &&
      sassDts({
        global: {
          generate: true,
          outputFilePath: path.resolve(__dirname, './src/style.d.ts'),
        },
      }),
    process.env.NODE_ENV !== 'test' &&
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'analice.html',
      }),
  ],
  server: {
    proxy: {
      '/pensjon/kalkulator/api': {
        target: 'https://pensjonskalkulator-backend.ekstern.dev.nav.no',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  css: {
    modules: {
      Loader: CustomPostCSSLoader,
      generateScopedName: (name, fileName) => {
        const pathArray = fileName.split('/')
        const fileNameWithExtension = pathArray[pathArray.length - 1]
        const fileNameArray = fileNameWithExtension.split('.')
        return `${fileNameArray[0]}--${name}`
      },
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  test: {
    cache: false,
    environment: 'jsdom',
    globals: true,
    setupFiles: 'src/test-setup.ts',
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      all: true,
      extension: ['.ts', '.tsx'],
      exclude: [
        '**/*/faro.ts',
        '*.config.ts',
        'cypress',
        'server/server.ts',
        'src/mocks',
        'src/mocks/mockedRTKQueryApiCalls.ts',
        'src/test-utils.tsx',
        'src/main.tsx',
        'src/main-veileder.tsx',
        'src/**/*.d.ts',
        'src/**/*.types.ts',
        'src/**/__tests__',
        'src/**/index.ts',
        'src/state/hooks.ts',
        'src/components/common/ShowMore',
        'src/types',
        'src/paths.ts',
      ],
      perFile: true,
      thresholds: {
        lines: 95,
        functions: 50,
        branches: 95,
        statements: 95,
      },
      reporter: ['json', 'html', 'text', 'text-summary', 'cobertura'],
    },
  },
}))
