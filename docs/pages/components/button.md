---
meta:
  title: Button
  description: Buttons represent actions that are available to the user.
layout: component
---

```html:preview
<gd-button>Button</gd-button>
```

```jsx:react
import GdButton from '@gesdisc/components/dist/react/button';

const App = () => <GdButton>Button</GdButton>;
```

## Examples

### Variants

Use the `variant` attribute to set the button's variant.

```html:preview
<gd-button variant="default">Default</gd-button>
<gd-button variant="primary">Primary</gd-button>
<gd-button variant="success">Success</gd-button>
<gd-button variant="neutral">Neutral</gd-button>
<gd-button variant="warning">Warning</gd-button>
<gd-button variant="danger">Danger</gd-button>
```

```jsx:react
import GdButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <GdButton variant="default">Default</GdButton>
    <GdButton variant="primary">Primary</GdButton>
    <GdButton variant="success">Success</GdButton>
    <GdButton variant="neutral">Neutral</GdButton>
    <GdButton variant="warning">Warning</GdButton>
    <GdButton variant="danger">Danger</GdButton>
  </>
);
```

### Sizes

Use the `size` attribute to change a button's size.

```html:preview
<gd-button size="small">Small</gd-button>
<gd-button size="medium">Medium</gd-button>
<gd-button size="large">Large</gd-button>
```

```jsx:react
import GdButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <GdButton size="small">Small</GdButton>
    <GdButton size="medium">Medium</GdButton>
    <GdButton size="large">Large</GdButton>
  </>
);
```

### Outline Buttons

Use the `outline` attribute to draw outlined buttons with transparent backgrounds.

```html:preview
<gd-button variant="default" outline>Default</gd-button>
<gd-button variant="primary" outline>Primary</gd-button>
<gd-button variant="success" outline>Success</gd-button>
<gd-button variant="neutral" outline>Neutral</gd-button>
<gd-button variant="warning" outline>Warning</gd-button>
<gd-button variant="danger" outline>Danger</gd-button>
```

```jsx:react
import GdButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <GdButton variant="default" outline>
      Default
    </GdButton>
    <GdButton variant="primary" outline>
      Primary
    </GdButton>
    <GdButton variant="success" outline>
      Success
    </GdButton>
    <GdButton variant="neutral" outline>
      Neutral
    </GdButton>
    <GdButton variant="warning" outline>
      Warning
    </GdButton>
    <GdButton variant="danger" outline>
      Danger
    </GdButton>
  </>
);
```

### Pill Buttons

Use the `pill` attribute to give buttons rounded edges.

```html:preview
<gd-button size="small" pill>Small</gd-button>
<gd-button size="medium" pill>Medium</gd-button>
<gd-button size="large" pill>Large</gd-button>
```

```jsx:react
import GdButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <GdButton size="small" pill>
      Small
    </GdButton>
    <GdButton size="medium" pill>
      Medium
    </GdButton>
    <GdButton size="large" pill>
      Large
    </GdButton>
  </>
);
```

### Circle Buttons

TODO

### Text Buttons

Use the `text` variant to create text buttons that share the same size as regular buttons but don't have backgrounds or borders.

```html:preview
<gd-button variant="text" size="small">Text</gd-button>
<gd-button variant="text" size="medium">Text</gd-button>
<gd-button variant="text" size="large">Text</gd-button>
```

```jsx:react
import GdButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <GdButton variant="text" size="small">
      Text
    </GdButton>
    <GdButton variant="text" size="medium">
      Text
    </GdButton>
    <GdButton variant="text" size="large">
      Text
    </GdButton>
  </>
);
```

### Link Buttons

It's often helpful to have a button that works like a link. This is possible by setting the `href` attribute, which will make the component render an `<a>` under the hood. This gives you all the default link behavior the browser provides (e.g. [[CMD/CTRL/SHIFT]] + [[CLICK]]) and exposes the `target` and `download` attributes.

```html:preview
<gd-button href="https://example.com/">Link</gd-button>
<gd-button href="https://example.com/" target="_blank">New Window</gd-button>
<gd-button href="/assets/images/wordmark.svg" download="shoelace.svg">Download</gd-button>
<gd-button href="https://example.com/" disabled>Disabled</gd-button>
```

```jsx:react
import GdButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <GdButton href="https://example.com/">Link</GdButton>
    <GdButton href="https://example.com/" target="_blank">
      New Window
    </GdButton>
    <GdButton href="/assets/images/wordmark.svg" download="shoelace.svg">
      Download
    </GdButton>
    <GdButton href="https://example.com/" disabled>
      Disabled
    </GdButton>
  </>
);
```

:::tip
When a `target` is set, the link will receive `rel="noreferrer noopener"` for [security reasons](https://mathiasbynens.github.io/rel-noopener/).
:::

### Setting a Custom Width

As expected, buttons can be given a custom width by passing inline styles to the component (or using a class). This is useful for making buttons span the full width of their container on smaller screens.

```html:preview
<gd-button variant="default" size="small" style="width: 100%; margin-bottom: 1rem;">Small</gd-button>
<gd-button variant="default" size="medium" style="width: 100%; margin-bottom: 1rem;">Medium</gd-button>
<gd-button variant="default" size="large" style="width: 100%;">Large</gd-button>
```

{% raw %}

```jsx:react
import GdButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <GdButton variant="default" size="small" style={{ width: '100%', marginBottom: '1rem' }}>
      Small
    </GdButton>
    <GdButton variant="default" size="medium" style={{ width: '100%', marginBottom: '1rem' }}>
      Medium
    </GdButton>
    <GdButton variant="default" size="large" style={{ width: '100%' }}>
      Large
    </GdButton>
  </>
);
```

{% endraw %}

### Prefix and Suffix Icons

TODO

### Caret

Use the `caret` attribute to add a dropdown indicator when a button will trigger a dropdown, menu, or popover.

```html:preview
<gd-button size="small" caret>Small</gd-button>
<gd-button size="medium" caret>Medium</gd-button>
<gd-button size="large" caret>Large</gd-button>
```

```jsx:react
import GdButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <GdButton size="small" caret>
      Small
    </GdButton>
    <GdButton size="medium" caret>
      Medium
    </GdButton>
    <GdButton size="large" caret>
      Large
    </GdButton>
  </>
);
```

### Loading

Use the `loading` attribute to make a button busy. The width will remain the same as before, preventing adjacent elements from moving around.

```html:preview
<gd-button variant="default" loading>Default</gd-button>
<gd-button variant="primary" loading>Primary</gd-button>
<gd-button variant="success" loading>Success</gd-button>
<gd-button variant="neutral" loading>Neutral</gd-button>
<gd-button variant="warning" loading>Warning</gd-button>
<gd-button variant="danger" loading>Danger</gd-button>
```

```jsx:react
import GdButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <GdButton variant="default" loading>
      Default
    </GdButton>
    <GdButton variant="primary" loading>
      Primary
    </GdButton>
    <GdButton variant="success" loading>
      Success
    </GdButton>
    <GdButton variant="neutral" loading>
      Neutral
    </GdButton>
    <GdButton variant="warning" loading>
      Warning
    </GdButton>
    <GdButton variant="danger" loading>
      Danger
    </GdButton>
  </>
);
```

### Disabled

Use the `disabled` attribute to disable a button.

```html:preview
<gd-button variant="default" disabled>Default</gd-button>
<gd-button variant="primary" disabled>Primary</gd-button>
<gd-button variant="success" disabled>Success</gd-button>
<gd-button variant="neutral" disabled>Neutral</gd-button>
<gd-button variant="warning" disabled>Warning</gd-button>
<gd-button variant="danger" disabled>Danger</gd-button>
```

```jsx:react
import GdButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <GdButton variant="default" disabled>
      Default
    </GdButton>

    <GdButton variant="primary" disabled>
      Primary
    </GdButton>

    <GdButton variant="success" disabled>
      Success
    </GdButton>

    <GdButton variant="neutral" disabled>
      Neutral
    </GdButton>

    <GdButton variant="warning" disabled>
      Warning
    </GdButton>

    <GdButton variant="danger" disabled>
      Danger
    </GdButton>
  </>
);
```

### Styling Buttons

This example demonstrates how to style buttons using a custom class. This is the recommended approach if you need to add additional variations. To customize an existing variation, modify the selector to target the button's `variant` attribute instead of a class (e.g. `gd-button[variant="primary"]`).

```html:preview
<gd-button class="pink">Pink Button</gd-button>

<style>
  gd-button.pink::part(base) {
    /* Set design tokens for height and border width */
    --gd-input-height-medium: 48px;
    --gd-input-border-width: 4px;

    border-radius: 0;
    background-color: #ff1493;
    border-top-color: #ff7ac1;
    border-left-color: #ff7ac1;
    border-bottom-color: #ad005c;
    border-right-color: #ad005c;
    color: white;
    font-size: 1.125rem;
    box-shadow: 0 2px 10px #0002;
    transition: var(--gd-transition-medium) transform ease, var(--gd-transition-medium) border ease;
  }

  gd-button.pink::part(base):hover {
    transform: scale(1.05) rotate(-1deg);
  }

  gd-button.pink::part(base):active {
    border-top-color: #ad005c;
    border-right-color: #ff7ac1;
    border-bottom-color: #ff7ac1;
    border-left-color: #ad005c;
    transform: scale(1.05) rotate(-1deg) translateY(2px);
  }

  gd-button.pink::part(base):focus-visible {
    outline: dashed 2px deeppink;
    outline-offset: 4px;
  }
</style>
```