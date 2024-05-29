---
meta:
    title: Chip
    description: A chip is used to represent small blocks of information, and are commonly used for contacts and tags. Use the X to make the chip disappear
layout: component
---

```html:preview
<edux-chip content="This is a chip!"></edux-chip>
```

## Examples

### Default behavior of chips

Customize the `content` property to alter the text on each chip.

```html:preview
<edux-chip content="You"></edux-chip>
<edux-chip content="Can"></edux-chip>
<edux-chip content="Click"></edux-chip>
<edux-chip content="the"></edux-chip>
<edux-chip content="X"></edux-chip>
<edux-chip content="and"></edux-chip>
<edux-chip content="Make"></edux-chip>
<edux-chip content="Each"></edux-chip>
<edux-chip content="Chip"></edux-chip>
<edux-chip content="Disappear"></edux-chip>
```

```jsx:react
import EduxLoader from '@nasa/earthdata-ux-components/dist/react/chip';

const App = () => (
    <>
        <EduxChip content="You"></EduxChip>
        <EduxChip content="Can"></EduxChip>
        <EduxChip content="Click"></EduxChip>
        <EduxChip content="the"></EduxChip>
        <EduxChip content="X"></EduxChip>
        <EduxChip content="and"></EduxChip>
        <EduxChip content="Make"></EduxChip>
        <EduxChip content="Each"></EduxChip>
        <EduxChip content="Chip"></EduxChip>
        <EduxChip content="Disappear"></EduxChip>
    </>
);
```
### Adding custom behaviors to chips

Customize actions by modifying the `action` property, which will not only make the chip disappear, but also do a custom action. 

This example makes the chip disappear and also produces an alert.
```html:preview
<edux-chip content="Alert" action='alert("This chip has been removed")'></edux-chip>
```


```jsx:react
import EduxLoader from '@nasa/earthdata-ux-components/dist/react/chip';
const App = () => (
    <>
        <EduxChip content="Alert" action='alert("This chip has been removed")'></EduxChip>
    </>
);
