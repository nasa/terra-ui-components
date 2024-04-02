---
meta:
  title: Split Panel
  description: Split panels display two adjacent panels, allowing the user to reposition them.
layout: component
---

```html:preview
<gd-split-panel>
  <div
    slot="start"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    Start
  </div>
  <div
    slot="end"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    End
  </div>
</gd-split-panel>
```

{% raw %}

```jsx:react
import SlSplitPanel from '@gesdisc/components/dist/react/split-panel';

const App = () => (
  <SlSplitPanel>
    <div
      slot="start"
      style={{
        height: '200px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      Start
    </div>
    <div
      slot="end"
      style={{
        height: '200px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      End
    </div>
  </SlSplitPanel>
);
```

{% endraw %}

## Examples

### Initial Position

To set the initial position, use the `position` attribute. If no position is provided, it will default to 50% of the available space.

```html:preview
<gd-split-panel position="75">
  <div
    slot="start"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    Start
  </div>
  <div
    slot="end"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    End
  </div>
</gd-split-panel>
```

### Initial Position in Pixels

To set the initial position in pixels instead of a percentage, use the `position-in-pixels` attribute.

```html:preview
<gd-split-panel position-in-pixels="150">
  <div
    slot="start"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    Start
  </div>
  <div
    slot="end"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    End
  </div>
</gd-split-panel>
```

{% raw %}

```jsx:react
import SlSplitPanel from '@gesdisc/components/dist/react/split-panel';

const App = () => (
  <SlSplitPanel position="200">
    <div
      slot="start"
      style={{
        height: '200px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      Start
    </div>
    <div
      slot="end"
      style={{
        height: '200px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      End
    </div>
  </SlSplitPanel>
);
```

{% endraw %}

### Vertical

Add the `vertical` attribute to render the split panel in a vertical orientation where the start and end panels are stacked. You also need to set a height when using the vertical orientation.

```html:preview
<gd-split-panel vertical style="height: 400px;">
  <div
    slot="start"
    style="height: 100%; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    Start
  </div>
  <div
    slot="end"
    style="height: 100%; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    End
  </div>
</gd-split-panel>
```

{% raw %}

```jsx:react
import SlSplitPanel from '@gesdisc/components/dist/react/split-panel';

const App = () => (
  <SlSplitPanel vertical style={{ height: '400px' }}>
    <div
      slot="start"
      style={{
        height: '100%',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      Start
    </div>
    <div
      slot="end"
      style={{
        height: '100%',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      End
    </div>
  </SlSplitPanel>
);
```

{% endraw %}

### Snapping

To snap panels at specific positions while dragging, add the `snap` attribute with one or more space-separated values. Values must be in pixels or percentages. For example, to snap the panel at `100px` and `50%`, use `snap="100px 50%"`. You can also customize how close the divider must be before snapping with the `snap-threshold` attribute.

```html:preview
<div class="split-panel-snapping">
  <gd-split-panel snap="100px 50%">
    <div
      slot="start"
      style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
    >
      Start
    </div>
    <div
      slot="end"
      style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
    >
      End
    </div>
  </gd-split-panel>

  <div class="split-panel-snapping-dots"></div>
</div>

<style>
  .split-panel-snapping {
    position: relative;
  }

  .split-panel-snapping-dots::before,
  .split-panel-snapping-dots::after {
    content: '';
    position: absolute;
    bottom: -12px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--gd-color-neutral-400);
    transform: translateX(-3px);
  }

  .split-panel-snapping-dots::before {
    left: 100px;
  }

  .split-panel-snapping-dots::after {
    left: 50%;
  }
</style>
```

{% raw %}

```jsx:react
import SlSplitPanel from '@gesdisc/components/dist/react/split-panel';

const css = `
  .split-panel-snapping {
    position: relative;
  }

  .split-panel-snapping-dots::before,
  .split-panel-snapping-dots::after {
    content: '';
    position: absolute;
    bottom: -12px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--gd-color-neutral-400);
    transform: translateX(-3px);
  }

  .split-panel-snapping-dots::before {
    left: 100px;
  }

  .split-panel-snapping-dots::after {
    left: 50%;
  }
`;

const App = () => (
  <>
    <div className="split-panel-snapping">
      <SlSplitPanel snap="100px 50%">
        <div
          slot="start"
          style={{
            height: '200px',
            background: 'var(--gd-color-neutral-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Start
        </div>
        <div
          slot="end"
          style={{
            height: '200px',
            background: 'var(--gd-color-neutral-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          End
        </div>
      </SlSplitPanel>

      <div className="split-panel-snapping-dots" />
    </div>

    <style>{css}</style>
  </>
);
```

{% endraw %}

### Disabled

Add the `disabled` attribute to prevent the divider from being repositioned.

```html:preview
<gd-split-panel disabled>
  <div
    slot="start"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    Start
  </div>
  <div
    slot="end"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    End
  </div>
</gd-split-panel>
```

{% raw %}

```jsx:react
import SlSplitPanel from '@gesdisc/components/dist/react/split-panel';

const App = () => (
  <SlSplitPanel disabled>
    <div
      slot="start"
      style={{
        height: '200px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      Start
    </div>
    <div
      slot="end"
      style={{
        height: '200px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      End
    </div>
  </SlSplitPanel>
);
```

{% endraw %}

### Setting the Primary Panel

By default, both panels will grow or shrink proportionally when the host element is resized. If a primary panel is designated, it will maintain its size and the secondary panel will grow or shrink to fit the remaining space. You can set the primary panel to `start` or `end` using the `primary` attribute.

Try resizing the example below with each option and notice how the panels respond.

```html:preview
<div class="split-panel-primary">
  <gd-split-panel>
    <div
      slot="start"
      style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
    >
      Start
    </div>
    <div
      slot="end"
      style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
    >
      End
    </div>
  </gd-split-panel>

  <gd-select label="Primary Panel" value="" style="max-width: 200px; margin-top: 1rem;">
    <gd-option value="">None</gd-option>
    <gd-option value="start">Start</gd-option>
    <gd-option value="end">End</gd-option>
  </gd-select>
</div>

<script>
  const container = document.querySelector('.split-panel-primary');
  const splitPanel = container.querySelector('gd-split-panel');
  const select = container.querySelector('gd-select');

  select.addEventListener('gd-change', () => (splitPanel.primary = select.value));
</script>
```

{% raw %}

```jsx:react
import { useState } from 'react';
import SlSplitPanel from '@gesdisc/components/dist/react/split-panel';
import SlSelect from '@gesdisc/components/dist/react/select';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => {
  const [primary, setPrimary] = useState('');

  return (
    <>
      <SlSplitPanel primary={primary}>
        <div
          slot="start"
          style={{
            height: '200px',
            background: 'var(--gd-color-neutral-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Start
        </div>
        <div
          slot="end"
          style={{
            height: '200px',
            background: 'var(--gd-color-neutral-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          End
        </div>
      </SlSplitPanel>

      <SlSelect
        label="Primary Panel"
        value={primary}
        style={{ maxWidth: '200px', marginTop: '1rem' }}
        onSlChange={event => setPrimary(event.target.value)}
      >
        <SlMenuItem value="">None</SlMenuItem>
        <SlMenuItem value="start">Start</SlMenuItem>
        <SlMenuItem value="end">End</SlMenuItem>
      </SlSelect>
    </>
  );
};
```

{% endraw %}

### Min & Max

To set a minimum or maximum size of the primary panel, use the `--min` and `--max` custom properties. Since the secondary panel is flexible, size constraints can only be applied to the primary panel. If no primary panel is designated, these constraints will be applied to the `start` panel.

This examples demonstrates how you can ensure both panels are at least 150px using `--min`, `--max`, and the `calc()` function.

```html:preview
<gd-split-panel style="--min: 150px; --max: calc(100% - 150px);">
  <div
    slot="start"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    Start
  </div>
  <div
    slot="end"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    End
  </div>
</gd-split-panel>
```

{% raw %}

```jsx:react
import SlSplitPanel from '@gesdisc/components/dist/react/split-panel';

const App = () => (
  <SlSplitPanel style={{ '--min': '150px', '--max': 'calc(100% - 150px)' }}>
    <div
      slot="start"
      style={{
        height: '200px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      Start
    </div>
    <div
      slot="end"
      style={{
        height: '200px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      End
    </div>
  </SlSplitPanel>
);
```

{% endraw %}

### Nested Split Panels

Create complex layouts that can be repositioned independently by nesting split panels.

```html:preview
<gd-split-panel>
  <div
    slot="start"
    style="height: 400px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden"
  >
    Start
  </div>
  <div slot="end">
    <gd-split-panel vertical style="height: 400px;">
      <div
        slot="start"
        style="height: 100%; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden"
      >
        Top
      </div>
      <div
        slot="end"
        style="height: 100%; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden"
      >
        Bottom
      </div>
    </gd-split-panel>
  </div>
</gd-split-panel>
```

{% raw %}

```jsx:react
import SlSplitPanel from '@gesdisc/components/dist/react/split-panel';

const App = () => (
  <SlSplitPanel>
    <div
      slot="start"
      style={{
        height: '400px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      Start
    </div>
    <div slot="end">
      <SlSplitPanel vertical style={{ height: '400px' }}>
        <div
          slot="start"
          style={{
            height: '100%',
            background: 'var(--gd-color-neutral-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Start
        </div>
        <div
          slot="end"
          style={{
            height: '100%',
            background: 'var(--gd-color-neutral-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          End
        </div>
      </SlSplitPanel>
    </div>
  </SlSplitPanel>
);
```

{% endraw %}

### Customizing the Divider

You can target the `divider` part to apply CSS properties to the divider. To add a custom handle, slot an icon into the `divider` slot. When customizing the divider, make sure to think about focus styles for keyboard users.

```html:preview
<gd-split-panel style="--divider-width: 20px;">
  <gd-icon slot="divider" name="grip-vertical"></gd-icon>
  <div
    slot="start"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    Start
  </div>
  <div
    slot="end"
    style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
  >
    End
  </div>
</gd-split-panel>
```

{% raw %}

```jsx:react
import SlSplitPanel from '@gesdisc/components/dist/react/split-panel';
import SlIcon from '@gesdisc/components/dist/react/icon';

const App = () => (
  <SlSplitPanel style={{ '--divider-width': '20px' }}>
    <SlIcon slot="divider" name="grip-vertical" />
    <div
      slot="start"
      style={{
        height: '200px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      Start
    </div>
    <div
      slot="end"
      style={{
        height: '200px',
        background: 'var(--gd-color-neutral-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      End
    </div>
  </SlSplitPanel>
);
```

{% endraw %}

Here's a more elaborate example that changes the divider's color and width and adds a styled handle.

```html:preview
<div class="split-panel-divider">
  <gd-split-panel>
    <gd-icon slot="divider" name="grip-vertical"></gd-icon>
    <div
      slot="start"
      style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
    >
      Start
    </div>
    <div
      slot="end"
      style="height: 200px; background: var(--gd-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;"
    >
      End
    </div>
  </gd-split-panel>
</div>

<style>
  .split-panel-divider gd-split-panel {
    --divider-width: 2px;
  }

  .split-panel-divider gd-split-panel::part(divider) {
    background-color: var(--gd-color-pink-600);
  }

  .split-panel-divider gd-icon {
    position: absolute;
    border-radius: var(--gd-border-radius-small);
    background: var(--gd-color-pink-600);
    color: var(--gd-color-neutral-0);
    padding: 0.5rem 0.125rem;
  }

  .split-panel-divider gd-split-panel::part(divider):focus-visible {
    background-color: var(--gd-color-primary-600);
  }

  .split-panel-divider gd-split-panel:focus-within gd-icon {
    background-color: var(--gd-color-primary-600);
    color: var(--gd-color-neutral-0);
  }
</style>
```

{% raw %}

```jsx:react
import SlSplitPanel from '@gesdisc/components/dist/react/split-panel';
import SlIcon from '@gesdisc/components/dist/react/icon';

const css = `
  .split-panel-divider gd-split-panel {
    --divider-width: 2px;
  }

  .split-panel-divider gd-split-panel::part(divider) {
    background-color: var(--gd-color-pink-600);
  }

  .split-panel-divider gd-icon {
    position: absolute;
    border-radius: var(--gd-border-radius-small);
    background: var(--gd-color-pink-600);
    color: var(--gd-color-neutral-0);
    padding: .5rem .125rem;
  }

  .split-panel-divider gd-split-panel::part(divider):focus-visible {
    background-color: var(--gd-color-primary-600);
  }

  .split-panel-divider gd-split-panel:focus-within gd-icon {
    background-color: var(--gd-color-primary-600);
    color: var(--gd-color-neutral-0);
  }
`;

const App = () => (
  <>
    <div className="split-panel-divider">
      <SlSplitPanel>
        <SlIcon slot="divider" name="grip-vertical" />
        <div
          slot="start"
          style={{
            height: '200px',
            background: 'var(--gd-color-neutral-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Start
        </div>
        <div
          slot="end"
          style={{
            height: '200px',
            background: 'var(--gd-color-neutral-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          End
        </div>
      </SlSplitPanel>
    </div>

    <style>{css}</style>
  </>
);
```

{% endraw %}
