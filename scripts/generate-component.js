#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SRC_PATH = path.join(__dirname, '..', 'src')

function toPascalCase(str) {
  return str
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

function createComponentTemplate(componentName) {
  return `import React from 'react'
import { useIntl } from 'react-intl'

import styles from './${componentName}.module.scss'

export interface ${componentName}Props {
  // Add your props here
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  // Destructure your props here
}) => {
  const intl = useIntl()

  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  )
}
`
}

function createIndexTemplate(componentName) {
  return `export { ${componentName} } from './${componentName}'
export type { ${componentName}Props } from './${componentName}'
`
}

function createScssTemplate() {
  return `.container {
  // Add your styles here
}
`
}

function createScssTypesTemplate() {
  return `declare const styles: {
  readonly container: string
}

export default styles
`
}

function createTestTemplate(componentName) {
  return `import { render, screen } from '@/test-utils'

import { ${componentName} } from '../${componentName}'

describe('${componentName}', () => {
  it('should render without crashing', () => {
    render(<${componentName} />)
    // Add your test assertions here
  })
})
`
}

function showUsage() {
  console.log(`
Usage: npm run generate:component <component-name> [path]

Examples:
  npm run generate:component MyComponent
  npm run generate:component MyComponent src/components/common
  npm run generate:component my-component src/components/forms

The script will:
- Convert component names to PascalCase
- Create a folder structure following the project conventions
- Generate all necessary files (.tsx, .module.scss, .module.scss.d.ts, index.ts, test file)
`)
}

function generateComponent(componentName, targetPath = 'src/components') {
  // Convert to PascalCase
  const pascalComponentName = toPascalCase(componentName)

  // Resolve the full path
  const fullPath = path.resolve(
    targetPath.startsWith('/')
      ? targetPath
      : path.join(process.cwd(), targetPath)
  )
  const componentDir = path.join(fullPath, pascalComponentName)
  const testDir = path.join(componentDir, '__tests__')

  // Check if component already exists
  if (fs.existsSync(componentDir)) {
    console.error(
      `❌ Component "${pascalComponentName}" already exists at ${componentDir}`
    )
    process.exit(1)
  }

  // Create directories
  try {
    fs.mkdirSync(componentDir, { recursive: true })
    fs.mkdirSync(testDir, { recursive: true })
  } catch (error) {
    console.error(`❌ Failed to create directories: ${error.message}`)
    process.exit(1)
  }

  // Generate files
  const files = [
    {
      path: path.join(componentDir, `${pascalComponentName}.tsx`),
      content: createComponentTemplate(pascalComponentName),
    },
    {
      path: path.join(componentDir, 'index.ts'),
      content: createIndexTemplate(pascalComponentName),
    },
    {
      path: path.join(componentDir, `${pascalComponentName}.module.scss`),
      content: createScssTemplate(),
    },
    {
      path: path.join(componentDir, `${pascalComponentName}.module.scss.d.ts`),
      content: createScssTypesTemplate(),
    },
    {
      path: path.join(testDir, `${pascalComponentName}.test.tsx`),
      content: createTestTemplate(pascalComponentName),
    },
  ]

  files.forEach((file) => {
    try {
      fs.writeFileSync(file.path, file.content)
      console.log(`✅ Created ${path.relative(process.cwd(), file.path)}`)
    } catch (error) {
      console.error(`❌ Failed to create ${file.path}: ${error.message}`)
    }
  })

  console.log(`
🎉 Component "${pascalComponentName}" generated successfully!

Files created:
${files.map((f) => `  - ${path.relative(process.cwd(), f.path)}`).join('\n')}

You can now import the component using:
import { ${pascalComponentName} } from '${path.relative(SRC_PATH, componentDir).replace(/\\/g, '/')}'
`)
}

// Parse command line arguments
const args = process.argv.slice(2)

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showUsage()
  process.exit(0)
}

const componentName = args[0]
const targetPath = args[1] || 'src/components'

if (!componentName) {
  console.error('❌ Component name is required')
  showUsage()
  process.exit(1)
}

generateComponent(componentName, targetPath)
