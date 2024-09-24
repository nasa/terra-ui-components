---
meta:
    title: Chip
    description: A chip is used to represent small blocks of information, and are commonly used for contacts and tags. Use the X to make the chip disappear
layout: component
---

```html:preview
<terra-chip>This is a chip!</terra-chip>
```

## Examples

### Default behavior of chips

Customize the text on each chip.

```html:preview
<terra-chip>You</terra-chip>
<terra-chip>Can</terra-chip>
<terra-chip>Click</terra-chip>
<terra-chip>the</terra-chip>
<terra-chip>X</terra-chip>
<terra-chip>and</terra-chip>
<terra-chip>Make</terra-chip>
<terra-chip>Each</terra-chip>
<terra-chip>Chip</terra-chip>
<terra-chip>Disappear</terra-chip>
```

```jsx:react
import TerraLoader from '@nasa-terra/components/dist/react/chip';

const App = () => (
    <>
        <TerraChip>You</TerraChip>
        <TerraChip>Can</TerraChip>
        <TerraChip>Click</TerraChip>
        <TerraChip>the</TerraChip>
        <TerraChip>X</TerraChip>
        <TerraChip>and</TerraChip>
        <TerraChip>Make</TerraChip>
        <TerraChip>Each</TerraChip>
        <TerraChip>Chip</TerraChip>
        <TerraChip>Disappear</TerraChip>
    </>
);
```

### Customizing Chip Sizes

Use the "size" property to customize the size of the chip.

```html:preview
  <terra-chip size="small">Small</terra-chip>
  <terra-chip size="medium">Medium</terra-chip>
  <terra-chip size="large">Large</terra-chip>
```

### Adding custom behaviors to chips

Customize actions by modifying the `action` property, which will not only make the chip disappear, but also do a custom action.

This example makes the chip disappear and also produces an alert.

```html:preview
<terra-chip class="chip">Alert</terra-chip>
<script>
  const div = document.querySelector('.chip');

  div.addEventListener('terra-remove', event => {
    alert("This chip has been removed!");
  });
</script>
```

```jsx:react
import TerraLoader from '@nasa-terra/components/dist/react/chip'
const App = () => {
  function handleRemove(event) {
    alert("This chip has been removed");
  }

  return (
    <>
        <TerraChip class="chip">Alert</TerraChip>
    </>
  );
};
```
