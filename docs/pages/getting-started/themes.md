---
meta:
    title: Themes
    description: Everything you need to know about theming Terra UI Components.
---

# Themes

Terra UI Components includes the **Horizon theme**, which implements NASA's [Horizon Design System](https://website.nasa.gov/hds/). The Horizon theme includes both light and dark modes, with optional automatic dark mode detection based on system preferences. You can also create your own custom themes.

A theme is a stylesheet that uses CSS custom properties (design tokens) to define styling. To create a theme, you will need a decent understanding of CSS, including [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) and the [`::part` selector](https://developer.mozilla.org/en-US/docs/Web/CSS/::part).

## Horizon Theme

The Horizon theme is Terra UI's default theme and implements NASA's Horizon Design System. It includes:

-   Complete design token system (colors, typography, spacing, etc.)
-   Optional automatic dark mode support via `prefers-color-scheme` (requires `terra-prefers-color-scheme` class on body)
-   Manual theme control via CSS classes
-   Full component styling

### Installing the Horizon Theme

To use the Horizon theme, add the following to the `<head>` section of your page:

```html
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/themes/horizon.css"
/>
```

Or if you're using npm:

```html
<link
    rel="stylesheet"
    href="node_modules/@nasa-terra/components/%NPMDIR%/themes/horizon.css"
/>
```

### Dark Mode

The Horizon theme includes both light and dark modes in a single file. Dark mode can be enabled in two ways:

**Automatic dark mode (requires opt-in):**

To enable automatic dark mode based on system preference, add the `terra-prefers-color-scheme` class to the `<body>` element:

```html
<body class="terra-prefers-color-scheme">
    <!-- Dark mode activates automatically based on system preference -->
    ...
</body>
```

This allows your application to control whether system preference-based dark mode is enabled. Without this class, dark mode will not activate automatically, even if the user's system preference is set to dark mode.

**Force dark mode:**

```html
<html class="terra-theme-dark">
    <!-- Always use dark mode, regardless of system preference -->
    ...
</html>
```

**Force light mode:**

```html
<html class="terra-theme-horizon">
    <!-- Always use light mode, regardless of system preference -->
    ...
</html>
```

The class-based approach (`terra-theme-dark`) takes precedence over system preference, allowing you to give users control over the theme regardless of their system settings.

## Creating Custom Themes

You can create your own custom themes by extending the Horizon theme or building one from scratch. Custom themes should follow the `terra-theme-{name}` convention, where `{name}` is a lowercase, hyphen-delimited value.

All theme selectors must be scoped to the theme's class to ensure interoperability with other themes. You should also scope them to `:host` so they can be imported and applied to custom element shadow roots.

```css
:host,
.terra-theme-purple-power {
    /* Your custom theme styles */
}
```

### Customizing the Horizon Theme

The easiest way to create a custom theme is to extend the Horizon theme. Import the Horizon theme, then create a separate stylesheet that overrides [design tokens](/getting-started/customizing#design-tokens) and adds [component styles](/getting-started/customizing#component-parts) to your liking. You must import your custom theme _after_ the Horizon theme.

```html
<link rel="stylesheet" href="path/to/horizon.css" />
<link rel="stylesheet" href="path/to/my-custom-theme.css" />
```

If you're customizing the Horizon theme, scope your styles to the following selectors:

```css
:root,
:host,
.terra-theme-horizon {
    /* Your custom overrides */
    --terra-color-nasa-blue: #0066cc;
    /* ... */
}
```

For dark mode customizations, use:

```css
:host,
.terra-theme-dark {
    /* Your dark mode customizations */
}
```

By customizing the Horizon theme, you'll maintain a smaller stylesheet containing only the changes you've made. This approach is more "future-proof," as new design tokens that emerge in subsequent versions will be accounted for by the Horizon theme.

### Creating a New Theme from Scratch

Creating a new theme from scratch is more of an undertaking than customizing the Horizon theme. At a minimum, you must implement all of the required design tokens. The easiest way to do this is by "forking" the Horizon theme and modifying it.

Start by changing the selector to match your theme's name. Assuming your new theme is called "Purple Power", your theme should be scoped like this:

```css
:host,
.terra-theme-purple-power {
    /* Your custom styles here */
}
```

By creating a new theme, you won't be relying on the Horizon theme as a foundation. Because the theme is decoupled, you can activate it independently. This is the recommended approach if you're looking to open source your theme for others to use.

You will, however, need to maintain your theme more carefully, as new versions of Terra may introduce new design tokens that your theme won't have accounted for. Because of this, it's recommended that you clearly specify which version(s) of Terra your theme is designed to work with and keep it up to date as new versions are released.

### Activating Custom Themes

To activate a custom theme, import it and apply the theme's class to the `<html>` element:

```html
<html class="terra-theme-purple-power">
    <head>
        <link rel="stylesheet" href="path/to/purple-power.css" />
    </head>
    <body>
        ...
    </body>
</html>
```

### Using Multiple Themes

You can activate themes on various containers throughout the page. This example uses the Horizon theme with a custom-themed sidebar:

```html
<html>
    <head>
        <link rel="stylesheet" href="path/to/horizon.css" />
        <link rel="stylesheet" href="path/to/custom-sidebar.css" />
    </head>
    <body>
        <nav class="terra-theme-custom-sidebar">
            <!-- Custom-themed sidebar -->
        </nav>
        <!-- Horizon-themed content -->
    </body>
</html>
```

It's for this reason that themes must be scoped to specific classes.

:::tip
For component developers, the Horizon theme is also available as a JavaScript module that exports [Lit CSSResult](https://lit.dev/docs/api/styles/#CSSResult) objects. You can find it in `%NPMDIR%/themes/horizon.styles.js`.
:::

## Design Tokens

The Horizon theme provides a comprehensive set of design tokens that you can use and customize. These include:

-   **Colors**: NASA brand colors, neutrals, and semantic colors
-   **Typography**: Font families, sizes, weights, and line heights
-   **Spacing**: Consistent spacing scale
-   **Shadows**: Elevation tokens
-   **Border Radius**: Consistent border radius values
-   **Transitions**: Animation timing values
-   **Z-index**: Layering system

For a complete reference of all available design tokens, see the [Design Tokens](/tokens/typography) section.
