---
meta:
  title: Resize Observer
  description: The Resize Observer component offers a thin, declarative interface to the ResizeObserver API.
layout: component
---

The resize observer will report changes to the dimensions of the elements it wraps through the `gd-resize` event. When emitted, a collection of [`ResizeObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry) objects will be attached to `event.detail` that contains the target element and information about its dimensions.

```html:preview
<div class="resize-observer-overview">
  <gd-resize-observer>
    <div>Resize this box and watch the console 👉</div>
  </gd-resize-observer>
</div>

<script>
  const container = document.querySelector('.resize-observer-overview');
  const resizeObserver = container.querySelector('gd-resize-observer');

  resizeObserver.addEventListener('gd-resize', event => {
    console.log(event.detail);
  });
</script>

<style>
  .resize-observer-overview div {
    display: flex;
    border: solid 2px var(--gd-input-border-color);
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 2rem;
  }
</style>
```

```jsx:react
import SlResizeObserver from '@gesdisc/components/dist/react/resize-observer';

const css = `
  .resize-observer-overview div {
    display: flex;
    border: solid 2px var(--gd-input-border-color);
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 2rem;
  }
`;

const App = () => (
  <>
    <div className="resize-observer-overview">
      <SlResizeObserver onSlResize={event => console.log(event.detail)}>
        <div>Resize this box and watch the console 👉</div>
      </SlResizeObserver>
    </div>

    <style>{css}</style>
  </>
);
```
