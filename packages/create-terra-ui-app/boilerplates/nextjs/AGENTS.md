## Purpose

This file is instructions for AI coding assistants (like Claude, GPT, or Cursor Agents) **working in a Next.js app that was scaffolded from this Terra UI boilerplate**.

Your main goals:

-   **Help build out pages and features in this app using Terra UI React components.**
-   **Use Terra’s official docs and metadata instead of guessing component APIs.**

This app is a consumer of `@nasa-terra/components` — **do not try to edit Terra’s source here**, only how it’s used.

---

## Where to Read Terra UI Documentation (from this app)

This boilerplate **does not ship Terra’s markdown docs**, but you can still access all documentation and metadata:

-   **Docs website (primary source for end users)**
    -   Terra UI docs: `https://terra-ui.netlify.app`
    -   For component APIs (props, events, slots, CSS variables), use the **Components** section, for example:
        -   Map: `https://terra-ui.netlify.app/components/map/`
        -   Time-average map: `https://terra-ui.netlify.app/components/time-average-map/`
        -   Browse variables: `https://terra-ui.netlify.app/components/browse-variables/`
    -   For React usage patterns, see the **Frameworks → React** page:
        -   `https://terra-ui.netlify.app/frameworks/react/`
-   **GitHub source for docs**
    -   If you need raw markdown, use:
        -   `https://github.com/nasa/terra-ui-components/tree/main/docs/pages/components`
        -   `https://github.com/nasa/terra-ui-components/tree/main/docs/pages/frameworks`
-   **Metadata shipped in this app’s `node_modules`**
    -   `node_modules/@nasa-terra/components/dist/custom-elements.json`
    -   `node_modules/@nasa-terra/components/dist/web-types.json`
    -   These describe each component’s attributes, properties, events, and slots; use them as a source of truth when IDE support or docs are unclear.

When you need to know how a component works in this app, **start from the docs site**, then fall back to metadata files in `node_modules`.

---

## How Terra UI is Used in This Boilerplate

This project is a Next.js **Pages Router** app preconfigured with Terra UI:

-   **React wrappers (primary way you will use Terra here)**
    -   Components are imported from `@nasa-terra/components/dist/react/...`, for example:
        -   `@nasa-terra/components/dist/react/site-header/index.js`
        -   `@nasa-terra/components/dist/react/site-navigation/index.js`
        -   `@nasa-terra/components/dist/react/dropdown/index.js`
    -   See `components/Layout.tsx` for a concrete example of how Terra React components are wired into a layout.
-   **Layout example (copy patterns from here)**
    -   `components/Layout.tsx` shows:
        -   A `TerraSiteHeader` with **slot content** provided via `slot="right"` on a child `<div>`.
        -   A `TerraDropdown` using a `TerraButton` in its `slot="trigger"`.
        -   A `TerraMenu` and `TerraMenuItem` wrapping Next.js `Link` components.
        -   Use of **CSS custom properties** such as `var(--terra-spacing-small)` and `var(--terra-color-spacesuit-white)` for spacing and colors.
    -   When adding new UI, **mirror these patterns**:
        -   Import individual Terra React components from their respective `react/<component>` paths.
        -   Use `slot` props to place content into named slots, as documented for each component.
        -   Prefer Terra design tokens (CSS variables) over hard-coded values.

---

## Terra Components: Props, Events, Slots, and CSS Variables

When working in this app, **never invent APIs** for Terra components. Instead:

-   **Props / attributes**
    -   Treat React component props as a direct mapping of Terra component attributes/properties documented on the docs site.
    -   For each component you use, consult:
        -   The Terra docs component page for its **properties/attributes table**.
        -   `dist/custom-elements.json` or `web-types.json` for the exact property names and types.
-   **Events**
    -   Terra components emit custom events (e.g. `terra-input`).
    -   In React wrappers, these are exposed as camel-cased props, e.g. `onTerraInput`, as described in the React docs page.
    -   For any given component:
        -   Check its docs page under “Events”.
        -   Check the React docs at `https://terra-ui.netlify.app/frameworks/react/` for examples.
        -   If needed, inspect `@nasa-terra/components/dist/react/<component>/index.d.ts` in `node_modules` for event prop types like `TerraXxxEvent`.
-   **Slots**
    -   Many Terra components have named slots (e.g. `slot="right"`, `slot="trigger"` as shown in `Layout.tsx`).
    -   The docs site lists available slots per component.
    -   In React, set the `slot` attribute on child elements to place them in the correct slot.
-   **CSS variables / design tokens**
    -   Use Terra design tokens instead of arbitrary values:
        -   Spacing: `var(--terra-spacing-small)`, `var(--terra-spacing-large)`, etc.
        -   Colors: `var(--terra-color-...)`
        -   Typography, elevation, etc.
    -   The design token docs live at `https://terra-ui.netlify.app/tokens/`.

If a prop, event, or CSS variable you want isn’t documented, **assume it doesn’t exist** until you confirm it via the docs site or metadata files.

---

## Working With Pages and Layout in This App

For AI agents adding new features or pages:

-   **Use `components/Layout.tsx` as the base layout**
    -   Wrap new pages in the existing `Layout` so they share the header, navigation, and spacing.
    -   Extend the layout by adding new navigation items via `TerraMenuItem` in the header’s menu.
-   **Creating new pages**
    -   Follow standard Next.js Pages Router conventions (files under `pages/`).
    -   Use Terra React components for UI rather than raw HTML where appropriate.
    -   Keep routing concerns (`Link`, `router`, etc.) in Next.js and presentational concerns in Terra components.

---

## How to Ask an AI to Help in This App

When using an AI assistant with this boilerplate, prompt it to:

-   **Read this file (`AGENTS.md`) first** so it understands Terra UI’s role in the app.
-   **Consult the Terra docs site** for any Terra component it wants to use.
-   **Inspect `components/Layout.tsx`** and mirror its import and usage patterns when adding new pages or components.
-   **Avoid modifying files in `node_modules/@nasa-terra/components`**; this app should treat Terra UI as a dependency, not as source to edit.

If behavior seems unclear, the AI should:

-   Point you to the specific Terra docs pages it used.
-   Cite which props/events/slots it relied on from the docs or metadata.
-   Ask for clarification before making large structural or design changes.
