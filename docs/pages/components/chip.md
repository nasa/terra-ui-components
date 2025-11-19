---
meta:
    title: Chip
    description: A chip is used to represent small blocks of information, and are commonly used for contacts and tags. Chips can optionally have a close button to remove them.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-chip>This is a chip!</terra-chip>
<terra-chip closeable>You can close this chip</terra-chip>
```

## Examples

### Default behavior of chips

By default, chips sit side by side and do not have a close button. Customize the text on each chip.

```html:preview
<terra-chip>Robotics</terra-chip>
<terra-chip>Press Releases</terra-chip>
<terra-chip>Next Year</terra-chip>
```

### Closeable chips

Use the `closeable` prop to add a close button to chips. When clicked, the chip will emit a `terra-remove` event and remove itself from the DOM.

```html:preview
<terra-chip closeable>Click the X to remove</terra-chip>
<terra-chip closeable>Another closeable chip</terra-chip>
<terra-chip closeable>One more</terra-chip>
```

```jsx:react
import TerraChip from '@nasa-terra/components/dist/react/chip';

const App = () => (
    <>
        <TerraChip closeable>Click the X to remove</TerraChip>
        <TerraChip closeable>Another closeable chip</TerraChip>
        <TerraChip closeable>One more</TerraChip>
    </>
);
```

### Stacking chips

Use the `stack` prop to make chips stack vertically instead of sitting side by side.

```html:preview
<terra-chip stack>Robotics</terra-chip>
<terra-chip stack>Press Releases</terra-chip>
<terra-chip stack>Next Year</terra-chip>
```

```jsx:react
import TerraChip from '@nasa-terra/components/dist/react/chip';

const App = () => (
    <>
        <TerraChip stack>Robotics</TerraChip>
        <TerraChip stack>Press Releases</TerraChip>
        <TerraChip stack>Next Year</TerraChip>
    </>
);
```

### Customizing Chip Sizes

Use the "size" property to customize the size of the chip.

```html:preview
  <div>
    <terra-chip size="small">Small</terra-chip>
    <terra-chip size="small" closeable>Small</terra-chip>
  </div>

  <div>
    <terra-chip size="medium">Medium</terra-chip>
    <terra-chip size="medium" closeable>Medium</terra-chip>
  </div>

  <div>
    <terra-chip size="large">Large</terra-chip>
    <terra-chip size="large" closeable>Large</terra-chip>
  </div>
```

### Adding custom behaviors to chips

Listen for the `terra-remove` event to perform custom actions when a closeable chip is removed. This example makes the chip disappear and also produces an alert.

```html:preview
<terra-chip closeable class="chip">Alert</terra-chip>
<script>
  const div = document.querySelector('.chip');

  div.addEventListener('terra-remove', event => {
    alert("This chip has been removed!");
  });
</script>
```

```jsx:react
import TerraChip from '@nasa-terra/components/dist/react/chip'
const App = () => {
  function handleRemove(event) {
    alert("This chip has been removed");
  }

  return (
    <>
        <TerraChip closeable className="chip" onTerraRemove={handleRemove}>Alert</TerraChip>
    </>
  );
};
```
