//
// This script downloads and generates icons and icon metadata.
//
import commandLineArgs from 'command-line-args'
import copy from 'recursive-copy'
import { deleteAsync } from 'del'
import { createWriteStream } from 'fs'
import fs from 'fs/promises'
import { globby } from 'globby'
import path from 'path'
import { pipeline } from 'stream/promises'
import yauzl from 'yauzl'

const { outdir } = commandLineArgs({ name: 'outdir', type: String })
const iconDir = path.join(outdir, '/assets/icons')

const iconPackageData = JSON.parse(
    await fs.readFile('./node_modules/heroicons/package.json', 'utf8')
)

const version = iconPackageData.version
const cacheDir = './.cache/icons'
const srcPath = `${cacheDir}/heroicons-${version}`

//* Hit cache at versioned `srcPath` to determine if we need to download.
try {
    await fs.stat(`${srcPath}/LICENSE`)
} catch {
    // Download the source from GitHub (since not everything is published to npm) and extract it
    const zipUrl = `https://github.com/tailwindlabs/heroicons/archive/v${version}.zip`
    const response = await fetch(zipUrl)

    if (!response.ok) {
        throw new Error(
            `Failed to download ${zipUrl}: ${response.status} ${response.statusText}`
        )
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    await fs.mkdir(cacheDir, { recursive: true })

    const zipfile = await yauzl.fromBufferPromise(buffer)
    for await (const entry of zipfile.eachEntry()) {
        const entryPath = path.join(cacheDir, entry.fileName)

        if (entry.fileName.endsWith('/')) {
            await fs.mkdir(entryPath, { recursive: true })
            continue
        }

        await fs.mkdir(path.dirname(entryPath), { recursive: true })

        const readStream = await zipfile.openReadStreamPromise(entry)
        await pipeline(readStream, createWriteStream(entryPath))
    }
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
