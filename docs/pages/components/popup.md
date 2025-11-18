---
meta:
    title: Popup
    description: Popup is a utility that lets you declaratively anchor "popup" containers to another element.
layout: component
---

# Popup

Popup is a utility component that lets you declaratively anchor "popup" containers to another element. It uses Floating UI under the hood to handle positioning, flipping, shifting, and more.

## Examples

### Basic Popup

A simple popup anchored to a button.

```html:preview
<terra-popup active>
  <terra-button slot="anchor">Hover me</terra-button>
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This is a popup!
  </div>
</terra-popup>
```

### Placement

The `placement` attribute controls where the popup appears relative to its anchor.

```html:preview
<div style="display: flex; gap: 1rem; flex-wrap: wrap; padding: 2rem;">
  <terra-popup active placement="top">
    <terra-button slot="anchor">Top</terra-button>
    <div style="padding: 0.5rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">Popup</div>
  </terra-popup>

  <terra-popup active placement="bottom">
    <terra-button slot="anchor">Bottom</terra-button>
    <div style="padding: 0.5rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">Popup</div>
  </terra-popup>

  <terra-popup active placement="left">
    <terra-button slot="anchor">Left</terra-button>
    <div style="padding: 0.5rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">Popup</div>
  </terra-popup>

  <terra-popup active placement="right">
    <terra-button slot="anchor">Right</terra-button>
    <div style="padding: 0.5rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">Popup</div>
  </terra-popup>
</div>
```

### Distance and Skidding

Use the `distance` attribute to set the distance between the anchor and popup, and `skidding` to offset along the anchor.

```html:preview
<terra-popup active distance="20" skidding="10">
  <terra-button slot="anchor">With Distance</terra-button>
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This popup has distance and skidding applied.
  </div>
</terra-popup>
```

### Flip and Shift

Use the `flip` attribute to automatically flip the popup to the opposite side when it doesn't fit, and `shift` to move it along the axis to keep it in view.

```html:preview
<div style="display: flex; gap: 1rem; padding: 2rem;">
  <terra-popup active placement="top" flip>
    <terra-button slot="anchor">Flip Enabled</terra-button>
    <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
      This will flip to bottom if there's no space above.
    </div>
  </terra-popup>

  <terra-popup active placement="right" shift>
    <terra-button slot="anchor">Shift Enabled</terra-button>
    <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
      This will shift to stay in view.
    </div>
  </terra-popup>
</div>
```

### Arrow

Add an arrow to the popup using the `arrow` attribute.

```html:preview
<terra-popup active arrow>
  <terra-button slot="anchor">With Arrow</terra-button>
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This popup has an arrow pointing to the anchor.
  </div>
</terra-popup>
```

### Auto Size

Use the `auto-size` attribute to automatically resize the popup to prevent overflow.

```html:preview
<terra-popup active auto-size="vertical" style="max-width: 200px;">
  <terra-button slot="anchor">Auto Size</terra-button>
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This popup will automatically resize vertically to fit in the viewport.
  </div>
</terra-popup>
```

### Sync Width/Height

Use the `sync` attribute to match the popup's width or height to the anchor element.

```html:preview
<terra-popup active sync="width">
  <terra-button slot="anchor" style="width: 200px;">Sync Width</terra-button>
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This popup's width matches the button.
  </div>
</terra-popup>
```

### Fixed Strategy

Use the `strategy="fixed"` attribute when the popup needs to escape overflow containers.

```html:preview
<div style="height: 200px; overflow: auto; border: 1px solid var(--terra-color-carbon-20); padding: 1rem;">
  <p>Scroll down to see the popup...</p>
  <div style="height: 300px;"></div>
  <terra-popup active strategy="fixed">
    <terra-button slot="anchor">Fixed Strategy</terra-button>
    <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
      This popup uses fixed positioning to escape the overflow container.
    </div>
  </terra-popup>
</div>
```

### External Anchor

You can anchor the popup to an element outside of it using the `anchor` attribute.

```html:preview
<terra-button id="external-anchor">External Anchor</terra-button>
<terra-popup active anchor="#external-anchor">
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This popup is anchored to the button above.
  </div>
</terra-popup>
```

[component-metadata:terra-popup]
