---
meta:
    title: 'Terra UI Components'
    description: A collection of web components for working with Earthdata services, built with NASA's Horizon Design System.
toc: false
---

<div class="splash">
<div class="splash-start">
  <div class="text-logo">Terra UI Components</div>

-   Framework agnostic 🧩
-   Horizon Design System compliant 🎨
-   Fully accessible ♿️
-   Dark mode support 🌛
-   TypeScript support 📘
-   Open source 😸

</div>
<div class="splash-end">
<img class="splash-image" src="/assets/images/undraw-content-team.svg" alt="Cartoon of people assembling components while standing on a giant laptop.">
</div>
</div>

## What is Terra UI?

Terra UI Components is a collection of reusable web components built on web standards and designed to work with NASA's [Horizon Design System](https://website.nasa.gov/hds/). These components are framework-agnostic and can be used with React, Vue, Angular, or vanilla JavaScript.

## Quick Start

Add the following code to your page:

<!-- prettier-ignore -->
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/themes/horizon.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/terra-ui-components-autoloader.js"></script>
```

Now you can use any Terra UI component:

```html:preview:expanded:no-codepen
<terra-button variant="primary">Click me</terra-button>
```

:::tip
This uses the autoloader, which registers components automatically. For other installation methods, see the [Installation Guide](/getting-started/installation).
:::

## Key Features

-   **Framework Agnostic**: Works with any modern framework or vanilla JavaScript
-   **Horizon Design System**: Built to match NASA's design standards
-   **Accessible**: WCAG compliant with full keyboard and screen reader support
-   **Customizable**: Fully customizable with CSS variables and design tokens
-   **Dark Mode**: Built-in dark theme support
-   **TypeScript**: Fully typed with TypeScript definitions

## Browser Support

Terra UI Components is tested in the latest two versions of Chrome, Edge, Firefox, Opera, and Safari.

<img src="/assets/images/chrome.png" alt="Chrome" width="64" height="64">
<img src="/assets/images/edge.png" alt="Edge" width="64" height="64">
<img src="/assets/images/firefox.png" alt="Firefox" width="64" height="64">
<img src="/assets/images/opera.png" alt="Opera" width="64" height="64">
<img src="/assets/images/safari.png" alt="Safari" width="64" height="64">

## Next Steps

-   [Installation Guide](/getting-started/installation) - Get started with Terra UI
-   [Components](/components/avatar) - Browse available components
-   [Design System](/horizon-design-system) - Learn about design tokens and theming
-   [Contributing](/about/contributing) - Contribute to the project
