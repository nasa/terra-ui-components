#!/usr/bin/env node
import { se } from 'date-fns/locale'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Source theme file and output directory location for docs
const INPUT = path.resolve(__dirname, '../src/themes/horizon.scss')
const OUTPUT_DIR = path.resolve(__dirname, '../docs/pages/tokens/generated/')

// ===== HELPERS =====

function formatTitle(str) {
    return str
        .replace(/\*/g, '')
        .replace(/\//g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, c => c.toUpperCase())
}

function slugify(str) {
    // Remove @tokens, @tokens-subsection, and special characters, then convert to kebab-case
    return str
        .toLowerCase()
        .replace(/@tokens/g, '')
        .replace(/@tokens-subsection/g, '')
        .replace(/[^\w\s-]/g, '') // remove special chars
        .trim()
        .replace(/\s+/g, '-') // spaces → dashes
        .substring(0, 80) // prevent insanely long filenames
}

function getTagValue(block, tag) {
    const line = block.find(l => l.startsWith(tag + ' '))   // ensure we match the exact tag (e.g. @tokens not @tokens-subsection)
    return line
        ?.replace(tag + ' ', '')
        .trim()
}

function getDescription(block) {
    const desc = []

    const startIndex = block.findIndex(line => line.trim().startsWith('@description'))

    if (startIndex === -1) return []

    for (let i = startIndex + 1; i < block.length; i++) {
        const line = block[i].trim()

        // Stop at next tag
        if (line.startsWith('@')) break

        if (line.length > 0) {
            desc.push(line)
        }
    }

    return desc
}

function getLastGroup(section) {
    const children = section.children

    if (!children.length) return null

    const last = children[children.length - 1]

    if (last.type === 'subgroup') return last

    if (last.type === 'subsection') {
        const subChildren = last.children
        return subChildren[subChildren.length - 1] || null
    }

    return null
}

function isTokenBlock(block) {
    if (!block || block.length === 0) return false

    // Find first non-empty line
    const firstLine = block.find(l => l.trim().length > 0) || ''

    return /^@tokens(\s|-subsection|-subgroup)\b/.test(firstLine)
}

function cleanLine(line) {
    return line
        .replace(/^\s*\*\s?/, '') // remove leading "* "
        .replace(/\r/g, '')
        .trim()
}

// ===== STEP 1–2: PARSE SCSS THEME FILE =====

function parseScss(content) {
    const lines = content.split('\n')

    const sections = {}

    let currentSection = null
    let currentSubsection = null
    let currentSubgroup = null

    let buffer = ''

    // Step 1: Extract comment blocks related to token documentation for reference in step 2. 
    // These blocks will conntain directives like @token, @token-subsection, @toke-subgroup, @layout.
    const blocks = []
    let currentBlock = null

    for (let line of lines) {
        if (line.includes('/**')) {
            currentBlock = []
        } else if (line.includes('*/')) {
            if (currentBlock) blocks.push(currentBlock)
            currentBlock = null
        } else if (currentBlock) {
            currentBlock.push(cleanLine(line))
        }
    }

    // Step 2: Iterate through SCSS lines again matching the token documentation block order to the extracted blocks 
    // from step 1, then harvest the actual token names and values from the SCSS line and construction the 
    // section/subsection/group hierarchy based on the directives found in the comment blocks.

    let blockIndex = 0

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()

        // ----------------------------------------------------------------------
        // Process comment blocks - collect metadata and build section structures
        // ----------------------------------------------------------------------
        if (line.startsWith('/**')) {
            const block = blocks[blockIndex++] || []

            // skip if @tokens, @tokens-subsection, or @tokens-subgroup directive is not present at the start of the next line after the /**. 
            if (!isTokenBlock(block)) {
                continue
            }

            // Extract metadata from previously extracted block
            const sectionName = getTagValue(block, '@tokens')
            const subsectionName = getTagValue(block, '@tokens-subsection')
            const subgroupName = getTagValue(block, '@tokens-subgroup')
            const layout = getTagValue(block, '@layout') || 'table'
            const description = getDescription(block)

            // Debugging
            //console.log('BLOCK:', block)
            //console.log('DESCRIPTION:', description)

            // Build section/subsection/subgroup hierarchy based on block metadata

            // ---- Section ----
            if (sectionName) {
                currentSection = formatTitle(sectionName)

                sections[currentSection] = {
                    description,
                    children: [],
                }

                currentSubsection = null
                currentSubgroup = null
            }

            // ---- Subsection ----
            else if (subsectionName && currentSection) {
                const subsection = {
                    type: 'subsection',
                    name: formatTitle(subsectionName),
                    description,
                    children: [],
                }

                sections[currentSection].children.push(subsection)

                currentSubsection = subsection
                currentSubgroup = null
            }

            // ---- Subgroup ----
            else if (subgroupName && currentSection) {
                const subgroup = {
                    type: 'subgroup',
                    name: formatTitle(subgroupName),
                    description,
                    layout,
                    tokens: [],
                }

                if (currentSubsection) {
                    currentSubsection.children.push(subgroup)
                } else {
                    sections[currentSection].children.push(subgroup)
                }

                currentSubsection = null
                currentSubgroup = subgroup
            }

            continue
        }

        // If SCSS line is a token definition and we have a current subgroup context, parse the token name 
        // and value and add it to the current subgroup's tokens array.
        // 
        // Token parsing (multi-line safe)
        // 
        if (line.startsWith('--')) {
            buffer = line
        } else if (buffer) {
            buffer += ' ' + line
        }

        if (buffer && buffer.endsWith(';')) {
            const match = buffer.match(/^(--[\w-]+):\s*(.+);$/)

            if (match && currentSubgroup) {
                const name = match[1]
                const value = match[2]
                    .replace(/\s+/g, ' ')
                    .replace(/\(\s+/g, '(')
                    .replace(/\s+\)/g, ')')
                    .trim()

                // Find last subgroup
                const last = getLastGroup(sections[currentSection]);

                if (last) {
                    last.tokens.push({ name, value });
                }
            }

            buffer = ''
        }
    }
    return sections
}

// ===== GENERATE MARKDOWN FILES =====

function writeFiles(sections, outputDir) {
    if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true })
    }
    fs.mkdirSync(outputDir, { recursive: true })

    for (const [sectionName, sectionData] of Object.entries(sections)) {
        const fileName = slugify(sectionName) + '.md'
        const filePath = path.join(outputDir, fileName)

        let md = ''

        // -----------------------------
        // FRONTMATTER
        // -----------------------------
        const descriptionText = sectionData.description.join(' ')

        md += `---\n`
        md += `meta:\n`
        md += `    title: ${sectionName}\n`
        md += `    description: ${descriptionText}\n`
        md += `---\n\n`

        // -----------------------------
        // OPTIONAL PAGE TITLE
        // -----------------------------
        md += `# ${sectionName}\n\n`

        // -----------------------------
        // DESCRIPTION
        // -----------------------------
        if (sectionData.description.length > 0) {
            md += sectionData.description.join(' ') + '\n\n'
        }

        // -----------------------------
        // SUBSECTIONS and GROUPS
        // -----------------------------
        md += renderChildren(sectionData.children)

        fs.writeFileSync(filePath, md)
    }
}

function renderChildren(children, depth = 2) {
    let md = ''

    for (const item of children) {
        if (item.type === 'subsection') {
            md += `${'#'.repeat(depth)} ${item.name}\n\n`
            md += `${item.description}\n\n`
            md += renderChildren(item.children, depth + 1)
        }

        if (item.type === 'subgroup') {
            if (item.layout === 'swatch') {
                md += renderSwatchGroup(item.name, item.description, item.tokens)
            } else if (item.layout === 'table-swatch') {
                md += renderTableSwatchGroup(item.name, item.description, item.tokens)
            } else {
                md += renderTableGroup(item.name, item.description, item.tokens)
            }
        }
    }

    return md
}

function renderSwatchGroup(subName, description, tokens) {
    let md = `### ${subName}\n\n`
    if (description.length > 0) {
        md += description.join(' ') + '\n\n'
    }
    md += `<div style="display:flex; flex-wrap:wrap; gap:16px;">\n`

    for (const token of tokens) {
        md += `
<div style="width:120px;">
  <div style="
    height:60px;
    border-radius:6px;
    border:1px solid #ccc;
    background:${token.value};
  "></div>
  <div style="margin-top:6px;"><code>${token.name}</code></div>
  <div><code>${token.value}</code></div>
</div>
`
    }

    md += `</div>\n\n`

    return md
}

function renderTableGroup(subName, description, tokens) {
    let md = `### ${subName}\n\n`
    
    if (description.length > 0) {
        md += `${description}\n\n`
    }
    
    md += `| Token | Value |\n`
    md += `|-------|-------|\n`

    for (const token of tokens) {
        md += `| \`${token.name}\` | \`${token.value}\` |\n`
    }

    md += `\n`

    return md
}

function renderTableSwatchGroup(subName, description, tokens) {
    let md = `### ${subName}\n\n`

    if (description.length > 0) {
        md += description.join(' ') + '\n\n'
    }

    md += `| Token | Value | Preview |\n`
    md += `|-------|-------|---------|\n`

    for (const token of tokens) {
        md += `| \`${token.name}\` | \`${token.value}\` | <span style="display:inline-block;width:40px;height:20px;border-radius:4px;border:1px solid #ccc;background:${token.value};"></span> |\n`
    }

    md += `\n`

    return md
}

// ===== MAIN =====

function main() {
    if (!fs.existsSync(INPUT)) {
        console.error(`❌ Could not find file: ${INPUT}`)
        process.exit(1)
    }

    const content = fs.readFileSync(INPUT, 'utf-8')

    const sections = parseScss(content)

    writeFiles(sections, OUTPUT_DIR)

    console.log('✅ Token docs generated successfully')
}

main()
