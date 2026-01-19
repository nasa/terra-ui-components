import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'

const execPromise = promisify(exec)

export const framework = {
    name: 'nextjs',
    displayName: 'Next.js',
    createCommand:
        'npx create-next-app@latest terra-ui-nextjs-boilerplate --ts --tailwind --eslint --use-npm --no-react-compiler --no-src-dir --no-app --no-import-alias',
    projectName: 'terra-ui-nextjs-boilerplate',
}

export async function create(nextTask, outputDir, boilerplatesDir, appName) {
    // Use provided app name or fall back to default
    const projectName = appName || framework.projectName
    const projectPath = path.join(outputDir || process.cwd(), projectName)

    // Step 1: Create Next.js app
    await nextTask(`Creating Next.js app with ${framework.displayName}`, async () => {
        // Build create command with the provided app name
        const createCommand = `npx create-next-app@latest ${projectName} --ts --tailwind --eslint --use-npm --no-react-compiler --no-src-dir --no-app --no-import-alias`
        await execPromise(createCommand, {
            cwd: outputDir || process.cwd(),
            stdio: 'inherit',
        })
    })

    // Step 2: Install @nasa-terra/components
    await nextTask('Installing @nasa-terra/components', async () => {
        await execPromise('npm install @nasa-terra/components', {
            cwd: projectPath,
            stdio: 'inherit',
        })
    })

    // Step 3: Modify _app.tsx
    await nextTask('Configuring _app.tsx', async () => {
        const appPath = path.join(projectPath, 'pages', '_app.tsx')
        const existingContent = await fs.readFile(appPath, 'utf-8')

        // Add CSS import at the top
        const cssImport = "import '@nasa-terra/components/dist/themes/horizon.css'\n"

        // Find where imports end (look for first non-import, non-comment, non-empty line)
        const lines = existingContent.split('\n')
        let insertIndex = 0
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()
            if (line.startsWith('import ')) {
                insertIndex = i + 1
            } else if (
                line &&
                !line.startsWith('//') &&
                !line.startsWith('/*') &&
                !line.startsWith('*')
            ) {
                break
            }
        }

        // Insert setBasePath import after the last import
        const setBasePathImport =
            "import { setBasePath } from '@nasa-terra/components/dist/utilities/base-path.js'"

        // Create the setBasePath call with comments (with newline before it)
        const setBasePathCall = `\n/**\n * Sets the base path to the Terra UI CDN\n *\n * If you'd rather host the assets locally, you should setup a build task to copy the assets locally and\n * set the base path to your local public folder\n * (see https://terra-ui.netlify.app/frameworks/react/#installation for more information)\n */\nsetBasePath('https://cdn.jsdelivr.net/npm/@nasa-terra/components@0.0.134/cdn/')`

        // Reconstruct the file: CSS import at top, then existing content with setBasePath import and call inserted
        const newLines = [...lines]
        newLines.splice(insertIndex, 0, setBasePathImport)
        newLines.splice(insertIndex + 1, 0, setBasePathCall)

        const newContent = cssImport + newLines.join('\n')
        await fs.writeFile(appPath, newContent, 'utf-8')
    })

    // Step 4: Create/modify _document.tsx
    await nextTask('Configuring _document.tsx', async () => {
        const documentPath = path.join(projectPath, 'pages', '_document.tsx')

        let documentContent
        try {
            documentContent = await fs.readFile(documentPath, 'utf-8')
        } catch (error) {
            // If _document.tsx does not exist, create a new one
            if (error && error.code === 'ENOENT') {
                const newDocumentContent = `import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="terra-prefers-color-scheme">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
`
                await fs.writeFile(documentPath, newDocumentContent, 'utf-8')
                return
            }
            throw error
        }

        // If _document.tsx exists, ensure the Html tag has the terra-prefers-color-scheme class
        if (!documentContent.includes('terra-prefers-color-scheme')) {
            const updatedContent = documentContent.replace(
                /<Html([^>]*)>/,
                (match, attrs) => {
                    if (/className=/.test(attrs)) {
                        return `<Html${attrs.replace(
                            /className=["']([^"']*)["']/,
                            'className="$1 terra-prefers-color-scheme"'
                        )}>`
                    }
                    return `<Html${attrs} className="terra-prefers-color-scheme">`
                }
            )

            await fs.writeFile(documentPath, updatedContent, 'utf-8')
        }
    })

    // Step 5: Copy boilerplate files
    await nextTask('Copying boilerplate files', async () => {
        const filesToCopy = [
            {
                source: 'index.tsx',
                destination: path.join('pages', 'index.tsx'),
            },
            {
                source: 'kitchen-sink.tsx',
                destination: path.join('pages', 'kitchen-sink.tsx'),
            },
            {
                source: path.join('components', 'Layout.tsx'),
                destination: path.join('pages', 'components', 'Layout.tsx'),
                ensureDir: true,
            },
            {
                source: 'AGENTS.md',
                destination: 'AGENTS.md',
            },
            {
                source: 'CLAUDE.md',
                destination: 'CLAUDE.md',
            },
        ]

        for (const file of filesToCopy) {
            const sourcePath = path.join(boilerplatesDir, 'nextjs', file.source)
            const destPath = path.join(projectPath, file.destination)

            // Ensure destination directory exists if needed
            if (file.ensureDir) {
                const destDir = path.dirname(destPath)
                await fs.mkdir(destDir, { recursive: true })
            }

            // Copy the file
            const content = await fs.readFile(sourcePath, 'utf-8')
            await fs.writeFile(destPath, content, 'utf-8')
        }
    })

    // Step 6: Update package.json with app name
    if (appName) {
        await nextTask('Updating package.json with app name', async () => {
            const packageJsonPath = path.join(projectPath, 'package.json')
            const packageJson = JSON.parse(
                await fs.readFile(packageJsonPath, 'utf-8')
            )
            packageJson.name = appName
            await fs.writeFile(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2) + '\n',
                'utf-8'
            )
        })
    }

    console.log(
        chalk.green(`\n✔ Boilerplate created successfully at: ${projectPath}`)
    )
    console.log(chalk.cyan(`\nTo get started, run:`))
    console.log(chalk.white(`  cd ${projectName}`))
    console.log(chalk.white(`  npm run dev`))
}
