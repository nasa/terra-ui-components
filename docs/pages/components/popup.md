---
meta:
    title: Popup
    description: Popup is a utility that lets you declaratively anchor "popup" containers to another element.
layout: component
---

# Popup

Popup is a utility component that lets you declaratively anchor "popup" containers to another element. It uses Floating UI under the hood to handle positioning, flipping, shifting, and more.

## Examples

### Basic Popup (click to toggle)

A simple popup anchored to a button. This example shows how to toggle the popup's `active` state when the anchor is clicked.

```html:preview
<terra-popup id="basic-popup">
  <terra-button id="basic-popup-anchor" slot="anchor">Toggle popup</terra-button>
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This is a popup!
  </div>
</terra-popup>

<script type="module">
  const popup = document.querySelector('#basic-popup');
  const anchor = document.querySelector('#basic-popup-anchor');

  anchor.addEventListener('click', () => {
    popup.active = !popup.active;
  });
</script>
```

### Placement

The `placement` attribute controls where the popup appears relative to its anchor.

```html:preview
<div style="display: flex; gap: 1rem; flex-wrap: wrap; padding: 2rem;">
  <terra-popup id="popup-top" placement="top">
    <terra-button id="popup-top-anchor" slot="anchor">Top</terra-button>
    <div style="padding: 0.5rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">Popup</div>
  </terra-popup>

  <terra-popup id="popup-bottom" placement="bottom">
    <terra-button id="popup-bottom-anchor" slot="anchor">Bottom</terra-button>
    <div style="padding: 0.5rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">Popup</div>
  </terra-popup>

  <terra-popup id="popup-left" placement="left">
    <terra-button id="popup-left-anchor" slot="anchor">Left</terra-button>
    <div style="padding: 0.5rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">Popup</div>
  </terra-popup>

  <terra-popup id="popup-right" placement="right">
    <terra-button id="popup-right-anchor" slot="anchor">Right</terra-button>
    <div style="padding: 0.5rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">Popup</div>
  </terra-popup>
</div>

<script type="module">
  function wirePopup(idPrefix) {
    const popup = document.querySelector(`#popup-${idPrefix}`);
    const anchor = document.querySelector(`#popup-${idPrefix}-anchor`);
    if (popup && anchor) {
      anchor.addEventListener('click', () => {
        popup.active = !popup.active;
      });
    }
  }

  ['top', 'bottom', 'left', 'right'].forEach(wirePopup);
</script>
```

### Distance and Skidding

Use the `distance` attribute to set the distance between the anchor and popup, and `skidding` to offset along the anchor.

```html:preview
<terra-popup id="distance-popup" distance="20" skidding="10">
  <terra-button id="distance-popup-anchor" slot="anchor">With Distance</terra-button>
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This popup has distance and skidding applied.
  </div>
</terra-popup>

<script type="module">
  const distancePopup = document.querySelector('#distance-popup');
  const distanceAnchor = document.querySelector('#distance-popup-anchor');

  distanceAnchor?.addEventListener('click', () => {
    distancePopup.active = !distancePopup.active;
  });
</script>
```

### Flip and Shift

Use the `flip` attribute to automatically flip the popup to the opposite side when it doesn't fit, and `shift` to move it along the axis to keep it in view.

```html:preview
<div style="display: flex; gap: 1rem; padding: 2rem;">
  <terra-popup id="flip-popup" placement="top" flip>
    <terra-button id="flip-popup-anchor" slot="anchor">Flip Enabled</terra-button>
    <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
      This will flip to bottom if there's no space above.
    </div>
  </terra-popup>

  <terra-popup id="shift-popup" placement="right" shift>
    <terra-button id="shift-popup-anchor" slot="anchor">Shift Enabled</terra-button>
    <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
      This will shift to stay in view.
    </div>
  </terra-popup>
</div>

<script type="module">
  [['flip-popup', 'flip-popup-anchor'], ['shift-popup', 'shift-popup-anchor']].forEach(
    ([popupId, anchorId]) => {
      const popup = document.querySelector(`#${popupId}`);
      const anchor = document.querySelector(`#${anchorId}`);
      if (popup && anchor) {
        anchor.addEventListener('click', () => {
          popup.active = !popup.active;
        });
      }
    }
  );
</script>
```

### Arrow

Add an arrow to the popup using the `arrow` attribute.

```html:preview
<terra-popup id="arrow-popup" arrow>
  <terra-button id="arrow-popup-anchor" slot="anchor">With Arrow</terra-button>
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This popup has an arrow pointing to the anchor.
  </div>
</terra-popup>

<script type="module">
  const arrowPopup = document.querySelector('#arrow-popup');
  const arrowAnchor = document.querySelector('#arrow-popup-anchor');

  arrowAnchor?.addEventListener('click', () => {
    arrowPopup.active = !arrowPopup.active;
  });
</script>
```

### Auto Size

Use the `auto-size` attribute to automatically resize the popup to prevent overflow.

```html:preview
<terra-popup id="auto-size-popup" auto-size="vertical" style="max-width: 200px;">
  <terra-button id="auto-size-popup-anchor" slot="anchor">Auto Size</terra-button>
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This popup will automatically resize vertically to fit in the viewport.
  </div>
</terra-popup>

<script type="module">
  const autoSizePopup = document.querySelector('#auto-size-popup');
  const autoSizeAnchor = document.querySelector('#auto-size-popup-anchor');

  autoSizeAnchor?.addEventListener('click', () => {
    autoSizePopup.active = !autoSizePopup.active;
  });
</script>
```

### Sync Width/Height

Use the `sync` attribute to match the popup's width or height to the anchor element.

```html:preview
<terra-popup id="sync-popup" sync="width">
  <terra-button id="sync-popup-anchor" slot="anchor" style="width: 200px;">Sync Width</terra-button>
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This popup's width matches the button.
  </div>
</terra-popup>

<script type="module">
  const syncPopup = document.querySelector('#sync-popup');
  const syncAnchor = document.querySelector('#sync-popup-anchor');

  syncAnchor?.addEventListener('click', () => {
    syncPopup.active = !syncPopup.active;
  });
</script>
```

### Fixed Strategy

Use the `strategy="fixed"` attribute when the popup needs to escape overflow containers.

```html:preview
<div style="height: 200px; overflow: auto; border: 1px solid var(--terra-color-carbon-20); padding: 1rem;">
  <p>Scroll down to see the popup...</p>
  <div style="height: 300px;"></div>
  <terra-popup id="fixed-popup" strategy="fixed">
    <terra-button id="fixed-popup-anchor" slot="anchor">Fixed Strategy</terra-button>
    <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
      This popup uses fixed positioning to escape the overflow container.
    </div>
  </terra-popup>
</div>

<script type="module">
  const fixedPopup = document.querySelector('#fixed-popup');
  const fixedAnchor = document.querySelector('#fixed-popup-anchor');

  fixedAnchor?.addEventListener('click', () => {
    fixedPopup.active = !fixedPopup.active;
  });
</script>
```

### External Anchor

You can anchor the popup to an element outside of it using the `anchor` attribute.

```html:preview
<terra-button id="external-anchor">External Anchor</terra-button>
<terra-popup id="external-popup" anchor="#external-anchor">
  <div style="padding: 1rem; background: white; border: 1px solid var(--terra-color-carbon-20); border-radius: var(--terra-border-radius-medium);">
    This popup is anchored to the button above.
  </div>
</terra-popup>

<script type="module">
  const externalPopup = document.querySelector('#external-popup');
  const externalAnchor = document.querySelector('#external-anchor');

  externalAnchor?.addEventListener('click', () => {
    externalPopup.active = !externalPopup.active;
  });
</script>
```

[component-metadata:terra-popup]
