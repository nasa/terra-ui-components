import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

try {
    // Get the latest tag from Git
    const latestTag = execSync('git describe --tags --abbrev=0').toString().trim()
    const newVersion = latestTag.replace(/^v/, '') // Remove leading 'v' if present

    // Ensure the version is properly formatted and contains only numbers and dots
    if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
        throw new Error(`Invalid version format detected: ${newVersion}`)
    }

    // Read the pyproject.toml file
    const pyprojectPath = 'pyproject.toml'
    let pyprojectContent = fs.readFileSync(pyprojectPath, 'utf8')

    // Replace the version inside the pyproject.toml
    pyprojectContent = pyprojectContent.replace(
        /version\s*=\s*"\d+\.\d+\.\d+"/,
        `version = "${newVersion}"`
    )

    // Write the updated content back to pyproject.toml
    fs.writeFileSync(pyprojectPath, pyprojectContent, 'utf8')

    console.log(`Updated pyproject.toml version to: ${newVersion}`)

    const basePyPath = path.join('src', 'terra_ui_components', 'base.py')
    let basePyContent = fs.readFileSync(basePyPath, 'utf8')

    basePyContent = basePyContent.replace(
        /@nasa-terra\/components@\d+\.\d+\.\d+/g,
        `@nasa-terra/components@${newVersion}`
    )

    fs.writeFileSync(basePyPath, basePyContent, 'utf8')

    console.log(`Updated base.py version to: ${newVersion}`)

    // Stage both files
    execSync('git add pyproject.toml')
    execSync(`git add ${basePyPath}`)

    // Amend the previous commit to include the updated versions
    execSync('git commit --amend --no-edit')

    console.log(
        'Amended commit to include updated pyproject.toml and base.py versions.'
    )
} catch (error) {
    console.error('Error updating Python version:', error.message)
    process.exit(1)
}
