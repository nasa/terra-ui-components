---
meta:
    title: HDS Chip
    description: Learn how to customize Terra chips using Horizon Design System CSS variables
---

# HDS Chip

The Terra Chip component is built on Horizon Design System (HDS) design tokens. This guide shows you how to customize chips using HDS CSS variables.

:::tip
**Use the Terra Chip Component**: We recommend using `<terra-chip>` for all chip needs. It provides consistent styling, dismiss functionality, and accessibility. This guide shows you how to customize it using HDS design tokens.
:::

## Using Terra Chip

Start with the Terra Chip component:

```html:preview
<terra-chip>Default Chip</terra-chip>
<terra-chip size="small">Small Chip</terra-chip>
<terra-chip size="large">Large Chip</terra-chip>
```

See the [full Chip component documentation](/components/chip) for all available props and features.

## Customizing with HDS CSS Variables

Terra chips use HDS design tokens for typography, spacing, colors, and border radius. Here are the key CSS variables:

### Chip Design Tokens

**Typography:**
- `--terra-font-family--inter`: Chip font family
- `--terra-font-size-small`: Default chip font size
- `--terra-font-weight-normal`: Chip font weight
- `--terra-line-height-denser`: Compact line height

**Colors:**
- `--terra-color-carbon-10`: Default background
- `--terra-color-carbon-80`: Default text color
- `--terra-color-nasa-blue`: Primary variant
- `--terra-color-nasa-red`: Danger variant
- `--terra-color-active-green`: Success variant
- `--terra-color-international-orange`: Warning variant
- `--terra-color-spacesuit-white`: Text on colored backgrounds

**Spacing:**
- `--terra-spacing-2x-small`: Vertical padding
- `--terra-spacing-small`: Horizontal padding
- `--terra-spacing-x-small`: Margins and gaps

**Border Radius:**
- `--terra-border-radius-large`: Rounded chip shape

**Transitions:**
- `--terra-transition-fast`: Hover state transitions

### Customizing Chip Colors

Override HDS color variables to create custom chip variants:

```html:preview
<terra-chip class="chip-primary">Primary</terra-chip>
<terra-chip class="chip-success">Success</terra-chip>
<terra-chip class="chip-warning">Warning</terra-chip>
<terra-chip class="chip-danger">Danger</terra-chip>

<style>
.chip-primary::part(base) {
    background-color: var(--terra-color-nasa-blue);
    color: var(--terra-color-spacesuit-white);
}

.chip-success::part(base) {
    background-color: var(--terra-color-active-green);
    color: var(--terra-color-spacesuit-white);
}

.chip-warning::part(base) {
    background-color: var(--terra-color-international-orange);
    color: var(--terra-color-spacesuit-white);
}

.chip-danger::part(base) {
    background-color: var(--terra-color-nasa-red);
    color: var(--terra-color-spacesuit-white);
}
</style>
```

### Customizing Chip Sizes

Adjust chip sizes using HDS spacing and typography variables:

```html:preview
<terra-chip class="chip-xs">Extra Small</terra-chip>
<terra-chip class="chip-sm">Small</terra-chip>
<terra-chip class="chip-md">Medium</terra-chip>
<terra-chip class="chip-lg">Large</terra-chip>

<style>
.chip-xs::part(base) {
    font-size: var(--terra-font-size-x-small);
    padding: var(--terra-spacing-3x-small) var(--terra-spacing-x-small);
}

.chip-sm::part(base) {
    font-size: var(--terra-font-size-small);
    padding: var(--terra-spacing-2x-small) var(--terra-spacing-small);
}

.chip-md::part(base) {
    font-size: var(--terra-font-size-medium);
    padding: var(--terra-spacing-x-small) var(--terra-spacing-medium);
}

.chip-lg::part(base) {
    font-size: var(--terra-font-size-large);
    padding: var(--terra-spacing-small) var(--terra-spacing-large);
}
</style>
```

### Customizing Chip Border Radius

Use HDS border radius variables:

```html:preview
<terra-chip class="chip-rounded">Rounded</terra-chip>
<terra-chip class="chip-pill">Pill</terra-chip>
<terra-chip class="chip-square">Square</terra-chip>

<style>
.chip-rounded::part(base) {
    border-radius: var(--terra-border-radius-large);
}

.chip-pill::part(base) {
    border-radius: var(--terra-border-radius-circle);
}

.chip-square::part(base) {
    border-radius: var(--terra-border-radius-small);
}
</style>
```

### Customizing Chip Typography

Adjust chip typography using HDS font variables:

```html:preview
<terra-chip class="chip-bold">Bold</terra-chip>
<terra-chip class="chip-uppercase">Uppercase</terra-chip>

<style>
.chip-bold::part(base) {
    font-weight: var(--terra-font-weight-bold);
}

.chip-uppercase::part(base) {
    text-transform: uppercase;
    letter-spacing: var(--terra-letter-spacing-loose);
    font-weight: var(--terra-font-weight-semibold);
}
</style>
```

### Outline Chips

Create outlined chips using HDS colors:

```html:preview
<terra-chip class="chip-outline">Outline</terra-chip>
<terra-chip class="chip-outline-primary">Primary Outline</terra-chip>
<terra-chip class="chip-outline-danger">Danger Outline</terra-chip>

<style>
.chip-outline::part(base) {
    background-color: transparent;
    border: 1px solid var(--terra-color-carbon-20);
    color: var(--terra-color-carbon-80);
}

.chip-outline-primary::part(base) {
    background-color: transparent;
    border: 1px solid var(--terra-color-nasa-blue);
    color: var(--terra-color-nasa-blue);
}

.chip-outline-primary::part(base):hover {
    background-color: var(--terra-color-nasa-blue);
    color: var(--terra-color-spacesuit-white);
}

.chip-outline-danger::part(base) {
    background-color: transparent;
    border: 1px solid var(--terra-color-nasa-red);
    color: var(--terra-color-nasa-red);
}

.chip-outline-danger::part(base):hover {
    background-color: var(--terra-color-nasa-red);
    color: var(--terra-color-spacesuit-white);
}
</style>
```

### Global Chip Customization

To customize all chips globally, override the CSS variables in your theme:

```css
:root,
.terra-theme-horizon {
    /* Customize default chip colors */
    --terra-color-carbon-10: /* your background color */;
    --terra-color-carbon-80: /* your text color */;
    
    /* Customize spacing */
    --terra-spacing-small: 0.875rem;
    
    /* Customize border radius */
    --terra-border-radius-large: 0.75rem;
}
```

## Using CSS Parts

For advanced customization, use CSS parts to target specific chip elements:

```html:preview
<terra-chip class="advanced-chip">
    Advanced Chip
</terra-chip>

<style>
.advanced-chip::part(base) {
    background: linear-gradient(
        135deg,
        var(--terra-color-nasa-blue),
        var(--terra-color-nasa-blue-shade)
    );
    color: var(--terra-color-spacesuit-white);
    box-shadow: var(--terra-shadow-small);
    transition: all var(--terra-transition-medium);
    border: none;
}

.advanced-chip::part(base):hover {
    transform: translateY(-2px);
    box-shadow: var(--terra-shadow-medium);
}

.advanced-chip::part(label) {
    font-weight: var(--terra-font-weight-semibold);
    letter-spacing: var(--terra-letter-spacing-dense);
}
</style>
```

## HDS Design Tokens Reference

**Typography:**
- Font family: `--terra-font-family--inter`
- Font sizes: `--terra-font-size-*`
- Font weights: `--terra-font-weight-*`
- Line height: `--terra-line-height-denser`

**Colors:**
- Default: `--terra-color-carbon-10` (background), `--terra-color-carbon-80` (text)
- Primary: `--terra-color-nasa-blue`
- Success: `--terra-color-active-green`
- Warning: `--terra-color-international-orange`
- Danger: `--terra-color-nasa-red`
- White: `--terra-color-spacesuit-white`

**Spacing:**
- Padding: `--terra-spacing-2x-small`, `--terra-spacing-small`
- Margins: `--terra-spacing-x-small`

**Border Radius:**
- Default: `--terra-border-radius-large`
- Options: `--terra-border-radius-*`, `--terra-border-radius-circle`

**Transitions:**
- Timing: `--terra-transition-fast`, `--terra-transition-medium`

**Shadows:**
- Elevation: `--terra-shadow-small`, `--terra-shadow-medium`

## Related

- [HDS Overview](/horizon-design-system) - Learn about all HDS design tokens
- [Chip Component](/components/chip) - Full Terra Chip component documentation
- [Customizing Components](/getting-started/customizing) - General customization guide
