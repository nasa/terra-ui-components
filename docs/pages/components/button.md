---
meta:
    title: Button
    description: Buttons represent actions that are available to the user.
layout: component
---

<!-- TODO: @shoelace-style/shoelace/dist/react/button needs to be replaced with our dist -->

```html:preview
<terra-button>Button</terra-button>
```

```jsx:react
import TerraButton from '@nasa-terra/components/dist/react/button';

const App = () => <TerraButton>Button</TerraButton>;
```

## Examples

### Variants

Use the `variant` attribute to set the button's variant.

```html:preview
<terra-button variant="default">Default</terra-button>
<terra-button variant="primary">Primary</terra-button>
<terra-button variant="success">Success</terra-button>
<terra-button variant="warning">Warning</terra-button>
<terra-button variant="danger">Danger</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton variant="default">Default</TerraButton>
    <TerraButton variant="primary">Primary</TerraButton>
    <TerraButton variant="success">Success</TerraButton>
    <TerraButton variant="warning">Warning</TerraButton>
    <TerraButton variant="danger">Danger</TerraButton>
  </>
);
```

### Sizes

Use the `size` attribute to change a button's size.

```html:preview
<terra-button size="small">Small</terra-button>
<terra-button size="medium">Medium</terra-button>
<terra-button size="large">Large</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton size="small">Small</TerraButton>
    <TerraButton size="medium">Medium</TerraButton>
    <TerraButton size="large">Large</TerraButton>
  </>
);
```

### Outline Buttons

Use the `outline` attribute to draw outlined buttons with transparent backgrounds.

```html:preview
<terra-button variant="default" outline>Default</terra-button>
<terra-button variant="primary" outline>Primary</terra-button>
<terra-button variant="success" outline>Success</terra-button>
<terra-button variant="warning" outline>Warning</terra-button>
<terra-button variant="danger" outline>Danger</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton variant="default" outline>
      Default
    </TerraButton>
    <TerraButton variant="primary" outline>
      Primary
    </TerraButton>
    <TerraButton variant="success" outline>
      Success
    </TerraButton>
    <TerraButton variant="warning" outline>
      Warning
    </TerraButton>
    <TerraButton variant="danger" outline>
      Danger
    </TerraButton>
  </>
);
```

### Circle Buttons

```html:preview
<terra-button circle>
  <slot name="label">
    <terra-icon name="solid-play" library="heroicons" font-size="1.5em"></terra-icon>
  </slot>
</terra-button>
<terra-button variant="danger" circle>
  <slot name="label">
    <terra-icon name="outline-arrow-down-tray" library="heroicons" font-size="1.5em"></terra-icon>
  </slot>
</terra-button>
<terra-button outline circle>
  <slot name="label">
    <terra-icon name="outline-arrow-down-tray" library="heroicons" font-size="1.5em"></terra-icon>
  </slot>
</terra-button>
<terra-button size="small" circle>
  <slot name="label">
    <terra-icon name="outline-arrow-down-tray" library="heroicons" font-size="1.3em"></terra-icon>
  </slot>
</terra-button>
<terra-button size="large" circle>
  <slot name="label">
    <terra-icon name="outline-arrow-down-tray" library="heroicons" font-size="2em"></terra-icon>
  </slot>
</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const = App = () => (
  <>
    <TerraButton circle>
      <slot name="label">
        <TerraIcon name="solid-play" library="heroicons" font-size="1.5em"></TerraIcon>
      </slot>
    </TerraButton>
    <TerraButton variant="danger" circle>
      <slot name="label">
        <TerraIcon name="outline-arrow-down-tray" library="heroicons" font-size="1.5em"></TerraIcon>
      </slot>
    </TerraButton>
    <TerraButton outline circle>
      <slot name="label">
        <TerraIcon name="outline-arrow-down-tray" library="heroicons" font-size="1.5em"></TerraIcon>
      </slot>
    </TerraButton>
    <TerraButton size="small" circle>
      <slot name="label">
        <TerraIcon name="outline-arrow-down-tray" library="heroicons" font-size="1.3em"></TerraIcon>
      </slot>
    </TerraButton>
    <TerraButton size="large" circle>
      <slot name="label">
        <TerraIcon name="outline-arrow-down-tray" library="heroicons" font-size="2em"></TerraIcon>
      </slot>
    </TerraButton>
  </>
)

```

### Text Buttons

Use the `text` variant to create text buttons that share the same size as regular buttons but don't have backgrounds or borders.

```html:preview
<terra-button variant="text" size="small">Text</terra-button>
<terra-button variant="text" size="medium">Text</terra-button>
<terra-button variant="text" size="large">Text</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton variant="text" size="small">
      Text
    </TerraButton>
    <TerraButton variant="text" size="medium">
      Text
    </TerraButton>
    <TerraButton variant="text" size="large">
      Text
    </TerraButton>
  </>
);
```

### Page Link Buttons

Use the `pagelink` variant to create text buttons that use bold text and a red circled arrow icon to indicate navigation to a new page. Links to external content (outside of the hosting domain) will render an arrow pointing to the upper right to indicate that the user will be leaving the hosting site.

```html:preview
<terra-button variant="pagelink" href="https://localhost/" target="_blank" size="small">Explore</terra-button>
<terra-button variant="pagelink" href="https://localhost/" size="medium">Explore</terra-button>
<terra-button variant="pagelink" href="https://example.com/" target="_blank" size="large">Explore</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton variant="pagelink" href="https://localhost/" target="_blank" size="small">
      Explore
    </TerraButton>
    <TerraButton variant="pagelink" href="https://localhost/" size="medium">
      Explore
    </TerraButton>
    <TerraButton variant="pagelink" href="https://example.com/" target="_blank" size="large">
      Explore
    </TerraButton>
  </>
);
```

### Link Buttons

It's often helpful to have a button that works like a link. This is possible by setting the `href` attribute, which will make the component render an `<a>` under the hood. This gives you all the default link behavior the browser provides (e.g. [[CMD/CTRL/SHIFT]] + [[CLICK]]) and exposes the `target` and `download` attributes.

```html:preview
<terra-button href="https://example.com/">Link</terra-button>
<terra-button href="https://example.com/" target="_blank">New Window</terra-button>
<terra-button href="/assets/images/wordmark.svg" download="shoelace.svg">Download</terra-button>
<terra-button href="https://example.com/" disabled>Disabled</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton href="https://example.com/">Link</TerraButton>
    <TerraButton href="https://example.com/" target="_blank">
      New Window
    </TerraButton>
    <TerraButton href="/assets/images/wordmark.svg" download="shoelace.svg">
      Download
    </TerraButton>
    <TerraButton href="https://example.com/" disabled>
      Disabled
    </TerraButton>
  </>
);
```

:::tip
When a `target` is set, the link will receive `rel="noreferrer noopener"` for [security reasons](https://mathiasbynens.github.io/rel-noopener/).
:::

### Setting a Custom Width

As expected, buttons can be given a custom width by passing inline styles to the component (or using a class). This is useful for making buttons span the full width of their container on smaller screens.

```html:preview
<terra-button variant="default" size="small" style="width: 100%; margin-bottom: 1rem;">Small</terra-button>
<terra-button variant="default" size="medium" style="width: 100%; margin-bottom: 1rem;">Medium</terra-button>
<terra-button variant="default" size="large" style="width: 100%;">Large</terra-button>
```

{% raw %}

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton variant="default" size="small" style={{ width: '100%', marginBottom: '1rem' }}>
      Small
    </TerraButton>
    <TerraButton variant="default" size="medium" style={{ width: '100%', marginBottom: '1rem' }}>
      Medium
    </TerraButton>
    <TerraButton variant="default" size="large" style={{ width: '100%' }}>
      Large
    </TerraButton>
  </>
);
```

{% endraw %}

### Prefix and Suffix Icons

TODO

### Caret

Use the `caret` attribute to add a dropdown indicator when a button will trigger a dropdown, menu, or popover.

```html:preview
<terra-button size="small" caret>Small</terra-button>
<terra-button size="medium" caret>Medium</terra-button>
<terra-button size="large" caret>Large</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton size="small" caret>
      Small
    </TerraButton>
    <TerraButton size="medium" caret>
      Medium
    </TerraButton>
    <TerraButton size="large" caret>
      Large
    </TerraButton>
  </>
);
```

### Shape

Use the button `shape` attribute to override its radius. Useful for controlling the button's edge shape when it is next to an input form controls such as a drop-down list but not in a terra-button-group. The button will appear more integrated into input form controls such as drop-down lists, search fields, etc.

```html:preview
<terra-button shape="square-right">Square-right</terra-button>
<terra-button shape="square">Square</terra-button>
<terra-button shape="square-left">Square-left</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton shape="square-right">
      Small
    </TerraButton>
    <TerraButton shape="square">
      Medium
    </TerraButton>
    <TerraButton shape="square-left">
      Large
    </TerraButton>
  </>
);
```

### Loading

Use the `loading` attribute to make a button busy. The width will remain the same as before, preventing adjacent elements from moving around.

```html:preview
<terra-button variant="default" loading>Default</terra-button>
<terra-button variant="success" loading>Success</terra-button>
<terra-button variant="warning" loading>Warning</terra-button>
<terra-button variant="danger" loading>Danger</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton variant="default" loading>
      Default
    </TerraButton>
    <TerraButton variant="success" loading>
      Success
    </TerraButton>
    <TerraButton variant="warning" loading>
      Warning
    </TerraButton>
    <TerraButton variant="danger" loading>
      Danger
    </TerraButton>
  </>
);
```

### Disabled

Use the `disabled` attribute to disable a button.

```html:preview
<terra-button variant="default" disabled>Default</terra-button>
<terra-button variant="success" disabled>Success</terra-button>
<terra-button variant="warning" disabled>Warning</terra-button>
<terra-button variant="danger" disabled>Danger</terra-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton variant="default" disabled>
      Default
    </TerraButton>

    <TerraButton variant="success" disabled>
      Success
    </TerraButton>

    <TerraButton variant="warning" disabled>
      Warning
    </TerraButton>

    <TerraButton variant="danger" disabled>
      Danger
    </TerraButton>
  </>
);
```

### Styling Buttons

This example demonstrates how to style buttons using a custom class. This is the recommended approach if you need to add additional variations. To customize an existing variation, modify the selector to target the button's `variant` attribute instead of a class (e.g. `terra-button[variant="primary"]`).

```html:preview
<terra-button class="pink">Pink Button</terra-button>

<style>
  terra-button.pink::part(base) {
    /* Set design tokens for height and border width */
    --terra-input-height-medium: 48px;
    --terra-input-border-width: 4px;

    border-radius: 0;
    background-color: #ff1493;
    border-top-color: #ff7ac1;
    border-left-color: #ff7ac1;
    border-bottom-color: #ad005c;
    border-right-color: #ad005c;
    color: white;
    font-size: 1.125rem;
    box-shadow: 0 2px 10px #0002;
    transition: var(--terra-transition-medium) transform ease, var(--terra-transition-medium) border ease;
  }

  terra-button.pink::part(base):hover {
    transform: scale(1.05) rotate(-1deg);
  }

  terra-button.pink::part(base):active {
    border-top-color: #ad005c;
    border-right-color: #ff7ac1;
    border-bottom-color: #ff7ac1;
    border-left-color: #ad005c;
    transform: scale(1.05) rotate(-1deg) translateY(2px);
  }

  terra-button.pink::part(base):focus-visible {
    outline: dashed 2px deeppink;
    outline-offset: 4px;
  }
</style>
```
