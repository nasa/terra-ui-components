#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import readline from 'readline'
import chalk from 'chalk'
import ora from 'ora'
import commandLineArgs from 'command-line-args'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const optionDefinitions = [
    { name: 'framework', alias: 'f', type: String, defaultOption: true },
    { name: 'output', alias: 'o', type: String },
]

const options = commandLineArgs(optionDefinitions)

async function nextTask(label, action) {
    const spinner = ora({ hideCursor: false }).start()
    spinner.text = label

    try {
        await action()
        spinner.stop()
        console.log(`${chalk.green('✔')} ${label}`)
    } catch (err) {
        spinner.stop()
        console.error(`${chalk.red('✘')} ${label}`)
        if (err.stdout) console.error(chalk.red(err.stdout))
        if (err.stderr) console.error(chalk.red(err.stderr))
        throw err
    }
}

// Get the boilerplates directory relative to this script
const boilerplatesDir = path.join(__dirname, '..', 'boilerplates')

// Dynamically discover and load frameworks
async function loadFrameworks() {
    const frameworks = {}
    const entries = await fs.readdir(boilerplatesDir, { withFileTypes: true })

    for (const entry of entries) {
        if (entry.isDirectory()) {
            const frameworkName = entry.name
            const frameworkPath = path.join(
                boilerplatesDir,
                frameworkName,
                'framework.js'
            )

            try {
                // Try to load the framework module
                const frameworkModule = await import(
                    `file://${path.resolve(frameworkPath)}`
                )

                if (frameworkModule.framework && frameworkModule.create) {
                    frameworks[frameworkName] = {
                        ...frameworkModule.framework,
                        create: frameworkModule.create,
                    }
                }
            } catch (err) {
                // Framework directory exists but no framework.js file
                // This is okay, just skip it
                if (err.code !== 'ERR_MODULE_NOT_FOUND') {
                    console.warn(
                        chalk.yellow(
                            `Warning: Could not load framework ${frameworkName}: ${err.message}`
                        )
                    )
                }
            }
        }
    }

    return frameworks
}

function promptFramework(frameworks) {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })

        const frameworkList = Object.entries(frameworks).map(
            ([key, value], index) => `${index + 1}. ${value.displayName} (${key})`
        )

        console.log(chalk.cyan('\nSelect a framework:'))
        frameworkList.forEach(item => console.log(chalk.white(`  ${item}`)))
        console.log()

        rl.question(chalk.yellow('Enter your choice (number or name): '), answer => {
            rl.close()

            // Try to parse as number first
            const num = parseInt(answer.trim(), 10)
            if (!isNaN(num) && num > 0 && num <= frameworkList.length) {
                const frameworkKey = Object.keys(frameworks)[num - 1]
                resolve(frameworkKey)
                return
            }

            // Try to match by name
            const frameworkKey = answer.trim().toLowerCase()
            if (frameworks[frameworkKey]) {
                resolve(frameworkKey)
                return
            }

            // Default to first framework if invalid input
            console.log(
                chalk.yellow(
                    `Invalid choice, defaulting to ${Object.keys(frameworks)[0]}`
                )
            )
            resolve(Object.keys(frameworks)[0])
        })
    })
}

async function main() {
    let frameworkName = options.framework
    const outputDir = options.output

    // Load available frameworks
    const frameworks = await loadFrameworks()

    if (Object.keys(frameworks).length === 0) {
        console.error(
            chalk.red(
                'No frameworks found. Please ensure framework.js files exist in boilerplates directories.'
            )
        )
        process.exit(1)
    }

    // Prompt for framework if not provided
    if (!frameworkName) {
        frameworkName = await promptFramework(frameworks)
    }

    if (!frameworks[frameworkName]) {
        console.error(chalk.red(`Unknown framework: ${frameworkName}`))
        console.log(
            chalk.yellow(
                `Available frameworks: ${Object.keys(frameworks).join(', ')}`
            )
        )
        process.exit(1)
    }

    try {
        const selectedFramework = frameworks[frameworkName]
        await selectedFramework.create(nextTask, outputDir, boilerplatesDir)
    } catch (err) {
        console.error(chalk.red('\n✘ Failed to create boilerplate'))
        if (err.message) {
            console.error(chalk.red(err.message))
        }
        process.exit(1)
    }
}

main()
