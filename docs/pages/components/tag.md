---
meta:
  title: Tag
  description: Tags are used as labels to organize things or to indicate a selection.
layout: component
---

```html:preview
<gd-tag variant="primary">Primary</gd-tag>
<gd-tag variant="success">Success</gd-tag>
<gd-tag variant="neutral">Neutral</gd-tag>
<gd-tag variant="warning">Warning</gd-tag>
<gd-tag variant="danger">Danger</gd-tag>
```

```jsx:react
import SlTag from '@gesdisc/components/dist/react/tag';

const App = () => (
  <>
    <SlTag variant="primary">Primary</SlTag>
    <SlTag variant="success">Success</SlTag>
    <SlTag variant="neutral">Neutral</SlTag>
    <SlTag variant="warning">Warning</SlTag>
    <SlTag variant="danger">Danger</SlTag>
  </>
);
```

## Examples

### Sizes

Use the `size` attribute to change a tab's size.

```html:preview
<gd-tag size="small">Small</gd-tag>
<gd-tag size="medium">Medium</gd-tag>
<gd-tag size="large">Large</gd-tag>
```

```jsx:react
import SlTag from '@gesdisc/components/dist/react/tag';

const App = () => (
  <>
    <SlTag size="small">Small</SlTag>
    <SlTag size="medium">Medium</SlTag>
    <SlTag size="large">Large</SlTag>
  </>
);
```

### Pill

Use the `pill` attribute to give tabs rounded edges.

```html:preview
<gd-tag size="small" pill>Small</gd-tag>
<gd-tag size="medium" pill>Medium</gd-tag>
<gd-tag size="large" pill>Large</gd-tag>
```

```jsx:react
import SlTag from '@gesdisc/components/dist/react/tag';

const App = () => (
  <>
    <SlTag size="small" pill>
      Small
    </SlTag>
    <SlTag size="medium" pill>
      Medium
    </SlTag>
    <SlTag size="large" pill>
      Large
    </SlTag>
  </>
);
```

### Removable

Use the `removable` attribute to add a remove button to the tag.

```html:preview
<div class="tags-removable">
  <gd-tag size="small" removable>Small</gd-tag>
  <gd-tag size="medium" removable>Medium</gd-tag>
  <gd-tag size="large" removable>Large</gd-tag>
</div>

<script>
  const div = document.querySelector('.tags-removable');

  div.addEventListener('gd-remove', event => {
    const tag = event.target;
    tag.style.opacity = '0';
    setTimeout(() => (tag.style.opacity = '1'), 2000);
  });
</script>

<style>
  .tags-removable gd-tag {
    transition: var(--gd-transition-medium) opacity;
  }
</style>
```

```jsx:react
import SlTag from '@gesdisc/components/dist/react/tag';

const css = `
  .tags-removable gd-tag {
    transition: var(--gd-transition-medium) opacity;
  }
`;

const App = () => {
  function handleRemove(event) {
    const tag = event.target;
    tag.style.opacity = '0';
    setTimeout(() => (tag.style.opacity = '1'), 2000);
  }

  return (
    <>
      <div className="tags-removable">
        <SlTag size="small" removable onSlRemove={handleRemove}>
          Small
        </SlTag>

        <SlTag size="medium" removable onSlRemove={handleRemove}>
          Medium
        </SlTag>

        <SlTag size="large" removable onSlRemove={handleRemove}>
          Large
        </SlTag>
      </div>

      <style>{css}</style>
    </>
  );
};
```
