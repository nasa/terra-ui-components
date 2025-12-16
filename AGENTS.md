## Purpose

This file is instructions for AI coding assistants (like Claude, GPT, or Cursor Agents) working in this repo.

Your main goals:

-   **Help build, refactor, and debug Terra UI components** (Lit-based web components, React wrappers, and Python widgets).
-   **Use the existing documentation in `docs/` instead of re‑inventing APIs or behavior.**

When in doubt, **prefer reading existing docs and code over guessing.**

---

## Where to Read Documentation

-   **Component docs (primary source)**
    -   Markdown docs for each component live at `docs/pages/components/*.md`.
    -   Examples:
        -   `docs/pages/components/map.md`
        -   `docs/pages/components/time-average-map.md`
        -   `docs/pages/components/browse-variables.md`
    -   These files usually contain:
        -   Example HTML usage blocks (often fenced as ` ```html:preview `).
        -   A `[component-metadata:terra-X]` tag; behavior is defined by the underlying component in `src/components/`.
-   **Getting started / framework integration**
    -   `docs/pages/getting-started/*.md` – overall usage, themes, installation, localization, etc.
    -   `docs/pages/frameworks/*.md` – using Terra UI with React, Vue, Angular, etc.
-   **Design tokens**
    -   `docs/pages/tokens/*.md` – color, typography, spacing, etc. Use these as the single source of truth for design decisions.

**When building or modifying a component:**

1. **Read the relevant `docs/pages/components/<component>.md`.**
2. **Review its implementation in `src/components/<component>/<component>.component.ts` (and related controller/utility files).**
3. Keep the docs, implementation, and examples in sync when making behavior or API changes.

You can also consult the built documentation site under `_site/` (mirrors `docs/`), but prefer editing/reading the Markdown sources in `docs/`.

---

## Core Project Layout

-   **Lit web components**
    -   Source: `src/components/**`
    -   Example complex components:
        -   `time-average-map` – `src/components/time-average-map/*.ts`
        -   `browse-variables` – `src/components/browse-variables/*.ts`
-   **React wrappers**
    -   `src/react/**` – React bindings around the web components.
-   **Python widgets / Jupyter**
    -   `src/terra_ui_components/**` – Python package for Jupyter widgets.
    -   `notebooks/playground.ipynb` – example notebook using components.
-   **Docs site**
    -   Source: `docs/**`
    -   Built site: `_site/**`
-   **Build & tooling scripts**
    -   `scripts/*.js` – Node build, theming, React wrapper generation, etc.
    -   `scripts/plop/*.js|*.hbs` – code generators for new components/widgets.

When you need to understand how a feature works, **start from the component docs, then read the corresponding `src/components` files and any data services or utilities they depend on.**

---

## Common Commands (Node & Python)

From the repo root:

-   **Install JS deps**

```bash
npm install
```

-   **Run dev server (docs + components)**

```bash
npm start        # alias for `npm run serve`
```

This uses `node scripts/build.js --serve` and will:

-   Build the components and docs
-   Start a local dev server
-   Auto-reload the browser for most source changes (no full HMR due to custom elements constraints)

-   **Build for production**

```bash
npm run build          # builds Lit components, docs/assets, etc.
```

-   **Create a new component (scaffold)**

```bash
npm run create terra-my-component
```

This uses `plop` to scaffold:

-   Component source files under `src/components/`
-   Styles
-   Jupyter widget support
-   A docs page in `docs/pages/components/`

After scaffolding, run `git status` to see all new/updated files and **update docs/examples as needed.**

-   **Python / Jupyter dev workflow (using `uv`)**

```bash
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"
npm run start:python   # launches Jupyter Lab via .venv
```

Then open `notebooks/playground.ipynb` to test components in Jupyter.

---

## Code Style & Conventions

-   **Formatting**
    -   Use **Prettier** with the shared config `@gesdisc/prettier-config`.
    -   Prefer running `npm run prettier` or relying on `lint-staged` hooks for staged `.ts` and `.js` files.
-   **Languages & frameworks**
    -   Core components are **Lit 3** web components in TypeScript (`lit` package).
    -   Data-heavy UI uses utilities such as `leaflet`, `ol`, `plotly.js-dist-min`, `ag-grid-community`, etc. Prefer extending existing patterns over inventing new ones.
-   **Component naming**
    -   Custom elements use the `terra-` prefix: `terra-map`, `terra-time-average-map`, etc.
    -   Keep tag names stable; if you must change them, update:
        -   Component implementation
        -   Docs in `docs/pages/components/*.md`
        -   Any React/Python wrappers and examples.
-   **Structure**
    -   For complex components, logic is often split into `*.component.ts` and `*.controller.ts` plus shared utilities.
    -   Prefer **small, focused controllers and utilities** instead of bloating the component class.

When generating or modifying code, **match the patterns already used in similar components.** For example, if editing `time-average-map`, also inspect `map` and `time-series` components to keep UX and API surface consistent.

---

## Testing & Quality

-   **JS tests**

```bash
npm test            # web-test-runner, default group
npm run test:watch  # watch mode
```

Use these when making non-trivial changes to component behavior or data services.

-   **Static checks**

```bash
npm run prettier:check
npm run spellcheck
```

-   **Verification before publish (for maintainers)**

```bash
npm run verify      # prettier + build (placeholder for full test suite)
```

If you introduce or modify tests, keep them aligned with **web-test-runner** and follow existing test patterns in the repo.

---

## Git & Repository Etiquette (for AI Agents)

-   **Branching**
    -   Prefer feature branches named like:
        -   `feature/<short-description>`
        -   `bugfix/<short-description>`
        -   `docs/<component-or-topic>`
    -   Avoid committing directly to `main` in automated workflows.
-   **Commits**
    -   Use clear, imperative commit messages:
        -   `Add time-average-map zoom controls`
        -   `Fix browse-variables search reset bug`
-   **Merging vs. rebasing**
    -   It’s acceptable to use either:
        -   **Rebase** small feature branches before opening a PR to keep history linear.
        -   **Merge commits** are fine for human-maintained, multi-commit branches.
    -   As an AI, **do not perform `git push`, `git commit`, or branching commands** unless the user explicitly asks and understands the implications.

When suggesting git operations, **describe the commands for the human developer** instead of running them.

---

## Unexpected Behaviors / Project Quirks

-   **No full HMR for web components**
    -   The dev server can’t fully hot-reload custom elements due to browser limitations on re-defining tags.
    -   Expect page reloads instead of fine-grained HMR when editing component code.
-   **Docs generation**
    -   The Eleventy-based docs (`@11ty/eleventy`) use front matter and custom shortcodes (e.g., `[component-metadata:terra-map]`).
    -   When editing docs, keep front matter and shortcode usage intact; don’t convert to plain markdown headings only.
-   **Type definitions and metadata**
    -   `dist/custom-elements.json`, `cdn/custom-elements.json`, and `web-types.json` are generated from source.
    -   Don’t hand-edit generated files; update the relevant source code and rerun builds instead.

If behavior seems “magical,” look for:

-   Custom elements metadata generation (`custom-elements-manifest` configs).
-   Scripts in `scripts/*.js` that stitch together docs, metadata, and CDN builds.

---

## How to Work with the Component Docs (Key Guidance)

When a user asks about a component:

-   **Step 1** – Locate its docs in `docs/pages/components/<name>.md`.
    -   Example: for `terra-map`, read `docs/pages/components/map.md`.
    -   Example: for `terra-time-average-map`, read `docs/pages/components/time-average-map.md`.
-   **Step 2** – Inspect its implementation in `src/components/<name>/**`.
-   **Step 3** – If the question involves usage in a framework (React/Vue/Angular), also read:
    -   `docs/pages/frameworks/react.md`
    -   `docs/pages/frameworks/vue*.md`
    -   `docs/pages/frameworks/angular.md`

When generating example code, **mirror the examples shown in those docs** (props/attributes, events, CSS variables, etc.) and avoid inventing undocumented attributes.

---

## Things to Remember as an AI Assistant

-   **Never invent public APIs** for components; always verify attributes, events, and slots in:
    -   The component’s docs (`docs/pages/components/*.md`)
    -   The component’s TypeScript source in `src/components/**`
    -   Generated metadata (`dist/custom-elements.json`) if necessary.
-   **Keep docs in sync** when changing behavior:
    -   If you add a new prop/attribute/event, update:
        -   The relevant component doc in `docs/pages/components/*.md`
        -   Examples in `_site/` if needed (via rebuild)
        -   Any cross-references in tutorials or framework docs.
-   **Prefer minimal, targeted edits** over large refactors unless the user asks for a redesign.
-   **Explain your reasoning briefly** when making substantial code changes, and point to the specific files you touched so the user can review.

If you’re ever uncertain, ask the human developer for clarification rather than guessing about user-facing behavior.
