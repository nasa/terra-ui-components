---
meta:
    title: Button
    description: Buttons represent actions that are available to the user.
layout: component
---

<!-- TODO: @shoelace-style/shoelace/dist/react/button needs to be replaced with our dist -->

```html:preview
<edux-button>Button</edux-button>
```

```jsx:react
import EduxButton from '@nasa/earthdata-ux-components/dist/react/button';

const App = () => <EduxButton>Button</EduxButton>;
```

## Examples

### Variants

Use the `variant` attribute to set the button's variant.

```html:preview
<edux-button variant="default">Default</edux-button>
<edux-button variant="neutral">Neutral</edux-button>
<edux-button variant="success">Success</edux-button>
<edux-button variant="warning">Warning</edux-button>
<edux-button variant="danger">Danger</edux-button>
```

```jsx:react
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton variant="default">Default</EduxButton>
    <EduxButton variant="neutral">Neutral</EduxButton>    
    <EduxButton variant="success">Success</EduxButton>
    <EduxButton variant="warning">Warning</EduxButton>
    <EduxButton variant="danger">Danger</EduxButton>
  </>
);
```

### Sizes

Use the `size` attribute to change a button's size.

```html:preview
<edux-button size="small">Small</edux-button>
<edux-button size="medium">Medium</edux-button>
<edux-button size="large">Large</edux-button>
```

```jsx:react
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton size="small">Small</EduxButton>
    <EduxButton size="medium">Medium</EduxButton>
    <EduxButton size="large">Large</EduxButton>
  </>
);
```

### Outline Buttons

Use the `outline` attribute to draw outlined buttons with transparent backgrounds.

```html:preview
<edux-button variant="default" outline>Default</edux-button>
<edux-button variant="neutral" outline>Neutral</edux-button>
<edux-button variant="success" outline>Success</edux-button>
<edux-button variant="warning" outline>Warning</edux-button>
<edux-button variant="danger" outline>Danger</edux-button>
```

```jsx:react
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton variant="default" outline>
      Default
    </EduxButton>
    <EduxButton variant="neutral" outline>
      Neutral
    </EduxButton>    
    <EduxButton variant="success" outline>
      Success
    </EduxButton>
    <EduxButton variant="warning" outline>
      Warning
    </EduxButton>
    <EduxButton variant="danger" outline>
      Danger
    </EduxButton>
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
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

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
<edux-button variant="text" size="small">Text</edux-button>
<edux-button variant="text" size="medium">Text</edux-button>
<edux-button variant="text" size="large">Text</edux-button>
```

```jsx:react
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton variant="text" size="small">
      Text
    </EduxButton>
    <EduxButton variant="text" size="medium">
      Text
    </EduxButton>
    <EduxButton variant="text" size="large">
      Text
    </EduxButton>
  </>
);
```

### Page Link Buttons

Use the `pagelink` variant to create text buttons that use bold text and a red circled arrow icon to indicate navigation to a new page. Links to external content (outside NASA.gov) will render an arrow pointing to the upper right to indicate that the user will be leaving the NASA site.

```html:preview
<edux-button variant="pagelink" href="https://example.com/" target="_blank" size="small">Explore</edux-button>
<edux-button variant="pagelink" href="https://nasa.gov/" size="medium">Explore</edux-button>
<edux-button variant="pagelink" href="https://example.com/" target="_blank" size="large">Explore</edux-button>
```

### Link Buttons

It's often helpful to have a button that works like a link. This is possible by setting the `href` attribute, which will make the component render an `<a>` under the hood. This gives you all the default link behavior the browser provides (e.g. [[CMD/CTRL/SHIFT]] + [[CLICK]]) and exposes the `target` and `download` attributes.

```html:preview
<edux-button href="https://example.com/">Link</edux-button>
<edux-button href="https://example.com/" target="_blank">New Window</edux-button>
<edux-button href="/assets/images/wordmark.svg" download="shoelace.svg">Download</edux-button>
<edux-button href="https://example.com/" disabled>Disabled</edux-button>
```

```jsx:react
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton href="https://example.com/">Link</EduxButton>
    <EduxButton href="https://example.com/" target="_blank">
      New Window
    </EduxButton>
    <EduxButton href="/assets/images/wordmark.svg" download="shoelace.svg">
      Download
    </EduxButton>
    <EduxButton href="https://example.com/" disabled>
      Disabled
    </EduxButton>
  </>
);
```

:::tip
When a `target` is set, the link will receive `rel="noreferrer noopener"` for [security reasons](https://mathiasbynens.github.io/rel-noopener/).
:::

### Setting a Custom Width

As expected, buttons can be given a custom width by passing inline styles to the component (or using a class). This is useful for making buttons span the full width of their container on smaller screens.

```html:preview
<edux-button variant="default" size="small" style="width: 100%; margin-bottom: 1rem;">Small</edux-button>
<edux-button variant="default" size="medium" style="width: 100%; margin-bottom: 1rem;">Medium</edux-button>
<edux-button variant="default" size="large" style="width: 100%;">Large</edux-button>
```

{% raw %}

```jsx:react
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton variant="default" size="small" style={{ width: '100%', marginBottom: '1rem' }}>
      Small
    </EduxButton>
    <EduxButton variant="default" size="medium" style={{ width: '100%', marginBottom: '1rem' }}>
      Medium
    </EduxButton>
    <EduxButton variant="default" size="large" style={{ width: '100%' }}>
      Large
    </EduxButton>
  </>
);
```

{% endraw %}

### Prefix and Suffix Icons

TODO

### Caret

Use the `caret` attribute to add a dropdown indicator when a button will trigger a dropdown, menu, or popover.

```html:preview
<edux-button size="small" caret>Small</edux-button>
<edux-button size="medium" caret>Medium</edux-button>
<edux-button size="large" caret>Large</edux-button>
```

```jsx:react
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton size="small" caret>
      Small
    </EduxButton>
    <EduxButton size="medium" caret>
      Medium
    </EduxButton>
    <EduxButton size="large" caret>
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
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton variant="default" loading>
      Default
    </EduxButton>
    <EduxButton variant="success" loading>
      Success
    </EduxButton>
    <EduxButton variant="warning" loading>
      Warning
    </EduxButton>
    <EduxButton variant="danger" loading>
      Danger
    </EduxButton>
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
import EduxButton from '@shoelace-style/shoelace/dist/react/button';

const App = () => (
  <>
    <EduxButton variant="default" disabled>
      Default
    </EduxButton>

    <EduxButton variant="success" disabled>
      Success
    </EduxButton>

    <EduxButton variant="warning" disabled>
      Warning
    </EduxButton>

    <EduxButton variant="danger" disabled>
      Danger
    </EduxButton>
  </>
);
```

### Styling Buttons

This example demonstrates how to style buttons using a custom class. This is the recommended approach if you need to add additional variations. To customize an existing variation, modify the selector to target the button's `variant` attribute instead of a class (e.g. `edux-button[variant="primary"]`).

```html:preview
<edux-button class="pink">Pink Button</edux-button>

<style>
  edux-button.pink::part(base) {
    /* Set design tokens for height and border width */
    --edux-input-height-medium: 48px;
    --edux-input-border-width: 4px;

    border-radius: 0;
    background-color: #ff1493;
    border-top-color: #ff7ac1;
    border-left-color: #ff7ac1;
    border-bottom-color: #ad005c;
    border-right-color: #ad005c;
    color: white;
    font-size: 1.125rem;
    box-shadow: 0 2px 10px #0002;
    transition: var(--edux-transition-medium) transform ease, var(--edux-transition-medium) border ease;
  }

  edux-button.pink::part(base):hover {
    transform: scale(1.05) rotate(-1deg);
  }

  edux-button.pink::part(base):active {
    border-top-color: #ad005c;
    border-right-color: #ff7ac1;
    border-bottom-color: #ff7ac1;
    border-left-color: #ad005c;
    transform: scale(1.05) rotate(-1deg) translateY(2px);
  }

  edux-button.pink::part(base):focus-visible {
    outline: dashed 2px deeppink;
    outline-offset: 4px;
  }
</style>
```
