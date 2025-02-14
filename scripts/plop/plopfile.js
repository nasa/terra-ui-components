import fs from 'fs'
import path from 'path'

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

    // Widgets Generator
    plop.setGenerator('widgets', {
        description: 'Update Python widgets for all Terra components',
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
