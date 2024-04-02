---
meta:
  title: Skeleton
  description: Skeletons are used to provide a visual representation of where content will eventually be drawn.
layout: component
---

These are simple containers for scaffolding layouts that mimic what users will see when content has finished loading. This prevents large areas of empty space during asynchronous operations.

Skeletons try not to be opinionated, as there are endless possibilities for designing layouts. Therefore, you'll likely use more than one skeleton to create the effect you want. If you find yourself using them frequently, consider creating a template that renders them with the desired arrangement and styles.

```html:preview
<div class="skeleton-overview">
  <header>
    <gd-skeleton></gd-skeleton>
    <gd-skeleton></gd-skeleton>
  </header>

  <gd-skeleton></gd-skeleton>
  <gd-skeleton></gd-skeleton>
  <gd-skeleton></gd-skeleton>
</div>

<style>
  .skeleton-overview header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .skeleton-overview header gd-skeleton:last-child {
    flex: 0 0 auto;
    width: 30%;
  }

  .skeleton-overview gd-skeleton {
    margin-bottom: 1rem;
  }

  .skeleton-overview gd-skeleton:nth-child(1) {
    float: left;
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
    vertical-align: middle;
  }

  .skeleton-overview gd-skeleton:nth-child(3) {
    width: 95%;
  }

  .skeleton-overview gd-skeleton:nth-child(4) {
    width: 80%;
  }
</style>
```

```jsx:react
import SlSkeleton from '@gesdisc/components/dist/react/skeleton';

const css = `
  .skeleton-overview header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .skeleton-overview header gd-skeleton:last-child {
    flex: 0 0 auto;
    width: 30%;
  }

  .skeleton-overview gd-skeleton {
    margin-bottom: 1rem;
  }

  .skeleton-overview gd-skeleton:nth-child(1) {
    float: left;
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
    vertical-align: middle;
  }

  .skeleton-overview gd-skeleton:nth-child(3) {
    width: 95%;
  }

  .skeleton-overview gd-skeleton:nth-child(4) {
    width: 80%;
  }
`;

const App = () => (
  <>
    <div className="skeleton-overview">
      <header>
        <SlSkeleton />
        <SlSkeleton />
      </header>

      <SlSkeleton />
      <SlSkeleton />
      <SlSkeleton />
    </div>

    <style>{css}</style>
  </>
);
```

## Examples

### Effects

There are two built-in effects, `sheen` and `pulse`. Effects are intentionally subtle, as they can be distracting when used extensively. The default is `none`, which displays a static, non-animated skeleton.

```html:preview
<div class="skeleton-effects">
  <gd-skeleton effect="none"></gd-skeleton>
  None

  <gd-skeleton effect="sheen"></gd-skeleton>
  Sheen

  <gd-skeleton effect="pulse"></gd-skeleton>
  Pulse
</div>

<style>
  .skeleton-effects {
    font-size: var(--gd-font-size-small);
  }

  .skeleton-effects gd-skeleton:not(:first-child) {
    margin-top: 1rem;
  }
</style>
```

```jsx:react
import SlSkeleton from '@gesdisc/components/dist/react/skeleton';

const css = `
  .skeleton-effects {
    font-size: var(--gd-font-size-small);
  }

  .skeleton-effects gd-skeleton:not(:first-child) {
    margin-top: 1rem;
  }
`;

const App = () => (
  <>
    <div className="skeleton-effects">
      <SlSkeleton effect="none" />
      None
      <SlSkeleton effect="sheen" />
      Sheen
      <SlSkeleton effect="pulse" />
      Pulse
    </div>

    <style>{css}</style>
  </>
);
```

### Paragraphs

Use multiple skeletons and some clever styles to simulate paragraphs.

```html:preview
<div class="skeleton-paragraphs">
  <gd-skeleton></gd-skeleton>
  <gd-skeleton></gd-skeleton>
  <gd-skeleton></gd-skeleton>
  <gd-skeleton></gd-skeleton>
  <gd-skeleton></gd-skeleton>
</div>

<style>
  .skeleton-paragraphs gd-skeleton {
    margin-bottom: 1rem;
  }

  .skeleton-paragraphs gd-skeleton:nth-child(2) {
    width: 95%;
  }

  .skeleton-paragraphs gd-skeleton:nth-child(4) {
    width: 90%;
  }

  .skeleton-paragraphs gd-skeleton:last-child {
    width: 50%;
  }
</style>
```

```jsx:react
import SlSkeleton from '@gesdisc/components/dist/react/skeleton';

const css = `
  .skeleton-paragraphs gd-skeleton {
    margin-bottom: 1rem;
  }

  .skeleton-paragraphs gd-skeleton:nth-child(2) {
    width: 95%;
  }

  .skeleton-paragraphs gd-skeleton:nth-child(4) {
    width: 90%;
  }

  .skeleton-paragraphs gd-skeleton:last-child {
    width: 50%;
  }
`;

const App = () => (
  <>
    <div className="skeleton-paragraphs">
      <SlSkeleton />
      <SlSkeleton />
      <SlSkeleton />
      <SlSkeleton />
      <SlSkeleton />
    </div>

    <style>{css}</style>
  </>
);
```

### Avatars

Set a matching width and height to make a circle, square, or rounded avatar skeleton.

```html:preview
<div class="skeleton-avatars">
  <gd-skeleton></gd-skeleton>
  <gd-skeleton></gd-skeleton>
  <gd-skeleton></gd-skeleton>
</div>

<style>
  .skeleton-avatars gd-skeleton {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    margin-right: 0.5rem;
  }

  .skeleton-avatars gd-skeleton:nth-child(1) {
    --border-radius: 0;
  }

  .skeleton-avatars gd-skeleton:nth-child(2) {
    --border-radius: var(--gd-border-radius-medium);
  }
</style>
```

```jsx:react
import SlSkeleton from '@gesdisc/components/dist/react/skeleton';

const css = `
  .skeleton-avatars gd-skeleton {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    margin-right: .5rem;
  }

  .skeleton-avatars gd-skeleton:nth-child(1) {
    --border-radius: 0;
  }

  .skeleton-avatars gd-skeleton:nth-child(2) {
    --border-radius: var(--gd-border-radius-medium);
  }
`;

const App = () => (
  <>
    <div className="skeleton-avatars">
      <SlSkeleton />
      <SlSkeleton />
      <SlSkeleton />
    </div>

    <style>{css}</style>
  </>
);
```

### Custom Shapes

Use the `--border-radius` custom property to make circles, squares, and rectangles. For more complex shapes, you can apply `clip-path` to the `indicator` part. [Try Clippy](https://bennettfeely.com/clippy/) if you need help generating custom shapes.

```html:preview
<div class="skeleton-shapes">
  <gd-skeleton class="square"></gd-skeleton>
  <gd-skeleton class="circle"></gd-skeleton>
  <gd-skeleton class="triangle"></gd-skeleton>
  <gd-skeleton class="cross"></gd-skeleton>
  <gd-skeleton class="comment"></gd-skeleton>
</div>

<style>
  .skeleton-shapes gd-skeleton {
    display: inline-flex;
    width: 50px;
    height: 50px;
  }

  .skeleton-shapes .square::part(indicator) {
    --border-radius: var(--gd-border-radius-medium);
  }

  .skeleton-shapes .circle::part(indicator) {
    --border-radius: var(--gd-border-radius-circle);
  }

  .skeleton-shapes .triangle::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(50% 0, 0 100%, 100% 100%);
  }

  .skeleton-shapes .cross::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(
      20% 0%,
      0% 20%,
      30% 50%,
      0% 80%,
      20% 100%,
      50% 70%,
      80% 100%,
      100% 80%,
      70% 50%,
      100% 20%,
      80% 0%,
      50% 30%
    );
  }

  .skeleton-shapes .comment::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);
  }

  .skeleton-shapes gd-skeleton:not(:last-child) {
    margin-right: 0.5rem;
  }
</style>
```

```jsx:react
import SlSkeleton from '@gesdisc/components/dist/react/skeleton';

const css = `
  .skeleton-shapes gd-skeleton {
    display: inline-flex;
    width: 50px;
    height: 50px;
  }

  .skeleton-shapes .square::part(indicator) {
    --border-radius: var(--gd-border-radius-medium);
  }

  .skeleton-shapes .circle::part(indicator) {
    --border-radius: var(--gd-border-radius-circle);
  }

  .skeleton-shapes .triangle::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(50% 0, 0 100%, 100% 100%);
  }

  .skeleton-shapes .cross::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);
  }

  .skeleton-shapes .comment::part(indicator) {
    --border-radius: 0;
    clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);
  }

  .skeleton-shapes gd-skeleton:not(:last-child) {
    margin-right: .5rem;
  }
`;

const App = () => (
  <>
    <div className="skeleton-shapes">
      <SlSkeleton className="square" />
      <SlSkeleton className="circle" />
      <SlSkeleton className="triangle" />
      <SlSkeleton className="cross" />
      <SlSkeleton className="comment" />
    </div>

    <style>{css}</style>
  </>
);
```

### Custom Colors

Set the `--color` and `--sheen-color` custom properties to adjust the skeleton's color.

```html:preview
<gd-skeleton effect="sheen" style="--color: tomato; --sheen-color: #ffb094;"></gd-skeleton>
```

{% raw %}

```jsx:react
import SlSkeleton from '@gesdisc/components/dist/react/skeleton';

const css = `
  .skeleton-avatars gd-skeleton {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    margin-right: .5rem;
  }

  .skeleton-avatars gd-skeleton:nth-child(1) {
    --border-radius: 0;
  }

  .skeleton-avatars gd-skeleton:nth-child(2) {
    --border-radius: var(--gd-border-radius-medium);
  }
`;

const App = () => <SlSkeleton effect="sheen" style={{ '--color': 'tomato', '--sheen-color': '#ffb094' }} />;
```

{% endraw %}
