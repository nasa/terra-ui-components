---
meta:
  title: Badge
  description: Badges are used to draw attention and display statuses or counts.
layout: component
---

```html:preview
<gd-badge>Badge</gd-badge>
```

```jsx:react
import SlBadge from '@gesdisc/components/dist/react/badge';

const App = () => <SlBadge>Badge</SlBadge>;
```

## Examples

### Variants

Set the `variant` attribute to change the badge's variant.

```html:preview
<gd-badge variant="primary">Primary</gd-badge>
<gd-badge variant="success">Success</gd-badge>
<gd-badge variant="neutral">Neutral</gd-badge>
<gd-badge variant="warning">Warning</gd-badge>
<gd-badge variant="danger">Danger</gd-badge>
```

```jsx:react
import SlBadge from '@gesdisc/components/dist/react/badge';

const App = () => (
  <>
    <SlBadge variant="primary">Primary</SlBadge>
    <SlBadge variant="success">Success</SlBadge>
    <SlBadge variant="neutral">Neutral</SlBadge>
    <SlBadge variant="warning">Warning</SlBadge>
    <SlBadge variant="danger">Danger</SlBadge>
  </>
);
```

### Pill Badges

Use the `pill` attribute to give badges rounded edges.

```html:preview
<gd-badge variant="primary" pill>Primary</gd-badge>
<gd-badge variant="success" pill>Success</gd-badge>
<gd-badge variant="neutral" pill>Neutral</gd-badge>
<gd-badge variant="warning" pill>Warning</gd-badge>
<gd-badge variant="danger" pill>Danger</gd-badge>
```

```jsx:react
import SlBadge from '@gesdisc/components/dist/react/badge';

const App = () => (
  <>
    <SlBadge variant="primary" pill>
      Primary
    </SlBadge>
    <SlBadge variant="success" pill>
      Success
    </SlBadge>
    <SlBadge variant="neutral" pill>
      Neutral
    </SlBadge>
    <SlBadge variant="warning" pill>
      Warning
    </SlBadge>
    <SlBadge variant="danger" pill>
      Danger
    </SlBadge>
  </>
);
```

### Pulsating Badges

Use the `pulse` attribute to draw attention to the badge with a subtle animation.

```html:preview
<div class="badge-pulse">
  <gd-badge variant="primary" pill pulse>1</gd-badge>
  <gd-badge variant="success" pill pulse>1</gd-badge>
  <gd-badge variant="neutral" pill pulse>1</gd-badge>
  <gd-badge variant="warning" pill pulse>1</gd-badge>
  <gd-badge variant="danger" pill pulse>1</gd-badge>
</div>

<style>
  .badge-pulse gd-badge:not(:last-of-type) {
    margin-right: 1rem;
  }
</style>
```

```jsx:react
import SlBadge from '@gesdisc/components/dist/react/badge';

const css = `
  .badge-pulse gd-badge:not(:last-of-type) {
    margin-right: 1rem;
  }
`;

const App = () => (
  <>
    <div className="badge-pulse">
      <SlBadge variant="primary" pill pulse>
        1
      </SlBadge>
      <SlBadge variant="success" pill pulse>
        1
      </SlBadge>
      <SlBadge variant="neutral" pill pulse>
        1
      </SlBadge>
      <SlBadge variant="warning" pill pulse>
        1
      </SlBadge>
      <SlBadge variant="danger" pill pulse>
        1
      </SlBadge>
    </div>

    <style>{css}</style>
  </>
);
```

### With Buttons

One of the most common use cases for badges is attaching them to buttons. To make this easier, badges will be automatically positioned at the top-right when they're a child of a button.

```html:preview
<gd-button>
  Requests
  <gd-badge pill>30</gd-badge>
</gd-button>

<gd-button style="margin-inline-start: 1rem;">
  Warnings
  <gd-badge variant="warning" pill>8</gd-badge>
</gd-button>

<gd-button style="margin-inline-start: 1rem;">
  Errors
  <gd-badge variant="danger" pill>6</gd-badge>
</gd-button>
```

{% raw %}

```jsx:react
import SlBadge from '@gesdisc/components/dist/react/badge';
import SlButton from '@gesdisc/components/dist/react/button';

const App = () => (
  <>
    <SlButton>
      Requests
      <SlBadge pill>30</SlBadge>
    </SlButton>

    <SlButton style={{ marginInlineStart: '1rem' }}>
      Warnings
      <SlBadge variant="warning" pill>
        8
      </SlBadge>
    </SlButton>

    <SlButton style={{ marginInlineStart: '1rem' }}>
      Errors
      <SlBadge variant="danger" pill>
        6
      </SlBadge>
    </SlButton>
  </>
);
```

{% endraw %}

### With Menu Items

When including badges in menu items, use the `suffix` slot to make sure they're aligned correctly.

```html:preview
<gd-menu style="max-width: 240px;">
  <gd-menu-label>Messages</gd-menu-label>
  <gd-menu-item>Comments <gd-badge slot="suffix" variant="neutral" pill>4</gd-badge></gd-menu-item>
  <gd-menu-item>Replies <gd-badge slot="suffix" variant="neutral" pill>12</gd-badge></gd-menu-item>
</gd-menu>
```

{% raw %}

```jsx:react
import SlBadge from '@gesdisc/components/dist/react/badge';
import SlButton from '@gesdisc/components/dist/react/button';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';
import SlMenuLabel from '@gesdisc/components/dist/react/menu-label';

const App = () => (
  <SlMenu
    style={{
      maxWidth: '240px',
      border: 'solid 1px var(--gd-panel-border-color)',
      borderRadius: 'var(--gd-border-radius-medium)'
    }}
  >
    <SlMenuLabel>Messages</SlMenuLabel>
    <SlMenuItem>
      Comments
      <SlBadge slot="suffix" variant="neutral" pill>
        4
      </SlBadge>
    </SlMenuItem>
    <SlMenuItem>
      Replies
      <SlBadge slot="suffix" variant="neutral" pill>
        12
      </SlBadge>
    </SlMenuItem>
  </SlMenu>
);
```

{% endraw %}
