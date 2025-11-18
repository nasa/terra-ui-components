---
meta:
    title: HDS Button
    description: Learn how to customize Terra buttons using Horizon Design System CSS variables
---

# HDS Button

The Terra Button component is built on Horizon Design System (HDS) design tokens. This guide shows you how to customize buttons using HDS CSS variables while using the Terra component.

:::tip
**Use the Terra Button Component**: We recommend using `<terra-button>` for all button needs. It provides accessibility, keyboard navigation, and consistent styling out of the box. This guide shows you how to customize it using HDS design tokens.
:::

## Using Terra Button

Start with the Terra Button component:

```html:preview
<terra-button variant="primary">Primary Button</terra-button>
<terra-button variant="danger">Danger Button</terra-button>
<terra-button outline>Outline Button</terra-button>
```

See the [full Button component documentation](/components/button) for all available props and features.

## Customizing with HDS CSS Variables

Terra buttons use HDS design tokens that you can customize. Here are the key CSS variables used by buttons:

### Button Design Tokens

**Colors:**
- `--terra-color-nasa-blue`: Primary button background
- `--terra-color-nasa-blue-shade`: Primary button hover state
- `--terra-color-nasa-red`: Danger button background
- `--terra-color-nasa-red-shade`: Danger button hover state
- `--terra-color-spacesuit-white`: Button text color on colored backgrounds
- `--terra-button-outline-text-color`: Outline button text color
- `--terra-button-text-text-color`: Text button text color

**Typography:**
- `--terra-button-font-size-small`: Small button font size
- `--terra-button-font-size-medium`: Medium button font size
- `--terra-button-font-size-large`: Large button font size
- `--terra-font-family--inter`: Button font family

**Sizing:**
- `--terra-button-height-small`: 1.875rem (30px)
- `--terra-button-height-medium`: 2.25rem (36px)
- `--terra-button-height-large`: 3rem (48px)
- `--terra-button-border-width`: 1px

**Other:**
- `--terra-border-radius-medium`: Button border radius
- `--terra-transition-medium`: Button transition timing
- `--terra-focus-ring`: Focus ring for accessibility

### Customizing Button Colors

Override HDS color variables to customize button appearance:

```html:preview
<terra-button variant="primary" class="custom-primary">Custom Primary</terra-button>
<terra-button variant="danger" class="custom-danger">Custom Danger</terra-button>

<style>
.custom-primary::part(base) {
    background-color: var(--terra-color-international-orange);
    border-color: var(--terra-color-international-orange);
}

.custom-primary::part(base):hover {
    background-color: var(--terra-color-international-orange-shade);
    border-color: var(--terra-color-international-orange-shade);
}

.custom-danger::part(base) {
    background-color: var(--terra-color-active-green);
    border-color: var(--terra-color-active-green);
}

.custom-danger::part(base):hover {
    background-color: var(--terra-color-active-green-shade);
    border-color: var(--terra-color-active-green-shade);
}
</style>
```

### Customizing Button Sizes

Adjust button sizes using HDS spacing variables:

```html:preview
<terra-button class="custom-small">Custom Small</terra-button>
<terra-button class="custom-large">Custom Large</terra-button>

<style>
.custom-small::part(base) {
    height: var(--terra-button-height-small);
    padding: 0 var(--terra-spacing-small);
    font-size: var(--terra-button-font-size-small);
}

.custom-large::part(base) {
    height: var(--terra-button-height-large);
    padding: 0 var(--terra-spacing-large);
    font-size: var(--terra-button-font-size-large);
}
</style>
```

### Customizing Button Border Radius

Use HDS border radius variables:

```html:preview
<terra-button class="rounded">Rounded</terra-button>
<terra-button class="square">Square</terra-button>

<style>
.rounded::part(base) {
    border-radius: var(--terra-border-radius-x-large);
}

.square::part(base) {
    border-radius: var(--terra-border-radius-small);
}
</style>
```

### Customizing Button Typography

Adjust button typography using HDS font variables:

```html:preview
<terra-button class="custom-font">Custom Font</terra-button>

<style>
.custom-font::part(base) {
    font-family: var(--terra-font-family--public-sans);
    font-weight: var(--terra-font-weight-bold);
    letter-spacing: var(--terra-letter-spacing-loose);
}
</style>
```

### Global Button Customization

To customize all buttons globally, override the CSS variables in your theme:

```css
:root,
.terra-theme-horizon {
    /* Customize primary button color */
    --terra-color-nasa-blue: #0066cc;
    --terra-color-nasa-blue-shade: #0052a3;
    
    /* Customize button sizes */
    --terra-button-height-medium: 2.5rem;
    --terra-button-font-size-medium: var(--terra-font-size-large);
    
    /* Customize border radius */
    --terra-border-radius-medium: 0.5rem;
}
```

## Using CSS Parts

For more advanced customization, use CSS parts to target specific button elements:

```html:preview
<terra-button class="custom-button">
    <span slot="prefix">🚀</span>
    Launch
</terra-button>

<style>
.custom-button::part(base) {
    background: linear-gradient(
        135deg,
        var(--terra-color-nasa-blue),
        var(--terra-color-nasa-blue-shade)
    );
    box-shadow: var(--terra-shadow-medium);
    transition: all var(--terra-transition-medium);
}

.custom-button::part(base):hover {
    transform: translateY(-2px);
    box-shadow: var(--terra-shadow-large);
}

.custom-button::part(base):active {
    transform: translateY(0);
}

.custom-button::part(label) {
    font-weight: var(--terra-font-weight-bold);
    text-transform: uppercase;
    letter-spacing: var(--terra-letter-spacing-loose);
}
</style>
```

## HDS Design Tokens Reference

All Terra buttons use these HDS design tokens:

**Colors:**
- Primary: `--terra-color-nasa-blue`, `--terra-color-nasa-blue-shade`
- Danger: `--terra-color-nasa-red`, `--terra-color-nasa-red-shade`
- Success: `--terra-color-active-green`, `--terra-color-active-green-shade`
- Warning: `--terra-color-international-orange`, `--terra-color-international-orange-shade`

**Typography:**
- Font family: `--terra-font-family--inter`
- Font sizes: `--terra-button-font-size-*`
- Font weights: `--terra-font-weight-*`

**Spacing:**
- Heights: `--terra-button-height-*`
- Padding: Use `--terra-spacing-*` variables

**Borders:**
- Width: `--terra-button-border-width`
- Radius: `--terra-border-radius-*`

**Transitions:**
- Timing: `--terra-transition-*`

**Focus:**
- Ring: `--terra-focus-ring`, `--terra-focus-ring-offset`

## Related

- [HDS Overview](/horizon-design-system) - Learn about all HDS design tokens
- [Button Component](/components/button) - Full Terra Button component documentation
- [Customizing Components](/getting-started/customizing) - General customization guide
