import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export default function (plop) {
    // Existing helpers
    plop.setHelper('tagWithoutPrefix', tag => tag.replace(/^terra-/, ''))

    plop.setHelper('tagToTitle', tag => {
        const withoutPrefix = plop.getHelper('tagWithoutPrefix')
        const titleCase = plop.getHelper('titleCase')
        return titleCase(withoutPrefix(tag).replace(/-/g, ' '))
    })

    // Add helper for property type mapping
    plop.setHelper('propertyType', type => {
        const typeMap = {
            string: 'Unicode',
            boolean: 'Bool',
            number: 'Float',
        }
        return typeMap[type.toLowerCase()] || 'Unicode'
    })

    // Add helpers for property and event extraction
    plop.setHelper('extractProperties', function (content) {
        const properties = []
        // Match @property(...) followed by property name and optional type
        const propertyRegex = /@property\([^)]*\)\s+(\w+)(?::\s*([^=\n]+))?/g
        let match

        while ((match = propertyRegex.exec(content)) !== null) {
            const name = match[1]
            let type = match[2] || 'string' // default to string if no type specified

            // Clean up any type by taking first part before any union types or whitespace
            type = type.split('|')[0].trim()

            properties.push({
                name,
                type,
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

    // Component Generator
    plop.setGenerator('component', {
        description: 'Generate a new component',
        prompts: [
            {
                type: 'input',
                name: 'tag',
                message: 'Tag name? (e.g. terra-button)',
                validate: value => {
                    if (!/^terra-[a-z-+]+/.test(value)) {
                        return false
                    }
                    if (value.includes('--') || value.endsWith('-')) {
                        return false
                    }
                    return true
                },
            },
        ],
        actions: data => [
            // Existing component actions
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
            // Widget scaffolding with proper __init__.py files
            {
                type: 'add',
                path: '../../src/terra_ui_components/{{ tagWithoutPrefix tag }}/__init__.py',
                template:
                    'from .{{ tagWithoutPrefix tag }} import Terra{{ properCase (tagWithoutPrefix tag) }}\n\n__all__ = ["Terra{{ properCase (tagWithoutPrefix tag) }}"]',
            },
            {
                type: 'add',
                path: '../../src/terra_ui_components/{{ tagWithoutPrefix tag }}/{{ tagWithoutPrefix tag }}.py',
                templateFile: 'templates/widget/widget.py.hbs',
                data: {
                    name: plop.getHelper('tagWithoutPrefix')(data.tag),
                    className:
                        'Terra' +
                        plop.getHelper('properCase')(
                            plop.getHelper('tagWithoutPrefix')(data.tag)
                        ),
                },
            },
            // Update root __init__.py
            {
                type: 'modify',
                path: '../../src/terra_ui_components/__init__.py',
                pattern: /(from[\s\S]*?)(__all__\s*=\s*\[[\s\S]*?\])/,
                template: `$1from .{{ tagWithoutPrefix tag }} import Terra{{ properCase (tagWithoutPrefix tag) }}\n$2`,
            },
            {
                type: 'modify',
                path: '../../src/terra_ui_components/__init__.py',
                pattern: /(__all__\s*=\s*\[[\s\S]*?)\]/,
                template: `$1, "Terra{{ properCase (tagWithoutPrefix tag) }}"]`,
            },
        ],
    })

    // Add this new generator after your existing ones
    plop.setGenerator('update-widget', {
        description: 'Update a specific widget with current properties and events',
        prompts: [
            {
                type: 'input',
                name: 'tag',
                message: 'Component tag name? (e.g. terra-button)',
                validate: value => {
                    if (!/^terra-[a-z-+]+/.test(value)) {
                        return false
                    }
                    if (value.includes('--') || value.endsWith('-')) {
                        return false
                    }
                    return true
                },
            },
        ],
        actions: data => {
            const componentName = plop.getHelper('tagWithoutPrefix')(data.tag)
            const componentPath = path.join(
                path.dirname(fileURLToPath(import.meta.url)),
                '../../src/components',
                componentName,
                `${componentName}.component.ts`
            )

            console.log(componentPath, fs.existsSync(componentPath))

            try {
                const content = fs.readFileSync(componentPath, 'utf-8')
                return [
                    {
                        type: 'add',
                        path: `../../src/terra_ui_components/${componentName}/${componentName}.py`,
                        templateFile: 'templates/widget/widget.py.hbs',
                        data: {
                            name: componentName,
                            className:
                                'Terra' + plop.getHelper('properCase')(componentName),
                            properties: plop.getHelper('extractProperties')(content),
                            events: plop.getHelper('extractEvents')(content),
                        },
                        force: true, // we want to overwrite this file if it already exists
                    },
                ]
            } catch (error) {
                throw new Error(`Could not find component: ${componentPath}`)
            }
        },
    })

    // Widgets Generator
    plop.setGenerator('widgets', {
        description: 'Update Python widgets for all Terra components',
        prompts: [],
        actions: function () {
            // Read all component files
            const componentsDir = path.join(
                path.dirname(fileURLToPath(import.meta.url)),
                '../../src/components'
            )
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
                const className = `Terra${plop.getHelper('properCase')(component.name)}`

                // Create/update component's __init__.py
                actions.push({
                    type: 'add',
                    path: `${componentDir}/__init__.py`,
                    template: `from .${component.name} import ${className}\n\n__all__ = ["${className}"]`,
                    skipIfExists: false,
                })

                // Update widget file with extracted properties and events
                actions.push({
                    type: 'add',
                    path: `${componentDir}/${component.name}.py`,
                    templateFile: 'templates/widget/widget.py.hbs',
                    data: {
                        name: component.name,
                        className,
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
