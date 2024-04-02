---
meta:
  title: Tooltip
  description: Tooltips display additional information based on a specific action.
layout: component
---

A tooltip's target is its _first child element_, so you should only wrap one element inside of the tooltip. If you need the tooltip to show up for multiple elements, nest them inside a container first.

Tooltips use `display: contents` so they won't interfere with how elements are positioned in a flex or grid layout.

```html:preview
<gd-tooltip content="This is a tooltip">
  <gd-button>Hover Me</gd-button>
</gd-tooltip>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlTooltip from '@gesdisc/components/dist/react/tooltip';

const App = () => (
  <SlTooltip content="This is a tooltip">
    <SlButton>Hover Me</SlButton>
  </SlTooltip>
);
```

## Examples

### Placement

Use the `placement` attribute to set the preferred placement of the tooltip.

```html:preview
<div class="tooltip-placement-example">
  <div class="tooltip-placement-example-row">
    <gd-tooltip content="top-start" placement="top-start">
      <gd-button></gd-button>
    </gd-tooltip>

    <gd-tooltip content="top" placement="top">
      <gd-button></gd-button>
    </gd-tooltip>

    <gd-tooltip content="top-end" placement="top-end">
      <gd-button></gd-button>
    </gd-tooltip>
  </div>

  <div class="tooltip-placement-example-row">
    <gd-tooltip content="left-start" placement="left-start">
      <gd-button></gd-button>
    </gd-tooltip>

    <gd-tooltip content="right-start" placement="right-start">
      <gd-button></gd-button>
    </gd-tooltip>
  </div>

  <div class="tooltip-placement-example-row">
    <gd-tooltip content="left" placement="left">
      <gd-button></gd-button>
    </gd-tooltip>

    <gd-tooltip content="right" placement="right">
      <gd-button></gd-button>
    </gd-tooltip>
  </div>

  <div class="tooltip-placement-example-row">
    <gd-tooltip content="left-end" placement="left-end">
      <gd-button></gd-button>
    </gd-tooltip>

    <gd-tooltip content="right-end" placement="right-end">
      <gd-button></gd-button>
    </gd-tooltip>
  </div>

  <div class="tooltip-placement-example-row">
    <gd-tooltip content="bottom-start" placement="bottom-start">
      <gd-button></gd-button>
    </gd-tooltip>

    <gd-tooltip content="bottom" placement="bottom">
      <gd-button></gd-button>
    </gd-tooltip>

    <gd-tooltip content="bottom-end" placement="bottom-end">
      <gd-button></gd-button>
    </gd-tooltip>
  </div>
</div>

<style>
  .tooltip-placement-example {
    width: 250px;
    margin: 1rem;
  }

  .tooltip-placement-example-row:after {
    content: '';
    display: table;
    clear: both;
  }

  .tooltip-placement-example gd-button {
    float: left;
    width: 2.5rem;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .tooltip-placement-example-row:nth-child(1) gd-tooltip:first-child gd-button,
  .tooltip-placement-example-row:nth-child(5) gd-tooltip:first-child gd-button {
    margin-left: calc(40px + 0.25rem);
  }

  .tooltip-placement-example-row:nth-child(2) gd-tooltip:nth-child(2) gd-button,
  .tooltip-placement-example-row:nth-child(3) gd-tooltip:nth-child(2) gd-button,
  .tooltip-placement-example-row:nth-child(4) gd-tooltip:nth-child(2) gd-button {
    margin-left: calc((40px * 3) + (0.25rem * 3));
  }
</style>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlTooltip from '@gesdisc/components/dist/react/tooltip';

const css = `
  .tooltip-placement-example {
    width: 250px;
  }

  .tooltip-placement-example-row:after {
    content: '';
    display: table;
    clear: both;
  }

  .tooltip-placement-example gd-button {
    float: left;
    width: 2.5rem;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .tooltip-placement-example-row:nth-child(1) gd-tooltip:first-child gd-button,
  .tooltip-placement-example-row:nth-child(5) gd-tooltip:first-child gd-button {
    margin-left: calc(40px + 0.25rem);
  }

  .tooltip-placement-example-row:nth-child(2) gd-tooltip:nth-child(2) gd-button,
  .tooltip-placement-example-row:nth-child(3) gd-tooltip:nth-child(2) gd-button,
  .tooltip-placement-example-row:nth-child(4) gd-tooltip:nth-child(2) gd-button {
    margin-left: calc((40px * 3) + (0.25rem * 3));
  }
`;

const App = () => (
  <>
    <div className="tooltip-placement-example">
      <div className="tooltip-placement-example-row">
        <SlTooltip content="top-start" placement="top-start">
          <SlButton />
        </SlTooltip>

        <SlTooltip content="top" placement="top">
          <SlButton />
        </SlTooltip>

        <SlTooltip content="top-end" placement="top-end">
          <SlButton />
        </SlTooltip>
      </div>

      <div className="tooltip-placement-example-row">
        <SlTooltip content="left-start" placement="left-start">
          <SlButton />
        </SlTooltip>

        <SlTooltip content="right-start" placement="right-start">
          <SlButton />
        </SlTooltip>
      </div>

      <div className="tooltip-placement-example-row">
        <SlTooltip content="left" placement="left">
          <SlButton />
        </SlTooltip>

        <SlTooltip content="right" placement="right">
          <SlButton />
        </SlTooltip>
      </div>

      <div className="tooltip-placement-example-row">
        <SlTooltip content="left-end" placement="left-end">
          <SlButton />
        </SlTooltip>

        <SlTooltip content="right-end" placement="right-end">
          <SlButton />
        </SlTooltip>
      </div>

      <div className="tooltip-placement-example-row">
        <SlTooltip content="bottom-start" placement="bottom-start">
          <SlButton />
        </SlTooltip>

        <SlTooltip content="bottom" placement="bottom">
          <SlButton />
        </SlTooltip>

        <SlTooltip content="bottom-end" placement="bottom-end">
          <SlButton />
        </SlTooltip>
      </div>
    </div>

    <style>{css}</style>
  </>
);
```

### Click Trigger

Set the `trigger` attribute to `click` to toggle the tooltip on click instead of hover.

```html:preview
<gd-tooltip content="Click again to dismiss" trigger="click">
  <gd-button>Click to Toggle</gd-button>
</gd-tooltip>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlTooltip from '@gesdisc/components/dist/react/tooltip';

const App = () => (
  <SlTooltip content="Click again to dismiss" trigger="click">
    <SlButton>Click to Toggle</SlButton>
  </SlTooltip>
);
```

### Manual Trigger

Tooltips can be controlled programmatically by setting the `trigger` attribute to `manual`. Use the `open` attribute to control when the tooltip is shown.

```html:preview
<gd-button style="margin-right: 4rem;">Toggle Manually</gd-button>

<gd-tooltip content="This is an avatar" trigger="manual" class="manual-tooltip">
  <gd-avatar label="User"></gd-avatar>
</gd-tooltip>

<script>
  const tooltip = document.querySelector('.manual-tooltip');
  const toggle = tooltip.previousElementSibling;

  toggle.addEventListener('click', () => (tooltip.open = !tooltip.open));
</script>
```

{% raw %}

```jsx:react
import { useState } from 'react';
import SlAvatar from '@gesdisc/components/dist/react/avatar';
import SlButton from '@gesdisc/components/dist/react/button';
import SlTooltip from '@gesdisc/components/dist/react/tooltip';

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SlButton style={{ marginRight: '4rem' }} onClick={() => setOpen(!open)}>
        Toggle Manually
      </SlButton>

      <SlTooltip open={open} content="This is an avatar" trigger="manual">
        <SlAvatar />
      </SlTooltip>
    </>
  );
};
```

{% endraw %}

### Removing Arrows

You can control the size of tooltip arrows by overriding the `--gd-tooltip-arrow-size` design token. To remove them, set the value to `0` as shown below.

```html:preview
<gd-tooltip content="This is a tooltip" style="--gd-tooltip-arrow-size: 0;">
  <gd-button>No Arrow</gd-button>
</gd-tooltip>
```

{% raw %}

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlTooltip from '@gesdisc/components/dist/react/tooltip';

const App = () => (
  <div style={{ '--gd-tooltip-arrow-size': '0' }}>
    <SlTooltip content="This is a tooltip">
      <SlButton>Above</SlButton>
    </SlTooltip>

    <SlTooltip content="This is a tooltip" placement="bottom">
      <SlButton>Below</SlButton>
    </SlTooltip>
  </div>
);
```

{% endraw %}

To override it globally, set it in a root block in your stylesheet after the Shoelace stylesheet is loaded.

```css
:root {
  --gd-tooltip-arrow-size: 0;
}
```

### HTML in Tooltips

Use the `content` slot to create tooltips with HTML content. Tooltips are designed only for text and presentational elements. Avoid placing interactive content, such as buttons, links, and form controls, in a tooltip.

```html:preview
<gd-tooltip>
  <div slot="content">I'm not <strong>just</strong> a tooltip, I'm a <em>tooltip</em> with HTML!</div>

  <gd-button>Hover me</gd-button>
</gd-tooltip>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlTooltip from '@gesdisc/components/dist/react/tooltip';

const App = () => (
  <SlTooltip>
    <div slot="content">
      I'm not <strong>just</strong> a tooltip, I'm a <em>tooltip</em> with HTML!
    </div>

    <SlButton>Hover Me</SlButton>
  </SlTooltip>
);
```

### Setting a Maximum Width

Use the `--max-width` custom property to change the width the tooltip can grow to before wrapping occurs.

```html:preview
<gd-tooltip style="--max-width: 80px;" content="This tooltip will wrap after only 80 pixels.">
  <gd-button>Hover me</gd-button>
</gd-tooltip>
```

{% raw %}

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlTooltip from '@gesdisc/components/dist/react/tooltip';

const App = () => (
  <SlTooltip style={{ '--max-width': '80px' }} content="This tooltip will wrap after only 80 pixels.">
    <SlButton>Hover Me</SlButton>
  </SlTooltip>
);
```

{% endraw %}

### Hoisting

Tooltips will be clipped if they're inside a container that has `overflow: auto|hidden|scroll`. The `hoist` attribute forces the tooltip to use a fixed positioning strategy, allowing it to break out of the container. In this case, the tooltip will be positioned relative to its [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#Identifying_the_containing_block), which is usually the viewport unless an ancestor uses a `transform`, `perspective`, or `filter`. [Refer to this page](https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed) for more details.

```html:preview
<div class="tooltip-hoist">
  <gd-tooltip content="This is a tooltip">
    <gd-button>No Hoist</gd-button>
  </gd-tooltip>

  <gd-tooltip content="This is a tooltip" hoist>
    <gd-button>Hoist</gd-button>
  </gd-tooltip>
</div>

<style>
  .tooltip-hoist {
    position: relative;
    border: solid 2px var(--gd-panel-border-color);
    overflow: hidden;
    padding: var(--gd-spacing-medium);
  }
</style>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlTooltip from '@gesdisc/components/dist/react/tooltip';

const css = `
  .tooltip-hoist {
    border: solid 2px var(--gd-panel-border-color);
    overflow: hidden;
    padding: var(--gd-spacing-medium);
    position: relative;
  }
`;

const App = () => (
  <>
    <div class="tooltip-hoist">
      <SlTooltip content="This is a tooltip">
        <SlButton>No Hoist</SlButton>
      </SlTooltip>

      <SlTooltip content="This is a tooltip" hoist>
        <SlButton>Hoist</SlButton>
      </SlTooltip>
    </div>

    <style>{css}</style>
  </>
);
```
