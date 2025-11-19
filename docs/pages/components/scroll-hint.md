---
meta:
    title: Scroll Hint
    description: Scroll hint is an animated button that prompts visitors to scroll.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-scroll-hint inline></terra-scroll-hint>
```

## Usage

The scroll hint is used on feature pages as a reminder to continue down the page. These hints are most useful for immersive modules that take up most of the vertical space of the visitor's viewport. The scroll hint includes an animated button element that calls attention to it.

The element is clickable and triggers an animated vertical scroll. The page will scroll a distance equal to the current height of the viewport to move the visitor into the next section. If the visitor clicks on the scroll hint, begins scrolling, or clicks anywhere else on the screen, the scroll hint will disappear.

```html:preview
<div style="padding: 2rem;">
    <p>By default, the scroll hint appears in the bottom left after 3 seconds of inactivity.</p>
    <terra-scroll-hint></terra-scroll-hint>
</div>
```

```jsx:react
import TerraScrollHint from '@nasa-terra/components/dist/react/scroll-hint';

const App = () => (
    <p>The scroll hint will appear in the bottom left after 3 seconds of inactivity.</p>
    <TerraScrollHint />
);
```

## Variants and Options

Scroll hints come in 2 color schemes, so they can be used in light and dark modules and pages. The component automatically adapts to the current theme.

### Light Background

```html:preview
<div style="background-color: #f5f5f5; padding: 2rem;">
    <h1>Light Background</h1>
    <p>Scroll hint on light background</p>
    <terra-scroll-hint inline></terra-scroll-hint>
</div>
```

### Dark Background

When placing the scroll hint on a dark background, use the `dark` prop to force dark mode styles for better visibility:

```html:preview
<div style="background-color: #1a1a1a; padding: 2rem; color: white;">
    <h1>Dark Background</h1>
    <p>Scroll hint on dark background with dark prop</p>
    <terra-scroll-hint inline dark></terra-scroll-hint>
</div>
```

The `dark` prop forces dark mode styles regardless of system preference, making it perfect for dark background sections even when the user's system is in light mode.

## Behavior

The scroll hint behavior depends on whether it's inline or fixed:

### Inline Position

When the `inline` prop is set:

-   The scroll hint is **always visible** (no inactivity timer)
-   It remains visible regardless of user interaction
-   Scrolls the page down by one viewport height when clicked
-   Emits a `terra-scroll` event when clicked

### Fixed Position (Default)

When the `inline` prop is not set (default):

-   Appears after a configurable delay of user inactivity (defaults to 3 seconds)
-   Once shown, remains visible until the user:
    -   Clicks on the scroll hint (triggers scroll)
    -   Begins scrolling the page
    -   Clicks anywhere else on the page
    -   Scrolls to the bottom of the page (hint will not show again)
-   Scrolls the page down by one viewport height when clicked
-   Emits a `terra-scroll` event when clicked

## Positioning

By default, the scroll hint is positioned fixed in the bottom left corner of the viewport. Use the `inline` prop to position it inline in the DOM flow instead.

### Fixed Position (Default)

```html:preview
<div style="height: 200vh; padding: 2rem;">
    <h1>Fixed position (default)</h1>
    <p>The scroll hint appears in the bottom left corner of the viewport.</p>
    <terra-scroll-hint inactivity-delay="2000"></terra-scroll-hint>
</div>
```

### Inline Position

```html:preview
<div style="height: 200vh; padding: 2rem;">
    <h1>Inline position</h1>
    <p>The scroll hint appears inline where it's placed in the DOM.</p>
    <terra-scroll-hint inline inactivity-delay="2000"></terra-scroll-hint>
    <p>Content continues after the scroll hint.</p>
</div>
```

## Configuration

### Dark Mode

Use the `dark` prop to force dark mode styles when placing the scroll hint on a dark background, regardless of system preference:

```html:preview
<div style="background-color: #1a1a1a; padding: 2rem; color: white;">
    <h1>Forced Dark Mode</h1>
    <p>This scroll hint uses dark mode styles even if your system is in light mode.</p>
    <terra-scroll-hint inline dark></terra-scroll-hint>
</div>
```

{% raw %}

```jsx:react
import TerraScrollHint from '@nasa-terra/components/dist/react/scroll-hint';

const App = () => (
    <div style={{ backgroundColor: '#1a1a1a', padding: '2rem', color: 'white' }}>
        <TerraScrollHint inline dark />
    </div>
);
```

{% endraw %}

### Inactivity Delay

Use the `inactivityDelay` prop (in milliseconds) to configure how long to wait before showing the scroll hint:

```html:preview
<div style="height: 200vh; padding: 2rem;">
    <h1>Custom delay (5 seconds)</h1>
    <p>This scroll hint appears after 5 seconds of inactivity.</p>
    <terra-scroll-hint inactivity-delay="5000"></terra-scroll-hint>
</div>
```

{% raw %}

```jsx:react
import TerraScrollHint from '@nasa-terra/components/dist/react/scroll-hint';

const App = () => (
    <div style={{ height: '200vh', padding: '2rem' }}>
        <h1>Custom delay</h1>
        <TerraScrollHint inactivityDelay={5000} />
    </div>
);
```

{% endraw %}

## Customization

You can customize the scroll hint appearance using CSS custom properties:

```css
terra-scroll-hint {
    --terra-scroll-hint-icon-background-color: var(--terra-color-carbon-black);
    --terra-scroll-hint-icon-color: var(--terra-color-spacesuit-white);
    --terra-scroll-hint-text-color: var(--terra-color-carbon-black);
    --terra-scroll-hint-ring-color: var(--terra-color-nasa-red);
}
```

### Design Tokens

The following design tokens are available for customization:

-   `--terra-scroll-hint-icon-background-color`: Background color of the icon circle (default: `--terra-color-carbon-black` in light mode, `--terra-color-spacesuit-white` in dark mode)
-   `--terra-scroll-hint-icon-color`: Color of the chevron icon (default: `--terra-color-spacesuit-white` in light mode, `--terra-color-carbon-black` in dark mode)
-   `--terra-scroll-hint-text-color`: Color of the "SCROLL TO CONTINUE" text (default: `--terra-color-carbon-black` in light mode, `--terra-color-spacesuit-white` in dark mode)
-   `--terra-scroll-hint-ring-color`: Color of the pulsing ring (default: `--terra-color-nasa-red`)

All tokens automatically adapt to dark mode when dark mode is active (via system preference or the `dark` prop).

## Animation

The defining element of the scroll hint is the ring around its arrow icon, which rhythmically expands and contracts for a subtle yet eye-catching animation. The animation respects `prefers-reduced-motion` and will be disabled for users who prefer reduced motion.
