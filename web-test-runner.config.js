import fs, { readFileSync } from 'node:fs'
import path from 'node:path'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { playwrightLauncher } from '@web/test-runner-playwright'
import { globbySync } from 'globby'

import * as sass from 'sass'

const packageJson = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
)
const componentsVersion = packageJson.version ?? 'test'

function compileHorizonTheme() {
    const filesToEmbed = [
        ...globbySync('./src/themes/**/_*.css'),
        ...globbySync('./src/themes/**/_*.scss'),
    ]
    const embeds = {}

    filesToEmbed.forEach(file => {
        const basename = path.basename(file)

        let content = readFileSync(file, 'utf8')

        if (file.endsWith('.scss')) {
            content = sass.compileString(content, { style: 'expanded' }).css
        }

        embeds[basename] = content
    })

    let source = readFileSync('./src/themes/horizon.scss', 'utf8')

    Object.keys(embeds).forEach(key => {
        source = source.replace(`/* ${key} */`, embeds[key])
    })

    return sass.compileString(source, { style: 'expanded' }).css
}

function horizonThemePlugin() {
    let cachedCss = null

    return {
        name: 'horizon-theme-plugin',
        fileChanged(filePath) {
            if (filePath.includes('/src/themes/')) {
                cachedCss = null
            }
        },
        serve(context) {
            if (
                context.path === '/dist/themes/horizon.css' ||
                context.path === '/themes/horizon.css'
            ) {
                if (!cachedCss) {
                    cachedCss = compileHorizonTheme()
                }
                return { body: cachedCss, type: 'css' }
            }
        },
    }
}

function blockDistImportsPlugin() {
    return {
        name: 'block-dist-imports-plugin',
        resolveImport({ source, context }) {
            if (
                context.path.endsWith('.test.ts') &&
                (source.includes('/dist/') || source.startsWith('dist/'))
            ) {
                throw new Error(
                    `[Test Error] Forbidden import of dist asset "${source}" in ${context.path}.\nDevelopment tests must import directly from source files (e.g., './<component>.js').`
                )
            }
        },
    }
}

function resolveTestImages() {
    // 1x1 transparent pixel stub
    const transparentPixel = Buffer.from(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        'base64'
    )
    const stubSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>'

    return {
        name: 'test-images-plugin',
        serve(context) {
            // 1. Check if the file exists in a designated test fixtures directory
            const fixtureFile = path.resolve(
                'src/test/fixtures',
                context.path.replace(/^\//, '')
            )
            if (fs.existsSync(fixtureFile) && fs.statSync(fixtureFile).isFile()) {
                return { body: fs.readFileSync(fixtureFile) }
            }

            // 2. Serve mock SVG icons
            if (
                context.path.startsWith('/assets/icons/') ||
                context.path.endsWith('.svg')
            ) {
                return {
                    body: stubSvg,
                    type: 'image/svg+xml',
                }
            }

            // 3. Intercept dummy test images (e.g. /test.jpg) and return the transparent pixel
            if (
                context.path === '/test.jpg' ||
                /\.(jpe?g|png|gif|webp)$/i.test(context.path)
            ) {
                return {
                    body: transparentPixel,
                    type: 'image/gif',
                }
            }
        },
    }
}

export default {
    rootDir: '.',
    files: 'src/**/*.test.ts', // "default" group
    concurrentBrowsers: 3,
    nodeResolve: {
        exportConditions: ['production', 'default'],
    },
    testFramework: {
        config: {
            timeout: 3000,
            retries: 1,
        },
    },
    plugins: [
        blockDistImportsPlugin(),
        horizonThemePlugin(),
        esbuildPlugin({
            ts: true,
            target: 'es2020',
            define: {
                __COMPONENTS_VERSION__: JSON.stringify(componentsVersion),
            },
        }),
        resolveTestImages(),
    ],
    browsers: [
        playwrightLauncher({ product: 'chromium' }),
        playwrightLauncher({ product: 'firefox' }),
        playwrightLauncher({ product: 'webkit' }),
    ],
    testRunnerHtml: testFramework => `
    <html lang="en-US">
      <head></head>
      <body>
        <link rel="stylesheet" href="dist/themes/horizon.css">
        <script>
          window.process = {env: { NODE_ENV: "production" }}
        </script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
    // Create a named group for every test file to enable running single tests. If a test file is `split-panel.test.ts`
    // then you can run `npm run test -- --group split-panel` to run only that component's tests.
    groups: globbySync('src/**/*.test.ts').map(path => {
        const groupName = path.match(/^.*\/(?<fileName>.*)\.test\.ts/).groups.fileName
        return {
            name: groupName,
            files: path,
        }
    }),
}
