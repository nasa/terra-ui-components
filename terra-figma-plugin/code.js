// Show the UI (300x400 window, adjustable)
figma.showUI(__html__, { width: 300, height: 400 })

// Listen for messages from UI
figma.ui.onmessage = async msg => {
    if (msg.type === 'generate') {
        await generateCSS()
    } else if (msg.type === 'resize') {
        figma.ui.resize(msg.size.w, msg.size.h)
    }
}

// Main function to generate CSS
async function generateCSS() {
    let cssOutput = ''

    // Get all local collections (async)
    let collections = await figma.variables.getLocalVariableCollectionsAsync()

    // Sort collections alphabetically by name to provide a consistent order
    collections.sort((a, b) => a.name.localeCompare(b.name))

    for (const collection of collections) {
        cssOutput += `/* Collection: ${collection.name} */\n`

        // Get all variables in the collection (async)
        const variables = await Promise.all(
            collection.variableIds.map(
                async id => await figma.variables.getVariableByIdAsync(id)
            )
        )

        // Filter for color variables
        const colorVariables = variables.filter(v => v && v.resolvedType === 'COLOR')

        // For each mode in the collection
        for (const mode of collection.modes) {
            cssOutput += `:root[data-mode="${mode.name}"] {\n`

            for (const variable of colorVariables) {
                const value = variable.valuesByMode[mode.modeId]

                if (value === undefined) continue

                // Transform name: Handle camelCase, spaces, slashes -> "--color-primary"
                const cssName = `--terra-${variable.name
                    .replace(/([a-z])([A-Z])/g, '$1-$2')
                    .replace(/[\s\/]+/g, '-')
                    .toLowerCase()}`

                let cssValue
                if ('type' in value && value.type === 'VARIABLE_ALIAS') {
                    const aliasedVariable =
                        await figma.variables.getVariableByIdAsync(value.id)
                    if (aliasedVariable) {
                        const aliasedCssName = `--terra-${aliasedVariable.name
                            .replace(/([a-z])([A-Z])/g, '$1-$2')
                            .replace(/[\s\/]+/g, '-')
                            .toLowerCase()}`
                        cssValue = `var(${aliasedCssName})`
                    } else {
                        continue // Skip if alias not found
                    }
                } else {
                    cssValue = colorToHsla(value)
                }

                cssOutput += `  ${cssName}: ${cssValue};\n`
            }

            cssOutput += '}\n\n'
        }
    }

    // Send the output to UI
    figma.ui.postMessage({ type: 'css', data: cssOutput })
}

// Convert {r, g, b, a} to hsla string
function colorToHsla(color) {
    let r = color.r
    let g = color.g
    let b = color.b
    let a = color.a !== undefined ? color.a : 1

    let max = Math.max(r, g, b)
    let min = Math.min(r, g, b)
    let h,
        s,
        l = (max + min) / 2

    if (max === min) {
        h = s = 0 // achromatic
    } else {
        let d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }

    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)

    return `hsla(${h}, ${s}%, ${l}%, ${a})`
}
