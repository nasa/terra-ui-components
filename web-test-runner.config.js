import { esbuildPlugin } from '@web/dev-server-esbuild'
import { globbySync } from 'globby'
import { playwrightLauncher } from '@web/test-runner-playwright'
import { readFileSync } from 'fs'

const packageJson = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
)
const componentsVersion = packageJson.version ?? 'test'

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
        esbuildPlugin({
            ts: true,
            target: 'es2020',
            define: {
                __COMPONENTS_VERSION__: JSON.stringify(componentsVersion),
            },
        }),
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
        <script data-terra-ui-components="/dist"></script>
        <script>
          window.process = {env: { NODE_ENV: "production" }}

          // Blocks tests from using real network access to external APIs. 
          // Any cross-origin request is a sign that a test forgot to mock the relevant API method, so we fail it instead of letting it hit a real server
          const __realFetch = window.fetch.bind(window)
          window.fetch = (input, init) => {
            let url
            try {
              url = typeof input === 'string' || input instanceof URL
                ? input.toString()
                : input.url
              const isSameOrigin = new URL(url, window.location.href).origin === window.location.origin
              if (!isSameOrigin) {
                return Promise.reject(
                  new Error(
                    'Blocked unmocked network request in test environment: ' + url +
                    '. Stub the relevant API method (see mockCollectionQueries in data-subsetter.test.ts for an example) instead of hitting the network.'
                  )
                )
              }
            } catch (err) {
              // if we can't even parse the URL, fall through and let the real fetch surface the error
            }
            return __realFetch(input, init)
          }
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
