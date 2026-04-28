---
meta:
    title: Tooltip
    description: Tooltips display brief contextual help, while popovers show richer supporting content.
layout: component
---

## Tooltip

Tooltips display informative text when users hover or focus on an element. They are best suited for short, inline help in dense UIs.

-   The tooltip’s **target is its first child element**, so you should only wrap one element inside each tooltip. If you need a tooltip for multiple elements, wrap them in a container and apply the tooltip to that container.
-   `terra-tooltip` uses **`display: contents`**, so it won’t affect layout in flex or grid containers.

```html:preview
<terra-tooltip content="More information about this action">
  <terra-button>Hover or focus me</terra-button>
</terra-tooltip>
```

### Placement

Use the `placement` attribute to set the preferred placement of the tooltip.

```html:preview
<div class="tooltip-placement-example">
  <div class="tooltip-placement-example-row">
    <terra-tooltip content="top-start" placement="top-start">
      <terra-button></terra-button>
    </terra-tooltip>
    <terra-tooltip content="top" placement="top">
      <terra-button></terra-button>
    </terra-tooltip>
    <terra-tooltip content="top-end" placement="top-end">
      <terra-button></terra-button>
    </terra-tooltip>
  </div>

  <div class="tooltip-placement-example-row">
    <terra-tooltip content="left-start" placement="left-start">
      <terra-button></terra-button>
    </terra-tooltip>
    <terra-tooltip content="right-start" placement="right-start">
      <terra-button></terra-button>
    </terra-tooltip>
  </div>

  <div class="tooltip-placement-example-row">
    <terra-tooltip content="left" placement="left">
      <terra-button></terra-button>
    </terra-tooltip>
    <terra-tooltip content="right" placement="right">
      <terra-button></terra-button>
    </terra-tooltip>
  </div>

  <div class="tooltip-placement-example-row">
    <terra-tooltip content="left-end" placement="left-end">
      <terra-button></terra-button>
    </terra-tooltip>
    <terra-tooltip content="right-end" placement="right-end">
      <terra-button></terra-button>
    </terra-tooltip>
  </div>

  <div class="tooltip-placement-example-row">
    <terra-tooltip content="bottom-start" placement="bottom-start">
      <terra-button></terra-button>
    </terra-tooltip>
    <terra-tooltip content="bottom" placement="bottom">
      <terra-button></terra-button>
    </terra-tooltip>
    <terra-tooltip content="bottom-end" placement="bottom-end">
      <terra-button></terra-button>
    </terra-tooltip>
  </div>
</div>

<style>
  .tooltip-placement-example {
    width: 250px;
    margin: 1rem;
  }

  .tooltip-placement-example-row::after {
    content: '';
    display: table;
    clear: both;
  }

  .tooltip-placement-example terra-button {
    float: left;
    width: 2.5rem;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .tooltip-placement-example-row:nth-child(1) terra-tooltip:first-child terra-button,
  .tooltip-placement-example-row:nth-child(5) terra-tooltip:first-child terra-button {
    margin-left: calc(40px + 0.25rem);
  }

  .tooltip-placement-example-row:nth-child(2) terra-tooltip:nth-child(2) terra-button,
  .tooltip-placement-example-row:nth-child(3) terra-tooltip:nth-child(2) terra-button,
  .tooltip-placement-example-row:nth-child(4) terra-tooltip:nth-child(2) terra-button {
    margin-left: calc((40px * 3) + (0.25rem * 3));
  }
</style>
```

### Click trigger

Set the `trigger` attribute to `click` to toggle the tooltip on click instead of hover.

```html:preview
<terra-tooltip content="Click again to dismiss" trigger="click">
  <terra-button>Click to toggle</terra-button>
</terra-tooltip>
```

### Manual trigger

Tooltips can be controlled programmatically by setting the `trigger` attribute to `manual`. Use the `open` property to control when the tooltip is shown.

```html:preview
<terra-button id="tooltip-toggle" style="margin-right: 4rem;">Toggle manually</terra-button>

<terra-tooltip
  id="manual-tooltip"
  content="This is an avatar"
  trigger="manual"
  style="vertical-align: middle;"
>
  <terra-avatar initials="AB"></terra-avatar>
</terra-tooltip>

<script type="module">
  const tooltip = document.querySelector('#manual-tooltip');
  const toggle = document.querySelector('#tooltip-toggle');

  toggle.addEventListener('click', () => {
    tooltip.open = !tooltip.open;
  });
</script>
```

### Removing arrows

You can control the size of tooltip arrows by overriding the `--terra-tooltip-arrow-size` design token. To remove them, set the value to `0` as shown below.

```html:preview
<terra-tooltip content="This is a tooltip" style="--terra-tooltip-arrow-size: 0;">
  <terra-button>No arrow</terra-button>
</terra-tooltip>
```

To override it globally, set it in a root block in your stylesheet:

```css
:root {
    --terra-tooltip-arrow-size: 0;
}
```

### HTML in tooltips

Use the `content` slot to create tooltips with HTML content. Tooltips are designed only for text and presentational elements. **Avoid placing interactive content** such as buttons, links, and form controls in a tooltip; use a popover instead.

```html:preview
<terra-tooltip>
  <div slot="content">
    I'm not <strong>just</strong> a tooltip, I'm a <em>tooltip</em> with HTML!
  </div>
  <terra-button>Hover me</terra-button>
</terra-tooltip>
```

### Maximum width

Use the `--max-width` custom property to change how wide a tooltip can grow before wrapping.

```html:preview
<terra-tooltip
  style="--max-width: 80px;"
  content="This tooltip will wrap after only 80 pixels."
>
  <terra-button>Hover me</terra-button>
</terra-tooltip>
```

### Hoisting

Tooltips will be clipped if they're inside a container that has `overflow: auto|hidden|scroll`. The `hoist` attribute forces the tooltip to use a fixed positioning strategy, allowing it to break out of the container.

```html:preview
<div class="tooltip-hoist">
  <terra-tooltip content="This is a tooltip">
    <terra-button>No hoist</terra-button>
  </terra-tooltip>

  <terra-tooltip content="This is a tooltip" hoist>
    <terra-button>Hoist</terra-button>
  </terra-tooltip>
</div>

<style>
  .tooltip-hoist {
    position: relative;
    border: solid 2px var(--terra-panel-border-color);
    overflow: hidden;
    padding: var(--terra-spacing-medium);
  }
</style>
```

## Popover

Popovers are larger panels that can contain additional text, images, or links. Use a popover when you need more supporting content than a tooltip can provide, or when you need interactive content such as “Learn more” links.

```html:preview
<terra-tooltip variant="popover" trigger="click">
  <terra-button>More Details</terra-button>
  <img
      slot="image"
      src="https://images.unsplash.com/photo-1541873676-a18131494184?w=800"
      alt="Astronaut"
    >
  <div slot="content">
    <h3 style="margin-top: 0; margin-bottom: 0.5rem;">Astronaut Candidate Kayla Barron</h3>
    <p style="margin: 0 0 0.5rem;">
      NASA astronaut candidate Kayla Barron is seen after donning her spacesuit at NASA's Johnson Space Center in Houston, Texas.
    </p>
    <p style="margin: 0 0 0.75rem;"><strong>Credits:</strong> NASA/Bill Ingalls</p>
    <a href="#" style="font-weight: 600; text-decoration: underline dotted;">More Details</a>
  </div>
</terra-tooltip>
```

[component-metadata:terra-tooltip]
