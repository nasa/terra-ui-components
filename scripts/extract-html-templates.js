import fs from 'fs'
import path from 'path'
import { globby } from 'globby'

const CACHE_DIR = '.cache/vale-html'

/**
 * Extracts Lit `html\`...\`` tagged template literals from a TypeScript source string
 * while preserving exact 1:1 line and column coordinates for every character.
 */
function extractHtmlTemplates(src) {
    const n = src.length
    const out = new Array(n)
    for (let k = 0; k < n; k++) {
        const ch = src[k]
        out[k] = ch === '\n' || ch === '\r' ? ch : ' '
    }

    let found = false
    let i = 0

    function scanCode(stopAtBraceDepthZero = false) {
        let depth = stopAtBraceDepthZero ? 1 : 0
        while (i < n) {
            const ch = src[i]

            // Line comment
            if (ch === '/' && src[i + 1] === '/') {
                i += 2
                while (i < n && src[i] !== '\n') i++
                continue
            }

            // Block comment
            if (ch === '/' && src[i + 1] === '*') {
                i += 2
                while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++
                i += 2
                continue
            }

            // Lit `html\`...\`` tagged template literal
            if (
                ch === 'h' &&
                src.startsWith('html', i) &&
                (i === 0 || !/[a-zA-Z0-9_$]/.test(src[i - 1]))
            ) {
                let j = i + 4
                while (j < n && /\s/.test(src[j])) j++
                if (src[j] === '`') {
                    found = true
                    i = j + 1
                    scanHtmlTemplate()
                    continue
                }
            }

            // Quoted string literals
            if (ch === '"' || ch === "'") {
                const quote = ch
                i++
                while (i < n && src[i] !== quote) {
                    if (src[i] === '\\') i++
                    i++
                }
                i++
                continue
            }

            // Non-html template literals
            if (ch === '`') {
                i++
                while (i < n && src[i] !== '`') {
                    if (src[i] === '\\') {
                        i += 2
                        continue
                    }
                    if (src[i] === '$' && src[i + 1] === '{') {
                        i += 2
                        scanCode(true)
                        continue
                    }
                    i++
                }
                i++
                continue
            }

            if (stopAtBraceDepthZero) {
                if (ch === '{') depth++
                else if (ch === '}') {
                    depth--
                    if (depth === 0) {
                        i++
                        return
                    }
                }
            }

            i++
        }
    }

    function scanHtmlTemplate() {
        while (i < n) {
            if (src[i] === '\\') {
                out[i] = src[i]
                if (i + 1 < n) out[i + 1] = src[i + 1]
                i += 2
                continue
            }
            if (src[i] === '`') {
                i++
                return
            }
            if (src[i] === '$' && src[i + 1] === '{') {
                // Keep attribute syntax valid (e.g. href=${...} -> href="")
                if (i > 0 && src[i - 1] === '=') {
                    out[i] = '"'
                    out[i + 1] = '"'
                }
                i += 2
                scanCode(true)
                continue
            }
            out[i] = src[i]
            i++
        }
    }

    scanCode(false)
    return found ? out.join('') : null
}

async function main() {
    fs.rmSync(CACHE_DIR, { recursive: true, force: true })

    const tsFiles = await globby([
        'src/components/**/*.ts',
        '!src/components/**/*.test.ts',
        '!src/components/**/*.styles.ts',
    ])

    for (const file of tsFiles) {
        const src = fs.readFileSync(file, 'utf8')
        const extracted = extractHtmlTemplates(src)
        if (extracted) {
            const htmlTarget = path.join(
                CACHE_DIR,
                file.replace(/\.ts$/, '.html')
            )
            fs.mkdirSync(path.dirname(htmlTarget), { recursive: true })
            fs.writeFileSync(htmlTarget, extracted, 'utf8')
        }
    }
}

main()
