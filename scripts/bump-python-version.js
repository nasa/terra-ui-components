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

    function updateFilesWithNewVersions(searchDir) {
        const files = fs
            .readdirSync(searchDir)
            .filter(
                file =>
                    file.endsWith('.js') ||
                    file.endsWith('.ts') ||
                    file.endsWith('.tsx')
            )

        for (const file of files) {
            const filePath = path.join(searchDir, file)
            const originalFileContent = fs.readFileSync(filePath, 'utf8')
            let updatedFileContent = originalFileContent

            // Replace terra_ui_components==VERSION pattern for Jupyter Notebooks containing version
            updatedFileContent = updatedFileContent.replace(
                /"terra_ui_components==\d+\.\d+\.\d+"/g,
                `"terra_ui_components==${newVersion}"`
            )

            // Replace CDN path for any files including the CDN path
            updatedFileContent = updatedFileContent.replace(
                /https:\/\/cdn.jsdelivr.net\/npm\/@nasa-terra\/components@\d+\.\d+\.\d+\/cdn\//g,
                `https://cdn.jsdelivr.net/npm/@nasa-terra/components@${newVersion}/cdn/`
            )

            if (updatedFileContent !== originalFileContent) {
                fs.writeFileSync(filePath, updatedFileContent, 'utf8')
                console.log(`Updated ${filePath} version to: ${newVersion}`)
            }
        }
    }

    // Update notebook files
    updateFilesWithNewVersions(
        path.join('src', 'components', 'plot-toolbar', 'notebooks')
    )
    updateFilesWithNewVersions(
        path.join('src', 'components', 'data-subsetter', 'notebooks')
    )

    // update NextJS boilerplate version
    updateFilesWithNewVersions(
        path.join('packages', 'create-terra-ui-app', 'boilerplates', 'nextjs')
    )

    // Stage all updated files
    execSync('git add pyproject.toml')
    execSync(`git add ${basePyPath}`)
    execSync('git add src/components/plot-toolbar/notebooks')
    execSync('git add src/components/data-subsetter/notebooks')
    execSync('git add packages/create-terra-ui-app')

    // Amend the previous commit to include the updated versions
    execSync('git commit --amend --no-edit')

    console.log(
        'Amended commit to include updated pyproject.toml, base.py, notebook versions, and boilerplate files.'
    )
} catch (error) {
    console.error('Error updating Python version:', error.message)
    process.exit(1)
}
