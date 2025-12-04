---
meta:
    title: Badge
    description: Badges are used to draw attention and display statuses or counts.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-badge>Badge</terra-badge>
```

```jsx:react
import TerraBadge from '@nasa-terra/components/dist/react/badge';

const App = () => <TerraBadge>Badge</TerraBadge>;
```

## Examples

### Variants

Set the `variant` attribute to change the badge's variant.

```html:preview
<terra-badge variant="primary">Primary</terra-badge>
<terra-badge variant="success">Success</terra-badge>
<terra-badge variant="neutral">Neutral</terra-badge>
<terra-badge variant="warning">Warning</terra-badge>
<terra-badge variant="danger">Danger</terra-badge>
```

```jsx:react
import TerraBadge from '@nasa-terra/components/dist/react/badge';

const App = () => (
  <>
    <TerraBadge variant="primary">Primary</TerraBadge>
    <TerraBadge variant="success">Success</TerraBadge>
    <TerraBadge variant="neutral">Neutral</TerraBadge>
    <TerraBadge variant="warning">Warning</TerraBadge>
    <TerraBadge variant="danger">Danger</TerraBadge>
  </>
);
```

### Pill Badges

Use the `pill` attribute to give badges rounded edges.

```html:preview
<terra-badge variant="primary" pill>Primary</terra-badge>
<terra-badge variant="success" pill>Success</terra-badge>
<terra-badge variant="neutral" pill>Neutral</terra-badge>
<terra-badge variant="warning" pill>Warning</terra-badge>
<terra-badge variant="danger" pill>Danger</terra-badge>
```

```jsx:react
import TerraBadge from '@nasa-terra/components/dist/react/badge';

const App = () => (
  <>
    <TerraBadge variant="primary" pill>
      Primary
    </TerraBadge>
    <TerraBadge variant="success" pill>
      Success
    </TerraBadge>
    <TerraBadge variant="neutral" pill>
      Neutral
    </TerraBadge>
    <TerraBadge variant="warning" pill>
      Warning
    </TerraBadge>
    <TerraBadge variant="danger" pill>
      Danger
    </TerraBadge>
  </>
);
```

### Pulsating Badges

Use the `pulse` attribute to draw attention to the badge with a subtle animation.

```html:preview
<div class="badge-pulse">
  <terra-badge variant="primary" pill pulse>1</terra-badge>
  <terra-badge variant="success" pill pulse>1</terra-badge>
  <terra-badge variant="neutral" pill pulse>1</terra-badge>
  <terra-badge variant="warning" pill pulse>1</terra-badge>
  <terra-badge variant="danger" pill pulse>1</terra-badge>
</div>

<style>
  .badge-pulse terra-badge:not(:last-of-type) {
    margin-right: 1rem;
  }
</style>
```

```jsx:react
import TerraBadge from '@nasa-terra/components/dist/react/badge';

const css = `
  .badge-pulse terra-badge:not(:last-of-type) {
    margin-right: 1rem;
  }
`;

const App = () => (
  <>
    <div className="badge-pulse">
      <TerraBadge variant="primary" pill pulse>
        1
      </TerraBadge>
      <TerraBadge variant="success" pill pulse>
        1
      </TerraBadge>
      <TerraBadge variant="neutral" pill pulse>
        1
      </TerraBadge>
      <TerraBadge variant="warning" pill pulse>
        1
      </TerraBadge>
      <TerraBadge variant="danger" pill pulse>
        1
      </TerraBadge>
    </div>

    <style>{css}</style>
  </>
);
```

### With Buttons

One of the most common use cases for badges is attaching them to buttons. To make this easier, badges will be automatically positioned at the top-right when they're a child of a button.

```html:preview
<terra-button>
  Requests
  <terra-badge pill>30</terra-badge>
</terra-button>

<terra-button style="margin-inline-start: 1rem;">
  Warnings
  <terra-badge variant="warning" pill>8</terra-badge>
</terra-button>

<terra-button style="margin-inline-start: 1rem;">
  Errors
  <terra-badge variant="danger" pill>6</terra-badge>
</terra-button>
```

{% raw %}

```jsx:react
import TerraBadge from '@nasa-terra/components/dist/react/badge';
import TerraButton from '@nasa-terra/components/dist/react/button';

const App = () => (
  <>
    <TerraButton>
      Requests
      <TerraBadge pill>30</TerraBadge>
    </TerraButton>

    <TerraButton style={{ marginInlineStart: '1rem' }}>
      Warnings
      <TerraBadge variant="warning" pill>
        8
      </TerraBadge>
    </TerraButton>

    <TerraButton style={{ marginInlineStart: '1rem' }}>
      Errors
      <TerraBadge variant="danger" pill>
        6
      </TerraBadge>
    </TerraButton>
  </>
);
```

{% endraw %}

### With Menu Items

When including badges in menu items, use the `suffix` slot to make sure they're aligned correctly.

```html:preview
<terra-menu style="max-width: 240px;">
  <terra-menu-label>Messages</terra-menu-label>
  <terra-menu-item>Comments <terra-badge slot="suffix" variant="neutral" pill>4</terra-badge></terra-menu-item>
  <terra-menu-item>Replies <terra-badge slot="suffix" variant="neutral" pill>12</terra-badge></terra-menu-item>
</terra-menu>
```

{% raw %}

```jsx:react
import TerraBadge from '@nasa-terra/components/dist/react/badge';
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraMenu from '@nasa-terra/components/dist/react/menu';
import TerraMenuItem from '@nasa-terra/components/dist/react/menu-item';
import TerraMenuLabel from '@nasa-terra/components/dist/react/menu-label';

const App = () => (
  <TerraMenu
    style={{
      maxWidth: '240px',
      border: 'solid 1px var(--terra-panel-border-color)',
      borderRadius: 'var(--terra-border-radius-medium)'
    }}
  >
    <TerraMenuLabel>Messages</TerraMenuLabel>
    <TerraMenuItem>
      Comments
      <TerraBadge slot="suffix" variant="neutral" pill>
        4
      </TerraBadge>
    </TerraMenuItem>
    <TerraMenuItem>
      Replies
      <TerraBadge slot="suffix" variant="neutral" pill>
        12
      </TerraBadge>
    </TerraMenuItem>
  </TerraMenu>
);
```

{% endraw %}
