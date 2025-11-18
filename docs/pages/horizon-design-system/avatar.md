---
meta:
    title: HDS Avatar
    description: Learn how to customize Terra avatars using Horizon Design System CSS variables
---

# HDS Avatar

The Terra Avatar component is built on Horizon Design System (HDS) design tokens. This guide shows you how to customize avatars using HDS CSS variables.

:::tip
**Use the Terra Avatar Component**: We recommend using `<terra-avatar>` for all avatar needs. It provides consistent styling, image fallback, and accessibility. This guide shows you how to customize it using HDS design tokens.
:::

## Using Terra Avatar

Start with the Terra Avatar component:

```html:preview
<terra-avatar label="John Doe"></terra-avatar>
<terra-avatar size="small" label="Jane Smith"></terra-avatar>
<terra-avatar size="large" label="Mission Lead"></terra-avatar>
```

See the [full Avatar component documentation](/components/avatar) for all available props and features.

## Customizing with HDS CSS Variables

Terra avatars use HDS design tokens for typography, spacing, colors, and border radius. Here are the key CSS variables:

### Avatar Design Tokens

**Typography:**
- `--terra-font-family--inter`: Avatar font family
- `--terra-font-size-x-small`: Small avatar font size
- `--terra-font-size-small`: Medium avatar font size
- `--terra-font-size-medium`: Large avatar font size
- `--terra-font-weight-semibold`: Avatar font weight

**Colors:**
- `--terra-color-carbon-10`: Default background color
- `--terra-color-carbon-20`: Hover background color
- `--terra-color-carbon-80`: Default text color for initials
- `--terra-color-nasa-blue`: Badge background color
- `--terra-color-spacesuit-white`: Badge border and text color

**Spacing:**
- `--terra-spacing-3x-small`: Badge padding

**Border Radius:**
- `--terra-border-radius-circle`: Circular avatar shape (default)

**Transitions:**
- `--terra-transition-fast`: Hover state transitions

**Shadows:**
- `--terra-shadow-small`: Badge shadow

### Avatar-Specific CSS Variables

The avatar component also provides its own CSS variables for customization:

- `--terra-avatar-size`: Controls the width and height of the avatar
- `--terra-avatar-border-radius`: Controls the border radius
- `--terra-avatar-background-color`: Controls the background color when no image is present
- `--terra-avatar-color`: Controls the text color for initials
- `--terra-avatar-font-size`: Controls the font size for initials
- `--terra-avatar-font-weight`: Controls the font weight for initials
- `--terra-avatar-background-color-hover`: Controls the hover background color

### Customizing Avatar Colors

Override HDS color variables to create custom avatar variants:

```html:preview
<terra-avatar class="avatar-primary" label="Primary"></terra-avatar>
<terra-avatar class="avatar-success" label="Success"></terra-avatar>
<terra-avatar class="avatar-warning" label="Warning"></terra-avatar>
<terra-avatar class="avatar-danger" label="Danger"></terra-avatar>

<style>
.avatar-primary::part(base) {
    --terra-avatar-background-color: var(--terra-color-nasa-blue);
    --terra-avatar-color: var(--terra-color-spacesuit-white);
}

.avatar-success::part(base) {
    --terra-avatar-background-color: var(--terra-color-active-green);
    --terra-avatar-color: var(--terra-color-spacesuit-white);
}

.avatar-warning::part(base) {
    --terra-avatar-background-color: var(--terra-color-international-orange);
    --terra-avatar-color: var(--terra-color-spacesuit-white);
}

.avatar-danger::part(base) {
    --terra-avatar-background-color: var(--terra-color-nasa-red);
    --terra-avatar-color: var(--terra-color-spacesuit-white);
}
</style>
```

### Customizing Avatar Sizes

Adjust avatar sizes using the `--terra-avatar-size` CSS variable:

```html:preview
<terra-avatar class="avatar-xs" label="XS"></terra-avatar>
<terra-avatar class="avatar-sm" label="SM"></terra-avatar>
<terra-avatar class="avatar-md" label="MD"></terra-avatar>
<terra-avatar class="avatar-lg" label="LG"></terra-avatar>
<terra-avatar class="avatar-xl" label="XL"></terra-avatar>

<style>
.avatar-xs::part(base) {
    --terra-avatar-size: 1.5rem; /* 24px */
    --terra-avatar-font-size: var(--terra-font-size-2x-small);
}

.avatar-sm::part(base) {
    --terra-avatar-size: 2rem; /* 32px */
    --terra-avatar-font-size: var(--terra-font-size-x-small);
}

.avatar-md::part(base) {
    --terra-avatar-size: 2.5rem; /* 40px */
    --terra-avatar-font-size: var(--terra-font-size-small);
}

.avatar-lg::part(base) {
    --terra-avatar-size: 3.5rem; /* 56px */
    --terra-avatar-font-size: var(--terra-font-size-medium);
}

.avatar-xl::part(base) {
    --terra-avatar-size: 4.5rem; /* 72px */
    --terra-avatar-font-size: var(--terra-font-size-large);
}
</style>
```

### Customizing Avatar Border Radius

Use HDS border radius variables to change the avatar shape:

```html:preview
<terra-avatar class="avatar-square" label="Square"></terra-avatar>
<terra-avatar class="avatar-rounded" label="Rounded"></terra-avatar>
<terra-avatar class="avatar-circle" label="Circle"></terra-avatar>

<style>
.avatar-square::part(base) {
    --terra-avatar-border-radius: var(--terra-border-radius-small);
}

.avatar-rounded::part(base) {
    --terra-avatar-border-radius: var(--terra-border-radius-large);
}

.avatar-circle::part(base) {
    --terra-avatar-border-radius: var(--terra-border-radius-circle);
}
</style>
```

### Customizing Avatar Badges

Customize badge appearance using HDS variables:

```html:preview
<terra-avatar class="avatar-badge-primary" label="Primary" badge="1"></terra-avatar>
<terra-avatar class="avatar-badge-success" label="Success" badge="✓"></terra-avatar>
<terra-avatar class="avatar-badge-warning" label="Warning" badge="!"></terra-avatar>

<style>
.avatar-badge-primary::part(badge) {
    background-color: var(--terra-color-nasa-blue);
    color: var(--terra-color-spacesuit-white);
}

.avatar-badge-success::part(badge) {
    background-color: var(--terra-color-active-green);
    color: var(--terra-color-spacesuit-white);
}

.avatar-badge-warning::part(badge) {
    background-color: var(--terra-color-international-orange);
    color: var(--terra-color-spacesuit-white);
}
</style>
```

### Variant-Based Styling

Use the `variant` prop to apply different styles based on avatar type:

```html:preview
<terra-avatar variant="people" class="variant-people" label="Astronaut"></terra-avatar>
<terra-avatar variant="mission" class="variant-mission" label="Artemis"></terra-avatar>
<terra-avatar variant="department" class="variant-department" label="NASA Center"></terra-avatar>

<style>
.avatar[variant="people"]::part(base) {
    border: 2px solid var(--terra-color-nasa-blue);
}

.avatar[variant="mission"]::part(base) {
    border: 2px solid var(--terra-color-nasa-red);
}

.avatar[variant="department"]::part(base) {
    border: 2px solid var(--terra-color-carbon-50);
}
</style>
```

### Global Avatar Customization

To customize all avatars globally, override the CSS variables in your theme:

```css
:root,
.terra-theme-horizon {
    /* Customize default avatar colors */
    --terra-avatar-background-color: var(--terra-color-carbon-10);
    --terra-avatar-color: var(--terra-color-carbon-80);
    
    /* Customize size */
    --terra-avatar-size: 2.5rem;
    
    /* Customize border radius */
    --terra-avatar-border-radius: var(--terra-border-radius-circle);
    
    /* Customize typography */
    --terra-avatar-font-size: var(--terra-font-size-small);
    --terra-avatar-font-weight: var(--terra-font-weight-semibold);
}
```

## Using CSS Parts

For advanced customization, use CSS parts to target specific avatar elements:

```html:preview
<terra-avatar class="advanced-avatar" label="Advanced">
</terra-avatar>

<style>
.advanced-avatar::part(base) {
    background: linear-gradient(
        135deg,
        var(--terra-color-nasa-blue),
        var(--terra-color-nasa-blue-shade)
    );
    box-shadow: var(--terra-shadow-medium);
    transition: all var(--terra-transition-medium);
    border: 2px solid var(--terra-color-spacesuit-white);
}

.advanced-avatar::part(base):hover {
    transform: scale(1.05);
    box-shadow: var(--terra-shadow-large);
}

.advanced-avatar::part(initials) {
    color: var(--terra-color-spacesuit-white);
    font-weight: var(--terra-font-weight-bold);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
```

## HDS Design Tokens Reference

**Typography:**
- Font family: `--terra-font-family--inter`
- Font sizes: `--terra-font-size-*`
- Font weights: `--terra-font-weight-*`

**Colors:**
- Default: `--terra-color-carbon-10` (background), `--terra-color-carbon-80` (text)
- Primary: `--terra-color-nasa-blue`
- Success: `--terra-color-active-green`
- Warning: `--terra-color-international-orange`
- Danger: `--terra-color-nasa-red`
- White: `--terra-color-spacesuit-white`

**Spacing:**
- Badge padding: `--terra-spacing-3x-small`

**Border Radius:**
- Default: `--terra-border-radius-circle`
- Options: `--terra-border-radius-*`

**Transitions:**
- Timing: `--terra-transition-fast`, `--terra-transition-medium`

**Shadows:**
- Elevation: `--terra-shadow-small`, `--terra-shadow-medium`, `--terra-shadow-large`

## Avatar Variants

The HDS avatar component supports various semantic variants:

- **People**: Astronauts, scientists, and team members
- **Departments**: NASA centers and divisions
- **Missions**: Mission patches and logos
- **Partners**: Commercial and international partners (e.g., SpaceX, JAXA)
- **Flags**: Country flags for international partnerships
- **Planets**: Celestial bodies
- **Spacecraft**: Aircraft, robots, and spacecraft

## Related

- [HDS Overview](/horizon-design-system) - Learn about all HDS design tokens
- [Avatar Component](/components/avatar) - Full Terra Avatar component documentation
- [Customizing Components](/getting-started/customizing) - General customization guide

