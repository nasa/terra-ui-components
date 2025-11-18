---
meta:
    title: Horizon Design System Overview
    description: Learn how to use Horizon Design System (HDS) CSS variables and themes in your applications
---

# Horizon Design System Overview

The [Horizon Design System (HDS)](https://website.nasa.gov/hds/) is NASA's design system for building consistent, accessible web applications. Terra UI Components includes the HDS theme (`horizon.css`) which provides a comprehensive set of CSS variables that you can use directly in your applications, even if you're not using Terra web components.

This section shows you how to use HDS design tokens, CSS variables, and themes to style your applications with NASA's design system.

## What is Horizon Design System?

Horizon Design System is NASA's official design system that provides:

- **Design Tokens**: Colors, typography, spacing, and other design values
- **Components**: Reusable UI components following NASA design guidelines
- **Accessibility**: Built-in accessibility standards and best practices
- **Consistency**: Ensures visual and functional consistency across NASA applications

## Using the Horizon Theme

The `horizon.css` theme file contains all the HDS design tokens as CSS custom properties (CSS variables). You can import and use these variables in your own CSS, regardless of whether you're using Terra web components.

### Installation

To use the Horizon theme, import the CSS file in your HTML:

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

The theme is automatically applied to `:root`, so all CSS variables are available globally once imported.

### Dark Mode

For dark mode support, also import the dark theme:

```html
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@nasa-terra/components@%VERSION%/%CDNDIR%/themes/horizon-dark.css"
/>
```

Then apply the `terra-theme-dark` class to activate dark mode:

```html
<html class="terra-theme-dark">
    ...
</html>
```

## CSS Variables Overview

The Horizon theme provides CSS variables organized into several categories:

### Colors

HDS uses a restricted color palette focused on NASA's brand colors:

**Primary Palette:**
- `--terra-color-carbon-black`: Pure black
- `--terra-color-spacesuit-white`: Pure white
- `--terra-color-nasa-red`: NASA red (#F64137)
- `--terra-color-nasa-blue`: NASA blue (#1C67E3)

**Extended Palette:**
- Tints and shades of the primary colors for accessibility
- `--terra-color-nasa-red-tint` / `--terra-color-nasa-red-shade`
- `--terra-color-nasa-blue-tint` / `--terra-color-nasa-blue-shade`

**Neutrals:**
- Carbon scale from `--terra-color-carbon-5` (lightest) to `--terra-color-carbon-90` (darkest)
- Used for text, backgrounds, and subtle UI elements

**Additional Colors:**
- `--terra-color-international-orange`: Used sparingly for emphasis
- `--terra-color-active-green`: Used for success states

### Typography

HDS provides three font families:

- `--terra-font-family--inter`: Primary sans-serif font
- `--terra-font-family--public-sans`: Secondary sans-serif font
- `--terra-font-family--dm-mono`: Monospace font for code

**Font Sizes:**
- From `--terra-font-size-2x-small` (10px) to `--terra-font-size-4x-large` (72px)

**Font Weights:**
- `--terra-font-weight-light`: 300
- `--terra-font-weight-normal`: 400
- `--terra-font-weight-semibold`: 600
- `--terra-font-weight-bold`: 700

**Line Heights:**
- `--terra-line-height-denser`: 1
- `--terra-line-height-dense`: 1.4
- `--terra-line-height-normal`: 1.8
- `--terra-line-height-loose`: 2.2
- `--terra-line-height-looser`: 2.6

### Spacing

Consistent spacing scale:

- `--terra-spacing-3x-small`: 2px
- `--terra-spacing-2x-small`: 4px
- `--terra-spacing-x-small`: 8px
- `--terra-spacing-small`: 12px
- `--terra-spacing-medium`: 16px
- `--terra-spacing-large`: 20px
- `--terra-spacing-x-large`: 28px
- `--terra-spacing-2x-large`: 36px
- `--terra-spacing-3x-large`: 48px
- `--terra-spacing-4x-large`: 72px

### Border Radius

- `--terra-border-radius-small`: 2px
- `--terra-border-radius-medium`: 4px
- `--terra-border-radius-large`: 8px
- `--terra-border-radius-x-large`: 16px
- `--terra-border-radius-circle`: 50%

### Shadows

Elevation system using shadows:

- `--terra-shadow-x-small`: Subtle shadow
- `--terra-shadow-small`: Small shadow
- `--terra-shadow-medium`: Medium shadow
- `--terra-shadow-large`: Large shadow
- `--terra-shadow-x-large`: Extra large shadow

### Transitions

Timing functions for animations:

- `--terra-transition-x-fast`: 50ms
- `--terra-transition-fast`: 150ms
- `--terra-transition-medium`: 250ms
- `--terra-transition-slow`: 500ms
- `--terra-transition-x-slow`: 1000ms

## Using CSS Variables in Your Code

Once you've imported the Horizon theme, you can use any of these CSS variables in your own stylesheets:

```css
.my-button {
    background-color: var(--terra-color-nasa-blue);
    color: var(--terra-color-spacesuit-white);
    padding: var(--terra-spacing-small) var(--terra-spacing-medium);
    border-radius: var(--terra-border-radius-medium);
    font-family: var(--terra-font-family--inter);
    font-size: var(--terra-font-size-medium);
    transition: background-color var(--terra-transition-medium);
}

.my-button:hover {
    background-color: var(--terra-color-nasa-blue-shade);
}
```

```html
<button class="my-button">Click Me</button>
```

## Extending the Horizon Theme

You can extend the Horizon theme by creating your own stylesheet that overrides or adds to the existing variables. This is useful when you need custom colors or spacing that aren't in the base theme.

### Overriding Variables

To override existing variables, create a new stylesheet and scope it to the same selectors as the Horizon theme:

```css
:root,
:host,
.terra-theme-horizon {
    /* Override existing variables */
    --terra-color-nasa-blue: #0066cc;
    
    /* Add new custom variables */
    --my-custom-color: #ff9900;
    --my-custom-spacing: 2.5rem;
}
```

Make sure to import your custom stylesheet **after** the Horizon theme:

```html
<link
    rel="stylesheet"
    href="path/to/horizon.css"
/>
<link
    rel="stylesheet"
    href="path/to/my-custom-theme.css"
/>
```

### Creating Theme Variants

You can create entirely new theme variants by scoping your variables to a custom class:

```css
:host,
.terra-theme-custom {
    /* Your custom theme variables */
    --terra-color-primary: #8b5cf6;
    --terra-color-secondary: #ec4899;
    /* ... */
}
```

Then apply the theme class to activate it:

```html
<html class="terra-theme-custom">
    ...
</html>
```

## Best Practices

1. **Use Design Tokens**: Always use CSS variables instead of hardcoded values to maintain consistency and enable theming.

2. **Respect the Color Palette**: Stick to the HDS color palette for brand consistency. Use neutrals for text and backgrounds.

3. **Accessibility**: HDS colors are tested for accessibility. When creating custom colors, ensure they meet WCAG AA contrast requirements.

4. **Typography Hierarchy**: Use the provided font sizes and weights to create clear visual hierarchy.

5. **Consistent Spacing**: Use the spacing scale for margins, padding, and gaps to maintain visual rhythm.

## Next Steps

- Learn about [HDS Buttons](/horizon-design-system/button)
- Explore [HDS Icons](/horizon-design-system/icon)
- Check out [HDS Accordions](/horizon-design-system/accordion)
- See [HDS Chips](/horizon-design-system/chip)

For more information about Horizon Design System, visit the [official HDS website](https://website.nasa.gov/hds/).


