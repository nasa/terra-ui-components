---
meta:
    title: Chip
    description: A chip is used to represent small blocks of information, and are commonly used for contacts and tags. Use the X to make the chip disappear
layout: component
---

```html:preview
<edux-chip>This is a chip!</edux-chip>
```

## Examples

### Default behavior of chips

Customize the text on each chip.

```html:preview
<edux-chip>You</edux-chip>
<edux-chip>Can</edux-chip>
<edux-chip>Click</edux-chip>
<edux-chip>the</edux-chip>
<edux-chip>X</edux-chip>
<edux-chip>and</edux-chip>
<edux-chip>Make</edux-chip>
<edux-chip>Each</edux-chip>
<edux-chip>Chip</edux-chip>
<edux-chip>Disappear</edux-chip>
```

```jsx:react
import EduxLoader from '@nasa/earthdata-ux-components/dist/react/chip';

const App = () => (
    <>
        <EduxChip>You</EduxChip>
        <EduxChip>Can</EduxChip>
        <EduxChip>Click</EduxChip>
        <EduxChip>the</EduxChip>
        <EduxChip>X</EduxChip>
        <EduxChip>and</EduxChip>
        <EduxChip>Make</EduxChip>
        <EduxChip>Each</EduxChip>
        <EduxChip>Chip</EduxChip>
        <EduxChip>Disappear</EduxChip>
    </>
);
```

### Customizing Chip Sizes

Use the "size" property to customize the size of the chip.

```html:preview
  <edux-chip size="small">Small</edux-chip>
  <edux-chip size="medium">Medium</edux-chip>
  <edux-chip size="large">Large</edux-chip>
```

### Adding custom behaviors to chips

Customize actions by modifying the `action` property, which will not only make the chip disappear, but also do a custom action.

This example makes the chip disappear and also produces an alert.

```html:preview
<edux-chip class="chip">Alert</edux-chip>
<script>
  const div = document.querySelector('.chip');

  div.addEventListener('edux-remove', event => {
    alert("This chip has been removed!");
  });
</script>
```

```jsx:react
import EduxLoader from '@nasa/earthdata-ux-components/dist/react/chip'
const App = () => {
  function handleRemove(event) {
    alert("This chip has been removed");
  }

  return (
    <>
        <EduxChip class="chip">Alert</EduxChip>
    </>
  );
};
```
