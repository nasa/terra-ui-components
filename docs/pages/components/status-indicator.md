---
meta:
    title: Status Indicator
    description: Status indicators are dynamic labels that indicate the current state of a mission or project.
    layout: component
sidebarSection: Elements
---

# Status Indicator

Status indicators are dynamic labels that indicate the current state of a mission or project. This element contains a semantically colored dot and a text label. They are prominently displayed on mission pages to indicate if the mission is complete, active, in testing, planned for the future, etc.

[component-metadata:terra-status-indicator]

## Usage

Status indicators use colored dots to represent different mission or project states. The dot color is determined by the `variant` prop, and the label text is provided via the default slot.

```html:preview
<terra-status-indicator variant="active">Active Mission</terra-status-indicator>
```

```jsx:react
import TerraStatusIndicator from '@nasa-terra/components/dist/react/status-indicator';

const App = () => (
    <TerraStatusIndicator variant="active">Active Mission</TerraStatusIndicator>
);
```

## Variants

Colored dots should be assigned to specific statuses and applied consistently. The following variants are available:

### Active

Use the `active` variant for missions or projects that are currently active.

```html:preview
<terra-status-indicator variant="active">Active Mission</terra-status-indicator>
```

### Completed

Use the `completed` variant for missions or projects that have been completed.

```html:preview
<terra-status-indicator variant="completed">Completed 56 Years Ago</terra-status-indicator>
```

### Testing

Use the `testing` variant for missions or projects that are currently in testing.

```html:preview
<terra-status-indicator variant="testing">In Testing</terra-status-indicator>
```

### Future

Use the `future` variant for missions or projects that are planned for the future.

```html:preview
<terra-status-indicator variant="future">Future Mission</terra-status-indicator>
```

## Dark Mode

Status indicators automatically adapt to dark mode based on system preference. Use the `dark` prop to force dark mode styles when placing the component on a dark background.

### Light Background

```html:preview
<div style="background-color: #f5f5f5; padding: 2rem;">
    <terra-status-indicator variant="active">Active Mission</terra-status-indicator>
    <br /><br />
    <terra-status-indicator variant="completed">Completed Mission</terra-status-indicator>
    <br /><br />
    <terra-status-indicator variant="testing">In Testing</terra-status-indicator>
    <br /><br />
    <terra-status-indicator variant="future">Future Mission</terra-status-indicator>
</div>
```

### Dark Background

When placing status indicators on a dark background, use the `dark` prop to ensure proper contrast:

```html:preview
<div style="background-color: #1a1a1a; padding: 2rem;">
    <terra-status-indicator variant="active" dark>Active Mission</terra-status-indicator>
    <br /><br />
    <terra-status-indicator variant="completed" dark>Completed Mission</terra-status-indicator>
    <br /><br />
    <terra-status-indicator variant="testing" dark>In Testing</terra-status-indicator>
    <br /><br />
    <terra-status-indicator variant="future" dark>Future Mission</terra-status-indicator>
</div>
```

## Customization

You can customize status indicator appearance using CSS custom properties:

```css
terra-status-indicator {
    --terra-status-indicator-font-family: var(--terra-font-family--inter);
    --terra-status-indicator-font-size: var(--terra-font-size-small);
    --terra-status-indicator-label-color: var(--terra-color-carbon-90);
    --terra-status-indicator-dot-color-active: var(--terra-color-active-green);
    --terra-status-indicator-dot-color-completed: var(--terra-color-carbon-40);
    --terra-status-indicator-dot-color-testing: var(
        --terra-color-international-orange
    );
    --terra-status-indicator-dot-color-future: var(--terra-color-nasa-blue);
}
```

### Design Tokens

The following design tokens are available for customization:

-   `--terra-status-indicator-font-family`: Font family (default: `--terra-font-family--inter`)
-   `--terra-status-indicator-font-size`: Font size (default: `--terra-font-size-small`)
-   `--terra-status-indicator-font-weight`: Font weight (default: `--terra-font-weight-normal`)
-   `--terra-status-indicator-label-color`: Text color (default: `--terra-color-carbon-90` in light mode, `--terra-color-carbon-60` in dark mode)
-   `--terra-status-indicator-dot-color-active`: Dot color for active variant (default: `--terra-color-active-green`)
-   `--terra-status-indicator-dot-color-completed`: Dot color for completed variant (default: `--terra-color-carbon-40`)
-   `--terra-status-indicator-dot-color-testing`: Dot color for testing variant (default: `--terra-color-international-orange`)
-   `--terra-status-indicator-dot-color-future`: Dot color for future variant (default: `--terra-color-nasa-blue`)

All tokens automatically adapt to dark mode when dark mode is active (via system preference or the `dark` prop).
