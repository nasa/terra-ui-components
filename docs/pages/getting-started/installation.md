---
meta:
    title: Installation
    description: Choose the installation method that works best for you.
---

# Installation

You can load Terra via CDN or by installing it locally. If you're using a framework, make sure to check out the pages for [React](/frameworks/react), [Vue](/frameworks/vue), and [Angular](/frameworks/angular) for additional information.

## CDN Installation (Easiest)

<terra-tabs>
<terra-tab slot="nav" panel="autoloader" active>Autoloader</terra-tab>
<terra-tab slot="nav" panel="traditional">Traditional Loader</terra-tab>

<terra-tab-panel name="autoloader">

The experimental autoloader is the easiest and most efficient way to use Terra. A lightweight script watches the DOM for unregistered Terra elements and lazy loads them for you — even if they're added dynamically.

While convenient, autoloading may lead to a [Flash of Undefined Custom Elements](https://www.abeautifulsite.net/posts/flash-of-undefined-custom-elements/). The linked article describes some ways to alleviate it.

<!-- prettier-ignore -->
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/themes/horizon.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/terra-ui-components-autoloader.js"></script>
```

</terra-tab-panel>

<terra-tab-panel name="traditional">

The traditional CDN loader registers all Terra elements up front. Note that, if you're only using a handful of components, it will be much more efficient to stick with the autoloader. However, you can also [cherry pick](#cherry-picking) components if you want to load specific ones up front.

<!-- prettier-ignore -->
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/themes/horizon.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/terra-ui-components-autoloader.js" ></script>
```

</terra-tab-panel>
</terra-tabs>

### Dark Mode

The Horizon theme includes both light and dark modes. Dark mode can be enabled automatically based on system preference by adding the `terra-prefers-color-scheme` class to the `<body>` element, or you can manually control it with the `terra-theme-dark` class. For more details, see the [Themes documentation](/getting-started/themes#dark-mode).

Now you can [start using Terra!](/getting-started/usage)

## npm installation

If you don't want to use the CDN, you can install Terra from npm with the following command.

```bash
npm install @nasa-terra/components
```

It's up to you to make the source files available to your app. One way to do this is to create a route in your app called `/terra-ui-components` that serves static files from `node_modules/@nasa-terra/components`.

Once you've done that, add the following tags to your page. Make sure to update `href` and `src` so they point to the route you created.

```html
<link rel="stylesheet" href="/terra-ui-components/%NPMDIR%/themes/horizon.css" />
<script
    type="module"
    src="/terra-ui-components/%NPMDIR%/terra-ui-components.js"
></script>
```

Alternatively, [you can use a bundler](#bundling).

:::tip
For clarity, the docs will usually show imports from `@nasa-terra/components`. If you're not using a module resolver or bundler, you'll need to adjust these paths to point to the folder Terra is in.
:::

## Setting the Base Path

Some components rely on assets (icons, images, etc.) and Terra needs to know where they're located. For convenience, Terra will try to auto-detect the correct location based on the script you've loaded it from. This assumes assets are colocated with `terra-ui-components.js` or `terra-ui-components-autoloader.js` and will "just work" for most users.

However, if you're [cherry picking](#cherry-picking) or [bundling](#bundling) Terra, you'll need to set the base path. You can do this one of two ways.

```html
<!-- Option 1: the data-terra-ui-components attribute -->
<script
    src="bundle.js"
    data-terra-ui-components="/path/to/terra-ui-components/%NPMDIR%"
></script>

<!-- Option 2: the setBasePath() method -->
<script src="bundle.js"></script>
<script type="module">
    import { setBasePath } from '@nasa-terra/components/%NPMDIR%/utilities/base-path.js'
    setBasePath('/path/to/terra-ui-components/%NPMDIR%')
</script>
```

:::tip
An easy way to make sure the base path is configured properly is to check if [icons](/components/icon) are loading.
:::

### Referencing Assets

Most of the magic behind assets is handled internally by Terra, but if you need to reference the base path for any reason, the same module exports a function called `getBasePath()`. An optional string argument can be passed, allowing you to get the full path to any asset.

```html
<script type="module">
    import {
        getBasePath,
        setBasePath,
    } from '@nasa-terra/components/%NPMDIR%/utilities/base-path.js'

    setBasePath('/path/to/assets')

    // ...

    // Get the base path, e.g. /path/to/assets
    const basePath = getBasePath()

    // Get the path to an asset, e.g. /path/to/assets/file.ext
    const assetPath = getBasePath('file.ext')
</script>
```

## Cherry Picking

Cherry picking can be done from [the CDN](#cdn-installation-easiest) or from [npm](#npm-installation). This approach will load only the components you need up front, while limiting the number of files the browser has to download. The disadvantage is that you need to import each individual component.

Here's an example that loads only the button component. Again, if you're not using a module resolver, you'll need to adjust the path to point to the folder Terra is in.

```html
<link
    rel="stylesheet"
    href="/path/to/terra-ui-components/%NPMDIR%/themes/horizon.css"
/>

<script
    type="module"
    data-terra-ui-components="/path/to/terra-ui-components/%NPMDIR%"
>
    import '@nasa-terra/components/%NPMDIR%/components/button/button.js'

    // <terra-button> is ready to use!
</script>
```

You can copy and paste the code to import a component from the "Importing" section of the component's documentation. Note that some components have dependencies that are automatically imported when you cherry pick. If a component has dependencies, they will be listed in the "Dependencies" section of its docs.

:::warning
Never cherry pick components or utilities from `terra-ui-components.js` as this will cause the browser to load the entire library. Instead, cherry pick from specific modules as shown above.
:::

:::warning
You will see files named `chunk.[hash].js` in the `chunks` directory. Never import these files directly, as they are generated and change from version to version.
:::

## Bundling

Terra is distributed as a collection of standard ES modules that [all modern browsers can understand](https://caniuse.com/es6-module). However, importing a lot of modules can result in a lot of HTTP requests and potentially longer load times. Using a CDN can alleviate this, but some users may wish to further optimize their imports with a bundler.

To use Terra with a bundler, first install Terra along with your bundler of choice.

```bash
npm install @nasa-terra/components
```

Now it's time to configure your bundler. Configurations vary for each tool, but here are some examples to help you get started.

-   EXAMPLES TBD. Please open an issue if needed

Once your bundler is configured, you'll be able to import Terra components and utilities.

import '@nasa-terra/components/%NPMDIR%/themes/horizon.css'
import '@nasa-terra/components/%NPMDIR%/components/button/button.js'
import '@nasa-terra/components/%NPMDIR%/components/icon/icon.js'
import '@nasa-terra/components/%NPMDIR%/components/input/input.js'
import '@nasa-terra/components/%NPMDIR%/components/rating/rating.js'
import { setBasePath } from '@nasa-terra/components/%NPMDIR%/utilities/base-path.js'

// Set the base path to the folder you copied Terra's assets to
setBasePath('/path/to/terra-ui-components/%NPMDIR%')

// <terra-button>, <terra-icon>, and <terra-input> are ready to use!

````

:::warning
Component modules include side effects for registration purposes. Because of this, importing directly from `@nasa-terra/components` may result in a larger bundle size than necessary. For optimal tree shaking, always cherry pick, i.e. import components and utilities from their respective files, as shown above.
:::

### Avoiding auto-registering imports

By default, imports to components will auto-register themselves. This may not be ideal in all cases. To import just the component's class without auto-registering it's tag we can do the following:

```diff
- import TerraButton from '@nasa-terra/components/%NPMDIR%/components/button/button.js';
+ import TerraButton from '@nasa-terra/components/%NPMDIR%/components/button/button.component.js';
````

Notice how the import ends with `.component.js`. This is the current convention to convey the import does not register itself.

:::danger
While you can override the class or re-register the terra-ui-components class under a different tag name, if you do so, many components won’t work as expected.
:::

## The difference between CDN and npm

You'll notice that the CDN links all start with `/%CDNDIR%/<path>` and npm imports use `/%NPMDIR%/<path>`. The `/%CDNDIR%` files are bundled separately from the `/%NPMDIR%` files. The `/%CDNDIR%` files come pre-bundled, which means all dependencies are inlined so you do not need to worry about loading additional libraries. The `/%NPMDIR%` files **DO NOT** come pre-bundled, allowing your bundler of choice to more efficiently deduplicate dependencies, resulting in smaller bundles and optimal code sharing.

TL;DR:

-   `@nasa-terra/components/%CDNDIR%` is for CDN users
-   `@nasa-terra/components/%NPMDIR%` is for npm users

This change was introduced in `v2.5.0` to address issues around installations from npm loading multiple versions of libraries (such as the Lit) that Terra uses internally.
