import commandLineArgs from 'command-line-args'
import { globby } from 'globby'
import { deleteAsync } from 'del'
import fs from 'fs/promises'
import path from 'path'

const { outdir } = commandLineArgs({ name: 'outdir', type: String })
const assetDir = path.join(outdir, '/assets')

// Find all asset files in any component's assets folder
const assetFiles = await globby('src/components/**/assets/**/*', { onlyFiles: true })

await deleteAsync([assetDir])
await fs.mkdir(assetDir, { recursive: true })

for (const file of assetFiles) {
    // keeps the assets organized by component name
    const match = file.match(/src\/components\/([^/]+)\/assets\/(.+)/)

    if (match) {
        const [, component, assetPath] = match
        const dest = path.join(assetDir, component, assetPath)
        await fs.mkdir(path.dirname(dest), { recursive: true })
        await fs.copyFile(file, dest)
    }
}
