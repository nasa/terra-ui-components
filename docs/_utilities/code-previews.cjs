let count = 1

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

/**
 * Turns code fields with the :preview suffix into interactive code previews.
 */
module.exports = function (doc, options) {
    options = {
        within: 'body', // the element containing the code fields to convert
        ...options,
    }

    const within = doc.querySelector(options.within)
    if (!within) {
        return doc
    }

    within.querySelectorAll('[class*=":preview"]').forEach(code => {
        const pre = code.closest('pre')
        if (!pre) {
            return
        }
        const adjacentPre =
            pre.nextElementSibling?.tagName.toLowerCase() === 'pre'
                ? pre.nextElementSibling
                : null
        const reactCode = adjacentPre?.querySelector('code[class$="react"]')

        // Check for Jupyter preview
        // Option 1: Separate code block with "jupyter" class containing the URL
        // Check in adjacent pre block first, then check further adjacent blocks
        let jupyterCode = adjacentPre?.querySelector('code[class*="jupyter"]')
        let jupyterPre = null
        if (!jupyterCode && adjacentPre) {
            // Check next adjacent pre block if first one didn't have Jupyter
            let nextPre = adjacentPre.nextElementSibling
            while (nextPre && nextPre.tagName.toLowerCase() === 'pre') {
                jupyterCode = nextPre.querySelector('code[class*="jupyter"]')
                if (jupyterCode) {
                    jupyterPre = nextPre
                    break
                }
                nextPre = nextPre.nextElementSibling
            }
        } else if (jupyterCode) {
            jupyterPre = adjacentPre
        }

        // Option 2: Check if the current code block is a Jupyter-only preview
        const isJupyterOnly =
            code.getAttribute('class').includes('jupyter:preview') ||
            code.getAttribute('class').includes(':preview:jupyter')

        let jupyterUrl = null
        if (isJupyterOnly) {
            // Jupyter-only preview: use content as URL or default
            jupyterUrl = code.textContent.trim()
            jupyterCode = code
        } else if (jupyterCode) {
            // Separate Jupyter code block: use its content as URL
            jupyterUrl = jupyterCode.textContent.trim()
        }

        const sourceGroupId = `code-preview-source-group-${count}`
        const isExpanded = code.getAttribute('class').includes(':expanded')
        const noCodePen = code.getAttribute('class').includes(':no-codepen')

        count++

        const htmlButton = `
      <button type="button"
        title="Show HTML code"
        class="code-preview__button code-preview__button--html"
      >
        HTML
      </button>
    `

        const reactButton = `
      <button type="button" title="Show React code" class="code-preview__button code-preview__button--react">
        React
      </button>
    `

        const jupyterButton = `
      <button type="button" title="Show Jupyter Notebook" class="code-preview__button code-preview__button--jupyter">
        Jupyter
      </button>
    `

        const codePenButton = `
      <button type="button" class="code-preview__button code-preview__button--codepen" title="Edit on CodePen">
        <svg
          width="138"
          height="26"
          viewBox="0 0 138 26"
          fill="none"
          stroke="currentColor"
          stroke-width="2.3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M80 6h-9v14h9 M114 6h-9 v14h9 M111 13h-6 M77 13h-6 M122 20V6l11 14V6 M22 16.7L33 24l11-7.3V9.3L33 2L22 9.3V16.7z M44 16.7L33 9.3l-11 7.4 M22 9.3l11 7.3 l11-7.3 M33 2v7.3 M33 16.7V24 M88 14h6c2.2 0 4-1.8 4-4s-1.8-4-4-4h-6v14 M15 8c-1.3-1.3-3-2-5-2c-4 0-7 3-7 7s3 7 7 7 c2 0 3.7-0.8 5-2 M64 13c0 4-3 7-7 7h-5V6h5C61 6 64 9 64 13z" />
        </svg>
      </button>
    `

        const htmlPreviewContent = !isJupyterOnly ? code.textContent : ''
        const jupyterPreviewContent = jupyterUrl
            ? `<iframe src="${escapeHtml(jupyterUrl)}" style="width: 100%; height: 600px; border: none;"></iframe>`
            : ''

        const codePreview = `
      <div class="code-preview ${isExpanded ? 'code-preview--expanded' : ''}" ${jupyterUrl ? 'data-has-jupyter="true"' : ''}>
        <div class="code-preview__preview">
          ${
              !isJupyterOnly
                  ? `<div class="code-preview__preview-content" data-flavor="html">${htmlPreviewContent}</div>`
                  : ''
          }
          ${
              jupyterUrl
                  ? `<div class="code-preview__preview-content" data-flavor="jupyter">${jupyterPreviewContent}</div>`
                  : ''
          }
          <div class="code-preview__resizer">
            <terra-icon name="solid-bars-4" library="heroicons"></terra-icon>
          </div>
        </div>

        <div class="code-preview__source-group" id="${sourceGroupId}">
          ${
              !isJupyterOnly
                  ? `
            <div class="code-preview__source code-preview__source--html" ${
                reactCode || jupyterUrl ? 'data-flavor="html"' : ''
            }>
              <pre><code class="language-html">${escapeHtml(
                  code.textContent
              )}</code></pre>
            </div>
          `
                  : ''
          }

          ${
              reactCode
                  ? `
            <div class="code-preview__source code-preview__source--react" data-flavor="react">
              <pre><code class="language-jsx">${escapeHtml(
                  reactCode.textContent
              )}</code></pre>
            </div>
          `
                  : ''
          }

          ${
              jupyterUrl
                  ? `
            <div class="code-preview__source code-preview__source--jupyter" data-flavor="jupyter">
              <pre><code class="language-text">${escapeHtml(jupyterUrl)}</code></pre>
            </div>
          `
                  : ''
          }
        </div>

        <div class="code-preview__buttons">
          <button
            type="button"
            class="code-preview__button code-preview__toggle"
            aria-expanded="${isExpanded ? 'true' : 'false'}"
            aria-controls="${sourceGroupId}"
          >
            Source
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          ${!isJupyterOnly && (reactCode || jupyterUrl) ? ` ${htmlButton} ` : ''}
          ${reactCode ? reactButton : ''}
          ${jupyterUrl ? jupyterButton : ''}

          ${noCodePen ? '' : codePenButton}
        </div>
      </div>
    `

        pre.insertAdjacentHTML('afterend', codePreview)
        pre.remove()

        // Remove pre blocks that were used for React or Jupyter
        // We remove them so the code (URL) is not visible on the page
        if (adjacentPre) {
            const wasUsedForReact = reactCode?.closest('pre')?.isSameNode(adjacentPre)
            const wasUsedForJupyter =
                jupyterCode &&
                !isJupyterOnly &&
                jupyterCode.closest('pre')?.isSameNode(adjacentPre)

            // Remove adjacentPre if it was used (we've already extracted the code)
            // Exception: if it has React code, we might need to keep it, but actually we've extracted it too
            if (wasUsedForReact || wasUsedForJupyter) {
                adjacentPre.remove()
            }
        }

        // Remove Jupyter code block if it was in a separate pre block (not Jupyter-only and not in adjacentPre)
        // This ensures the URL text is not visible on the page
        if (jupyterCode && !isJupyterOnly && !code.isSameNode(jupyterCode)) {
            const jupyterCodePre = jupyterCode.closest('pre')
            const wasInAdjacentPre =
                adjacentPre && jupyterCodePre?.isSameNode(adjacentPre)

            // Only remove if it's in a different pre block than adjacentPre (which was already removed above)
            if (!wasInAdjacentPre && jupyterPre) {
                jupyterPre.remove()
            } else if (!wasInAdjacentPre) {
                // Fallback: remove the pre containing jupyterCode if it wasn't already removed
                const fallbackPre = jupyterCodePre
                if (
                    fallbackPre &&
                    fallbackPre !== adjacentPre &&
                    fallbackPre.parentNode
                ) {
                    fallbackPre.remove()
                }
            }
        }
    })

    // Wrap code preview scripts in anonymous functions so they don't run in the global scope
    doc.querySelectorAll('.code-preview__preview script').forEach(script => {
        if (script.type === 'module') {
            // Modules are already scoped
            script.textContent = script.innerHTML
        } else {
            // Wrap non-modules in an anonymous function so they don't run in the global scope
            script.textContent = `(() => { ${script.innerHTML} })();`
        }
    })

    return doc
}
