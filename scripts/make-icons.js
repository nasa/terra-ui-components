//
// This script downloads and generates icons and icon metadata.
//
import commandLineArgs from 'command-line-args'
import copy from 'recursive-copy'
import { deleteAsync } from 'del'
import download from 'download'
import fs from 'fs/promises'
import { globby } from 'globby'
import path from 'path'

const { outdir } = commandLineArgs({ name: 'outdir', type: String })
const iconDir = path.join(outdir, '/assets/icons')

const iconPackageData = JSON.parse(
    await fs.readFile('./node_modules/heroicons/package.json', 'utf8')
)

const version = iconPackageData.version
const srcPath = `./.cache/icons/heroicons-${version}`

//* Hit cache at versioned `srcPath` to determine if we need to download.
try {
    await fs.stat(`${srcPath}/LICENSE`)
} catch {
    // Download the source from GitHub (since not everything is published to npm)
    await download(
        `https://github.com/tailwindlabs/heroicons/archive/v${version}.zip`,
        './.cache/icons',
        { extract: true }
    )
}

// Copy icons
await deleteAsync([iconDir])
await fs.mkdir(iconDir, { recursive: true })
await Promise.all([
    copy(`${srcPath}/optimized/24/outline`, iconDir, {
        rename: filePath => {
            return filePath.endsWith('.svg') ? `outline-${filePath}` : filePath
        },
    }),
    copy(`${srcPath}/optimized/24/solid`, iconDir, {
        rename: filePath => {
            return filePath.endsWith('.svg') ? `solid-${filePath}` : filePath
        },
    }),
    copy(`${srcPath}/LICENSE`, path.join(iconDir, 'LICENSE')),
])

// Generate metadata
const files = await globby(`${iconDir}/**/*.svg`)
const metadata = await Promise.all(
    files.map(async file => {
        const name = path.basename(file, path.extname(file))
        const [variant, ...nameParts] = name.replaceAll('-', ' ').split(' ')

        return {
            name,
            variant,
            title: nameParts
                .map(part => {
                    return `${part.charAt(0).toUpperCase()}${part.substring(1)}`
                })
                .join(' '),
        }
    })
)

await fs.writeFile(
    path.join(iconDir, 'icons.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
)
