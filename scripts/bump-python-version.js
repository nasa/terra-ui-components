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

    // Update notebook files in src/components/plot-toolbar/notebooks/
    const notebooksDir = path.join('src', 'components', 'plot-toolbar', 'notebooks')
    const notebookFiles = fs
        .readdirSync(notebooksDir)
        .filter(file => file.endsWith('.ts'))

    for (const notebookFile of notebookFiles) {
        const notebookPath = path.join(notebooksDir, notebookFile)
        let notebookContent = fs.readFileSync(notebookPath, 'utf8')

        // Replace terra_ui_components==VERSION pattern
        const updatedContent = notebookContent.replace(
            /"terra_ui_components==\d+\.\d+\.\d+"/g,
            `"terra_ui_components==${newVersion}"`
        )

        if (updatedContent !== notebookContent) {
            fs.writeFileSync(notebookPath, updatedContent, 'utf8')
            console.log(`Updated ${notebookFile} version to: ${newVersion}`)
        }
    }

    // Stage all updated files
    execSync('git add pyproject.toml')
    execSync(`git add ${basePyPath}`)

    // Stage notebook files if they were updated
    for (const notebookFile of notebookFiles) {
        const notebookPath = path.join(notebooksDir, notebookFile)
        execSync(`git add ${notebookPath}`)
    }

    // Amend the previous commit to include the updated versions
    execSync('git commit --amend --no-edit')

    console.log(
        'Amended commit to include updated pyproject.toml, base.py, and notebook versions.'
    )
} catch (error) {
    console.error('Error updating Python version:', error.message)
    process.exit(1)
}
