//
// This script bakes and copies themes, then generates a corresponding Lit stylesheet in dist/themes
//
import chalk from 'chalk'
import commandLineArgs from 'command-line-args'
import fs from 'fs'
import { mkdirSync } from 'fs'
import { globbySync } from 'globby'
import path from 'path'
import prettier from 'prettier'
import * as sass from 'sass'
import stripComments from 'strip-css-comments'

const { outdir } = commandLineArgs({ name: 'outdir', type: String })
const files = [
    ...globbySync('./src/themes/**/[!_]*.css'),
    ...globbySync('./src/themes/**/[!_]*.scss'),
]
const filesToEmbed = [
    ...globbySync('./src/themes/**/_*.css'),
    ...globbySync('./src/themes/**/_*.scss'),
]
const themesDir = path.join(outdir, 'themes')
const embeds = {}

mkdirSync(themesDir, { recursive: true })

// Gather an object containing the source of all files named "_filename.css" or "_filename.scss" so we can embed them later
filesToEmbed.forEach(file => {
    const basename = path.basename(file)
    let content = fs.readFileSync(file, 'utf8')

    // If it's a SCSS file, compile it first
    if (file.endsWith('.scss')) {
        content = sass.compileString(content, {
            style: 'expanded',
        }).css
    }

    embeds[basename] = content
})

// Loop through each theme file, copying the .css and generating a .js version for Lit users
files.forEach(async file => {
    let source = fs.readFileSync(file, 'utf8')
    const isScss = file.endsWith('.scss')

    // If the source has "/* _filename.css */" or "/* _filename.scss */" in it, replace it with the embedded styles
    Object.keys(embeds).forEach(key => {
        source = source.replace(`/* ${key} */`, embeds[key])
    })

    // Compile SCSS to CSS if needed
    if (isScss) {
        const result = sass.compileString(source, {
            style: 'expanded',
        })
        source = result.css
    }

    const css = await prettier.format(stripComments(source), {
        parser: 'css',
    })

    let js = await prettier.format(
        `
    import { css } from 'lit';

    export default css\`
      ${css}
    \`;
  `,
        { parser: 'babel-ts' }
    )

    let dTs = await prettier.format(
        `
    declare const _default: import("lit").CSSResult;
    export default _default;
  `,
        { parser: 'babel-ts' }
    )

    const basename = path.basename(file).replace(/\.(css|scss)$/, '.css')
    const cssFile = path.join(themesDir, basename)
    const jsFile = path.join(themesDir, basename.replace('.css', '.styles.js'))
    const dTsFile = path.join(themesDir, basename.replace('.css', '.styles.d.ts'))

    fs.writeFileSync(cssFile, css, 'utf8')
    fs.writeFileSync(jsFile, js, 'utf8')
    fs.writeFileSync(dTsFile, dTs, 'utf8')
})
