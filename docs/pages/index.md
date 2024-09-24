---
meta:
    title: 'Terra UI Components: A collection of web components for working with Earthdata services.'
    description: Hand-crafted Earthdata custom elements.
toc: false
---

<div class="splash">
<div class="splash-start">
  <div class="text-logo">Terra UI Components</div>

-   Works with all frameworks 🧩
-   Works with CDNs 🚛
-   Fully customizable with CSS 🎨
-   Includes a dark theme 🌛
-   Built with accessibility in mind ♿️
-   First-class [React support](/frameworks/react) ⚛️
-   Built-in localization 💬
-   Open source 😸

</div>
<div class="splash-end">
<img class="splash-image" src="/assets/images/undraw-content-team.svg" alt="Cartoon of people assembling components while standing on a giant laptop.">
</div>
</div>

## Quick Start

Add the following code to your page.

<!-- prettier-ignore -->
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/themes/horizon.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/terra-ui-components-autoloader.js"></script>
```

Now you have access to all of the Terra UI Components! Try adding a button:

```html:preview:expanded:no-codepen
<terra-button>Click me</terra-button>
```

:::tip
This will activate Terra UI Components experimental autoloader, which registers components on the fly as you use them. To learn more about it, or for other ways to install Terra UI Components, refer to the [installation instructions](getting-started/installation).
:::

## New to Web Components?

Thanks to the popularity of frameworks such as Angular, Vue, and React, component-driven development has become a part of our every day lives. Components help us encapsulate styles and behaviors into reusable building blocks. They make a lot of sense in terms of design, development, and testing.

Unfortunately, _framework-specific_ components fail us in a number of ways:

-   You can only use them in the framework they're designed for 🔒
-   Their lifespan is limited to that of the framework's ⏳
-   New frameworks/versions can lead to breaking changes, requiring substantial effort to update components 😭

Web components solve these problems. They're [supported by all modern browsers](https://caniuse.com/#feat=custom-elementsv1), they're framework-agnostic, and they're [part of the standard](https://developer.mozilla.org/en-US/docs/Web/Web_Components), so we know they'll be supported for many years to come.

This is the technology that Terra UI Components is built on.

## What Problem Does This Solve?

Terra UI Components provides a collection of professionally designed, highly customizable UI components built on a framework agnostic technology.

With Terra UI Components, you can:

-   Start building things faster (no need to roll your own code)
-   Build multiple apps with different frameworks that all share the same UI components
-   Fully customize components to match your existing designs
-   Incrementally adopt components as needed (no need to ditch your framework)
-   Upgrade or switch frameworks without rebuilding foundational components

## Browser Support

Terra UI Components is tested in the latest two versions of the following browsers.

<img src="/assets/images/chrome.png" alt="Chrome" width="64" height="64">
<img src="/assets/images/edge.png" alt="Edge" width="64" height="64">
<img src="/assets/images/firefox.png" alt="Firefox" width="64" height="64">
<img src="/assets/images/opera.png" alt="Opera" width="64" height="64">
<img src="/assets/images/safari.png" alt="Safari" width="64" height="64">

Critical bug fixes in earlier versions will be addressed based on their severity and impact.

If you need to support IE11 or pre-Chromium Edge, this library isn't for you. Although web components can (to some degree) be polyfilled for legacy browsers, supporting them is outside the scope of this project. If you're using Terra UI Components in such a browser, you're gonna have a bad time. ⛷
