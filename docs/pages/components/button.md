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
<edux-button variant="default">Default</edux-button>
<edux-button variant="primary">Primary</edux-button>
<edux-button variant="success">Success</edux-button>
<edux-button variant="warning">Warning</edux-button>
<edux-button variant="danger">Danger</edux-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton variant="default">Default</EduxButton>
    <EduxButton variant="primary">Primary</EduxButton>
    <EduxButton variant="success">Success</EduxButton>
    <EduxButton variant="warning">Warning</EduxButton>
    <EduxButton variant="danger">Danger</EduxButton>
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
<edux-button variant="default" outline>Default</edux-button>
<edux-button variant="primary" outline>Primary</edux-button>
<edux-button variant="success" outline>Success</edux-button>
<edux-button variant="warning" outline>Warning</edux-button>
<edux-button variant="danger" outline>Danger</edux-button>
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
    </EduxButton>
    <EduxButton variant="warning" outline>
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
<edux-button circle>
  <slot name="label">
    <edux-icon name="solid-play" library="heroicons" font-size="1.5em"></edux-icon>
  </slot>
</edux-button>
<edux-button variant="danger" circle>
  <slot name="label">
    <edux-icon name="outline-arrow-down-tray" library="heroicons" font-size="1.5em"></edux-icon>
  </slot>
</edux-button>
<edux-button outline circle>
  <slot name="label">
    <edux-icon name="outline-arrow-down-tray" library="heroicons" font-size="1.5em"></edux-icon>
  </slot>
</edux-button>
<edux-button size="small" circle>
  <slot name="label">
    <edux-icon name="outline-arrow-down-tray" library="heroicons" font-size="1.3em"></edux-icon>
  </slot>
</edux-button>
<edux-button size="large" circle>
  <slot name="label">
    <edux-icon name="outline-arrow-down-tray" library="heroicons" font-size="2em"></edux-icon>
  </slot>
</edux-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const = App = () => (
  <>
    <eduxButton circle>
      <slot name="label">
        <eduxIcon name="solid-play" library="heroicons" font-size="1.5em"></eduxIcon>
      </slot>
    </eduxButton>
    <eduxButton variant="danger" circle>
      <slot name="label">
        <eduxIcon name="outline-arrow-down-tray" library="heroicons" font-size="1.5em"></eduxIcon>
      </slot>
    </eduxButton>
    <eduxButton outline circle>
      <slot name="label">
        <eduxIcon name="outline-arrow-down-tray" library="heroicons" font-size="1.5em"></eduxIcon>
      </slot>
    </eduxButton>
    <eduxButton size="small" circle>
      <slot name="label">
        <eduxIcon name="outline-arrow-down-tray" library="heroicons" font-size="1.3em"></eduxIcon>
      </slot>
    </eduxButton>
    <eduxButton size="large" circle>
      <slot name="label">
        <eduxIcon name="outline-arrow-down-tray" library="heroicons" font-size="2em"></eduxIcon>
      </slot>
    </eduxButton>
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
<edux-button variant="pagelink" href="https://localhost/" target="_blank" size="small">Explore</edux-button>
<edux-button variant="pagelink" href="https://localhost/" size="medium">Explore</edux-button>
<edux-button variant="pagelink" href="https://example.com/" target="_blank" size="large">Explore</edux-button>
```

```jsx:react
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton variant="pagelink" href="https://localhost/" target="_blank" size="small">
      Explore
    </EduxButton>
    <EduxButton variant="pagelink" href="https://localhost/" size="medium">
      Explore
    </EduxButton>
    <EduxButton variant="pagelink" href="https://example.com/" target="_blank" size="large">
      Explore
    </EduxButton>
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

Use the button `shape` attribute to override its radius. Useful for controlling the button's edge shape when it is next to an input form controls such as a drop-down list but not in a edux-button-group. The button will appear more integrated into input form controls such as drop-down lists, search fields, etc.

```html:preview
<edux-button shape="square-right">Square-right</edux-button>
<edux-button shape="square">Square</edux-button>
<edux-button shape="square-left">Square-left</edux-button>
```

```jsx:react
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton shape="square-right">
      Small
    </EduxButton>
    <EduxButton shape="square">
      Medium
    </EduxButton>
    <EduxButton shape="square-left">
      Large
    </EduxButton>
  </>
);
```

### Loading

Use the `loading` attribute to make a button busy. The width will remain the same as before, preventing adjacent elements from moving around.

```html:preview
<edux-button variant="default" loading>Default</edux-button>
<edux-button variant="success" loading>Success</edux-button>
<edux-button variant="warning" loading>Warning</edux-button>
<edux-button variant="danger" loading>Danger</edux-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton variant="default" loading>
      Default
    </EduxButton>
    <EduxButton variant="success" loading>
      Success
    </EduxButton>
    <EduxButton variant="warning" loading>
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
<edux-button variant="default" disabled>Default</edux-button>
<edux-button variant="success" disabled>Success</edux-button>
<edux-button variant="warning" disabled>Warning</edux-button>
<edux-button variant="danger" disabled>Danger</edux-button>
```

```jsx:react
import TerraButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <TerraButton variant="default" disabled>
      Default
    </TerraButton>

    <EduxButton variant="success" disabled>
      Success
    </TerraButton>

    <EduxButton variant="warning" disabled>
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
