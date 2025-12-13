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

export async function create(nextTask, outputDir, boilerplatesDir) {
    const projectPath = path.join(outputDir || process.cwd(), framework.projectName)

    // Step 1: Create Next.js app
    await nextTask(`Creating Next.js app with ${framework.displayName}`, async () => {
        await execPromise(framework.createCommand, {
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
        const setBasePathCall = `\n/**\n * Sets the base path to the Terra UI CDN\n *\n * If you'd rather host the assets locally, you should setup a build task to copy the assets locally and\n * set the base path to your local public folder\n * (see https://terra-ui.netlify.app/frameworks/react/#installation for more information)\n */\nsetBasePath('https://cdn.jsdelivr.net/npm/@nasa-terra/components@0.0.127/cdn/')`

        // Reconstruct the file: CSS import at top, then existing content with setBasePath import and call inserted
        const newLines = [...lines]
        newLines.splice(insertIndex, 0, setBasePathImport)
        newLines.splice(insertIndex + 1, 0, setBasePathCall)

        const newContent = cssImport + newLines.join('\n')
        await fs.writeFile(appPath, newContent, 'utf-8')
    })

    // Step 4: Modify index.tsx
    await nextTask('Updating index.tsx with example components', async () => {
        const templatePath = path.join(boilerplatesDir, 'nextjs', 'index.tsx')
        const indexPath = path.join(projectPath, 'pages', 'index.tsx')
        const indexContent = await fs.readFile(templatePath, 'utf-8')
        await fs.writeFile(indexPath, indexContent, 'utf-8')
    })

    // Step 5: Copy kitchen-sink page
    await nextTask('Adding kitchen-sink page', async () => {
        const templatePath = path.join(boilerplatesDir, 'nextjs', 'kitchen-sink.tsx')
        const kitchenSinkPath = path.join(projectPath, 'pages', 'kitchen-sink.tsx')
        const kitchenSinkContent = await fs.readFile(templatePath, 'utf-8')
        await fs.writeFile(kitchenSinkPath, kitchenSinkContent, 'utf-8')
    })

    // Step 6: Copy components directory
    await nextTask('Adding Layout component', async () => {
        const componentsSourceDir = path.join(boilerplatesDir, 'nextjs', 'components')
        const componentsDestDir = path.join(projectPath, 'pages', 'components')

        // Create components directory
        await fs.mkdir(componentsDestDir, { recursive: true })

        // Copy Layout.tsx
        const layoutSourcePath = path.join(componentsSourceDir, 'Layout.tsx')
        const layoutDestPath = path.join(componentsDestDir, 'Layout.tsx')
        const layoutContent = await fs.readFile(layoutSourcePath, 'utf-8')
        await fs.writeFile(layoutDestPath, layoutContent, 'utf-8')
    })

    console.log(
        chalk.green(`\n✔ Boilerplate created successfully at: ${projectPath}`)
    )
    console.log(chalk.cyan(`\nTo get started, run:`))
    console.log(chalk.white(`  cd ${framework.projectName}`))
    console.log(chalk.white(`  npm run dev`))
}
