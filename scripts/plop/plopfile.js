import fs from 'fs'
import path from 'path'

export default function (plop) {
    plop.setHelper('tagWithoutPrefix', tag => tag.replace(/^terra-/, ''))

    plop.setHelper('tagToTitle', tag => {
        const withoutPrefix = plop.getHelper('tagWithoutPrefix')
        const titleCase = plop.getHelper('titleCase')
        return titleCase(withoutPrefix(tag).replace(/-/g, ' '))
    })

    // New helpers for widget generation
    plop.setHelper('pascalCase', function (str) {
        return str
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('')
    })

    plop.setHelper('extractProperties', function (content) {
        const properties = []
        const propertyRegex = /@property\([^)]*\)\s+(\w+):\s*([^=\n]+)/g
        let match

        while ((match = propertyRegex.exec(content)) !== null) {
            properties.push({
                name: match[1],
                type: match[2].trim(),
            })
        }

        return properties
    })

    plop.setHelper('extractEvents', function (content) {
        const events = []
        const emitRegex = /this\.emit\('([^']+)'/g
        let match

        while ((match = emitRegex.exec(content)) !== null) {
            events.push(match[1])
        }

        return events
    })

    // Your existing component generator
    plop.setGenerator('component', {
        description: 'Generate a new component',
        prompts: [
            {
                type: 'input',
                name: 'tag',
                message: 'Tag name? (e.g. terra-button)',
                validate: value => {
                    // Start with terra- and include only a-z + dashes
                    if (!/^terra-[a-z-+]+/.test(value)) {
                        return false
                    }

                    // No double dashes or ending dash
                    if (value.includes('--') || value.endsWith('-')) {
                        return false
                    }

                    return true
                },
            },
        ],
        actions: [
            {
                type: 'add',
                path: '../../src/components/{{ tagWithoutPrefix tag }}/{{ tagWithoutPrefix tag }}.ts',
                templateFile: 'templates/component/define.hbs',
            },
            {
                type: 'add',
                path: '../../src/components/{{ tagWithoutPrefix tag }}/{{ tagWithoutPrefix tag }}.component.ts',
                templateFile: 'templates/component/component.hbs',
            },
            {
                type: 'add',
                path: '../../src/components/{{ tagWithoutPrefix tag }}/{{ tagWithoutPrefix tag }}.styles.ts',
                templateFile: 'templates/component/styles.hbs',
            },
            {
                type: 'add',
                path: '../../src/components/{{ tagWithoutPrefix tag }}/{{ tagWithoutPrefix tag }}.test.ts',
                templateFile: 'templates/component/tests.hbs',
            },
            {
                type: 'add',
                path: '../../docs/pages/components/{{ tagWithoutPrefix tag }}.md',
                templateFile: 'templates/component/docs.hbs',
            },
            {
                type: 'modify',
                path: '../../src/terra-ui-components.ts',
                pattern: /\/\* plop:component \*\//,
                template: `export { default as {{ properCase tag }} } from './components/{{ tagWithoutPrefix tag }}/{{ tagWithoutPrefix tag }}.js';\n/* plop:component */`,
            },
        ],
    })

    // New widget generator
    plop.setGenerator('widgets', {
        description: 'Generate Python widgets for all Terra components',
        prompts: [],
        actions: function () {
            // Read all component files
            const componentsDir = path.join(__dirname, '../../src/components')
            const components = fs
                .readdirSync(componentsDir)
                .filter(file =>
                    fs.statSync(path.join(componentsDir, file)).isDirectory()
                )
                .map(dir => ({
                    name: dir,
                    content: fs.readFileSync(
                        path.join(componentsDir, dir, `${dir}.component.ts`),
                        'utf-8'
                    ),
                }))

            const actions = []

            components.forEach(component => {
                const componentDir = `../../src/terra_ui_components/${component.name}`

                // Create component directory
                actions.push({
                    type: 'add',
                    path: `${componentDir}/__init__.py`,
                    template: '',
                })

                // Create widget file
                actions.push({
                    type: 'add',
                    path: `${componentDir}/${component.name}.py`,
                    templateFile: 'templates/widget/widget.py.hbs',
                    data: {
                        name: component.name,
                        properties: plop.getHelper('extractProperties')(
                            component.content
                        ),
                        events: plop.getHelper('extractEvents')(component.content),
                    },
                    skipIfExists: false,
                })
            })

            return actions
        },
    })
}
