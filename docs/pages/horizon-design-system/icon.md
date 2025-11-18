---
meta:
    title: HDS Icon
    description: Learn how to customize Terra icons using Horizon Design System CSS variables
---

# HDS Icon

The Terra Icon component includes HDS icons and uses Horizon Design System (HDS) design tokens. This guide shows you how to customize icons using HDS CSS variables.

:::tip
**Use the Terra Icon Component**: We recommend using `<terra-icon>` for all icon needs. It includes HDS icons and provides consistent sizing and styling. This guide shows you how to customize it using HDS design tokens.
:::

## Using Terra Icon

Start with the Terra Icon component:

```html:preview
<terra-icon name="nasa-logo"></terra-icon>
<terra-icon name="caret"></terra-icon>
<terra-icon name="chevron-left-circle"></terra-icon>
<terra-icon name="asteroid"></terra-icon>
```

The default library contains HDS icons from the [official Horizon Design System iconography](https://website.nasa.gov/hds/foundations/iconography/).

See the [full Icon component documentation](/components/icon) for all available props, icon libraries, and features.

## Customizing with HDS CSS Variables

Terra icons use HDS design tokens for sizing and colors. Here are the key CSS variables:

### Icon Design Tokens

**Sizes:**
- `--terra-icon-small`: 1.2rem (19px)
- `--terra-icon-medium`: 1.75rem (28px)
- `--terra-icon-large`: 2.2rem (35px)
- `--terra-icon-x-large`: 3rem (48px)

**Colors:**
Icons inherit color from their parent element. Use HDS color variables:
- `--terra-color-nasa-blue`: Primary icon color
- `--terra-color-nasa-red`: Danger/warning icon color
- `--terra-color-carbon-50`: Default icon color
- `--terra-color-carbon-80`: Darker icon color

### Customizing Icon Sizes

Use HDS icon size variables:

```html:preview
<terra-icon name="nasa-logo" style="font-size: var(--terra-icon-small);"></terra-icon>
<terra-icon name="nasa-logo" style="font-size: var(--terra-icon-medium);"></terra-icon>
<terra-icon name="nasa-logo" style="font-size: var(--terra-icon-large);"></terra-icon>
<terra-icon name="nasa-logo" style="font-size: var(--terra-icon-x-large);"></terra-icon>
```

Or create custom size classes:

```html:preview
<terra-icon name="nasa-logo" class="icon-small"></terra-icon>
<terra-icon name="nasa-logo" class="icon-large"></terra-icon>

<style>
.icon-small {
    font-size: var(--terra-icon-small);
}

.icon-large {
    font-size: var(--terra-icon-large);
}
</style>
```

### Customizing Icon Colors

Set icon colors using HDS color variables:

```html:preview
<terra-icon name="nasa-logo" class="icon-primary"></terra-icon>
<terra-icon name="nasa-logo" class="icon-danger"></terra-icon>
<terra-icon name="nasa-logo" class="icon-success"></terra-icon>

<style>
.icon-primary {
    color: var(--terra-color-nasa-blue);
    font-size: var(--terra-icon-medium);
}

.icon-danger {
    color: var(--terra-color-nasa-red);
    font-size: var(--terra-icon-medium);
}

.icon-success {
    color: var(--terra-color-active-green);
    font-size: var(--terra-icon-medium);
}
</style>
```

### Icons in Buttons

Combine icons with buttons using HDS spacing:

```html:preview
<terra-button variant="primary">
    <terra-icon slot="prefix" name="nasa-logo" style="font-size: var(--terra-icon-small);"></terra-icon>
    Launch Mission
</terra-button>
<terra-button variant="danger" outline>
    <terra-icon slot="prefix" name="asteroid" style="font-size: var(--terra-icon-small);"></terra-icon>
    Delete
</terra-button>
```

### Global Icon Customization

To customize all icons globally, override the CSS variables in your theme:

```css
:root,
.terra-theme-horizon {
    /* Customize default icon size */
    --terra-icon-medium: 2rem;
    
    /* Customize icon colors if needed */
    /* Note: Icons inherit color, so set on parent elements */
}
```

## Using CSS Parts

For advanced customization, use CSS parts:

```html:preview
<terra-icon name="nasa-logo" class="custom-icon"></terra-icon>

<style>
.custom-icon::part(svg) {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.custom-icon {
    color: var(--terra-color-nasa-blue);
    font-size: var(--terra-icon-large);
    transition: transform var(--terra-transition-medium);
}

.custom-icon:hover {
    transform: scale(1.1);
    color: var(--terra-color-nasa-blue-shade);
}
</style>
```

## HDS Icon Library

Terra UI Components includes HDS icons from the [official Horizon Design System iconography](https://website.nasa.gov/hds/foundations/iconography/). These are available through the `terra-icon` component with the `default` library (or no library specified).

```html
<terra-icon name="nasa-logo"></terra-icon>
<terra-icon name="caret"></terra-icon>
<terra-icon name="chevron-left-circle"></terra-icon>
```

## HDS Design Tokens Reference

**Sizes:**
- `--terra-icon-small`: 1.2rem (19px)
- `--terra-icon-medium`: 1.75rem (28px)
- `--terra-icon-large`: 2.2rem (35px)
- `--terra-icon-x-large`: 3rem (48px)

**Colors:**
Icons inherit color from their parent. Use any HDS color variable:
- `--terra-color-nasa-blue`
- `--terra-color-nasa-red`
- `--terra-color-active-green`
- `--terra-color-carbon-*` (for neutral icons)

**Spacing:**
When placing icons next to text, use HDS spacing:
- `--terra-spacing-x-small`: Small gap
- `--terra-spacing-small`: Medium gap
- `--terra-spacing-medium`: Large gap

## Related

- [HDS Overview](/horizon-design-system) - Learn about all HDS design tokens
- [Icon Component](/components/icon) - Full Terra Icon component documentation
- [HDS Iconography](https://website.nasa.gov/hds/foundations/iconography/) - Official HDS icon guidelines
