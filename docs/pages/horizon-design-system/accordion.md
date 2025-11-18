---
meta:
    title: HDS Accordion
    description: Learn how to customize Terra accordions using Horizon Design System CSS variables
---

# HDS Accordion

The Terra Accordion component is built on Horizon Design System (HDS) design tokens. This guide shows you how to customize accordions using HDS CSS variables.

:::tip
**Use the Terra Accordion Component**: We recommend using `<terra-accordion>` for all accordion needs. It provides accessibility, keyboard navigation, and smooth animations. This guide shows you how to customize it using HDS design tokens.
:::

## Using Terra Accordion

Start with the Terra Accordion component:

```html:preview
<terra-accordion summary="What is Horizon Design System?">
    Horizon Design System (HDS) is NASA's design system for building consistent, accessible web applications. It provides design tokens, components, and guidelines for creating NASA-branded interfaces.
</terra-accordion>
```

See the [full Accordion component documentation](/components/accordion) for all available props and features.

## Customizing with HDS CSS Variables

Terra accordions use HDS design tokens for typography, spacing, and colors. Here are the key CSS variables:

### Accordion Design Tokens

**Typography:**
- `--terra-font-family--inter`: Summary font family
- `--terra-font-family--public-sans`: Content font family
- `--terra-font-size-large`: Summary font size
- `--terra-font-size-medium`: Content font size
- `--terra-font-weight-bold`: Summary font weight
- `--terra-line-height-normal`: Content line height

**Colors:**
- `--terra-color-carbon-90`: Summary text color
- `--terra-color-carbon-70`: Content text color
- `--terra-color-carbon-50`: Icon/chevron color
- `--terra-color-carbon-20`: Border color
- `--terra-color-nasa-blue`: Hover state

**Spacing:**
- `--terra-spacing-medium`: Vertical padding
- `--terra-spacing-small`: Icon margin
- `--terra-spacing-x-small`: Small gaps

**Borders:**
- `--terra-color-carbon-20`: Border color for dividers

**Transitions:**
- `--terra-transition-medium`: Smooth animation for expand/collapse

**Focus:**
- `--terra-focus-ring`: Accessible focus indicator
- `--terra-focus-ring-offset`: Focus ring spacing

### Customizing Accordion Typography

Adjust typography using HDS font variables:

```html:preview
<terra-accordion summary="Custom Typography" class="custom-typography">
    This accordion uses custom HDS typography tokens for both the summary and content.
</terra-accordion>

<style>
.custom-typography::part(summary) {
    font-family: var(--terra-font-family--public-sans);
    font-size: var(--terra-font-size-x-large);
    font-weight: var(--terra-font-weight-semibold);
    color: var(--terra-color-nasa-blue);
}

.custom-typography::part(content) {
    font-family: var(--terra-font-family--inter);
    font-size: var(--terra-font-size-small);
    line-height: var(--terra-line-height-loose);
    color: var(--terra-color-carbon-80);
}
</style>
```

### Customizing Accordion Colors

Override HDS color variables:

```html:preview
<terra-accordion summary="Custom Colors" class="custom-colors">
    This accordion uses custom HDS colors for a different visual style.
</terra-accordion>

<style>
.custom-colors::part(summary) {
    color: var(--terra-color-nasa-red);
    border-color: var(--terra-color-nasa-red);
}

.custom-colors::part(summary):hover {
    color: var(--terra-color-nasa-red-shade);
}

.custom-colors::part(content) {
    color: var(--terra-color-carbon-80);
    background-color: var(--terra-color-carbon-5);
    padding: var(--terra-spacing-medium);
    border-radius: var(--terra-border-radius-medium);
}
</style>
```

### Customizing Accordion Spacing

Adjust spacing using HDS spacing variables:

```html:preview
<terra-accordion summary="Custom Spacing" class="custom-spacing">
    This accordion uses custom HDS spacing for more generous padding.
</terra-accordion>

<style>
.custom-spacing::part(summary) {
    padding: var(--terra-spacing-large) var(--terra-spacing-medium);
}

.custom-spacing::part(content) {
    padding: var(--terra-spacing-large);
    margin-top: var(--terra-spacing-small);
}
</style>
```

### Customizing Accordion Borders

Use HDS border and color variables:

```html:preview
<terra-accordion summary="Custom Borders" class="custom-borders">
    This accordion uses custom border styling with HDS design tokens.
</terra-accordion>

<style>
.custom-borders::part(base) {
    border: 2px solid var(--terra-color-nasa-blue);
    border-radius: var(--terra-border-radius-large);
    padding: var(--terra-spacing-small);
}

.custom-borders::part(summary) {
    border-bottom: 1px solid var(--terra-color-carbon-20);
    padding-bottom: var(--terra-spacing-small);
}
</style>
```

### Global Accordion Customization

To customize all accordions globally, override the CSS variables in your theme:

```css
:root,
.terra-theme-horizon {
    /* Customize accordion typography */
    /* Note: Accordion typography is controlled via CSS parts */
    
    /* Customize colors used by accordions */
    --terra-color-carbon-90: /* your color */;
    --terra-color-carbon-70: /* your color */;
    --terra-color-carbon-20: /* your color */;
    
    /* Customize spacing */
    --terra-spacing-medium: 1.5rem;
}
```

## Using CSS Parts

For advanced customization, use CSS parts to target specific accordion elements:

```html:preview
<terra-accordion summary="Advanced Customization" class="advanced-accordion">
    This accordion demonstrates advanced customization using CSS parts and HDS design tokens.
</terra-accordion>

<style>
.advanced-accordion::part(base) {
    background-color: var(--terra-color-carbon-5);
    border-radius: var(--terra-border-radius-large);
    padding: var(--terra-spacing-medium);
    box-shadow: var(--terra-shadow-small);
    transition: box-shadow var(--terra-transition-medium);
}

.advanced-accordion[open]::part(base) {
    box-shadow: var(--terra-shadow-medium);
}

.advanced-accordion::part(summary) {
    font-size: var(--terra-font-size-x-large);
    font-weight: var(--terra-font-weight-bold);
    color: var(--terra-color-nasa-blue);
    padding: var(--terra-spacing-medium) 0;
    transition: color var(--terra-transition-medium);
}

.advanced-accordion::part(summary):hover {
    color: var(--terra-color-nasa-blue-shade);
}

.advanced-accordion::part(content) {
    padding: var(--terra-spacing-medium) 0;
    color: var(--terra-color-carbon-70);
    line-height: var(--terra-line-height-normal);
}
</style>
```

## HDS Design Tokens Reference

**Typography:**
- Summary: `--terra-font-family--inter`, `--terra-font-size-large`, `--terra-font-weight-bold`
- Content: `--terra-font-family--public-sans`, `--terra-font-size-medium`, `--terra-line-height-normal`

**Colors:**
- Summary text: `--terra-color-carbon-90`
- Content text: `--terra-color-carbon-70`
- Borders: `--terra-color-carbon-20`
- Hover: `--terra-color-nasa-blue`

**Spacing:**
- Padding: `--terra-spacing-medium`, `--terra-spacing-large`
- Gaps: `--terra-spacing-small`, `--terra-spacing-x-small`

**Borders:**
- Color: `--terra-color-carbon-20`
- Radius: `--terra-border-radius-*`

**Transitions:**
- Timing: `--terra-transition-medium`

**Focus:**
- Ring: `--terra-focus-ring`, `--terra-focus-ring-offset`

## Related

- [HDS Overview](/horizon-design-system) - Learn about all HDS design tokens
- [Accordion Component](/components/accordion) - Full Terra Accordion component documentation
- [Customizing Components](/getting-started/customizing) - General customization guide
