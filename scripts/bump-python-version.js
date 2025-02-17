const { execSync } = require('child_process')

// Get the latest tag from npm version commit
const latestTag = execSync('git describe --tags --abbrev=0').toString().trim()
const previousTag = execSync('git tag --sort=-v:refname | sed -n 2p')
    .toString()
    .trim()

if (!latestTag || !previousTag) {
    console.log('Could not determine previous version.')
    process.exit(1)
}

const [latestMajor, latestMinor, latestPatch] = latestTag
    .replace(/^v/, '')
    .split('.')
    .map(Number)
const [prevMajor, prevMinor, prevPatch] = previousTag
    .replace(/^v/, '')
    .split('.')
    .map(Number)

let versionType = 'unknown'
if (latestMajor > prevMajor) {
    versionType = 'major'
} else if (latestMinor > prevMinor) {
    versionType = 'minor'
} else if (latestPatch > prevPatch) {
    versionType = 'patch'
}

console.log(versionType)
