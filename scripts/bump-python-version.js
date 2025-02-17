/**
 * Sets the Python package version to the same version as in "package.json"
 */
import { execSync } from 'child_process'
import fs from 'fs'

try {
    // Get the latest tag from Git (will return something like: v1.0.0)
    const latestTag = execSync('git describe --tags --abbrev=0').toString().trim()
    const newVersion = latestTag.replace('v', '')

    // Write the new version to the VERSION file
    fs.writeFileSync('VERSION', newVersion + '\n', 'utf8')

    // Stage the VERSION file
    // since "npm version" automatically commits, we'll need to amend that commit with this VERSION change
    execSync('git add VERSION')

    // Amend the previous commit to include the VERSION file
    execSync('git commit --amend --no-edit')

    console.log('Updated Python version to:', newVersion)
} catch (error) {
    console.error('Error updating Python version:', error.message)
    process.exit(1)
}
