---
meta:
  title: Tree Item
  description: A tree item serves as a hierarchical node that lives inside a tree.
layout: component
---

```html:preview
<gd-tree>
  <gd-tree-item>
    Item 1
    <gd-tree-item>Item A</gd-tree-item>
    <gd-tree-item>Item B</gd-tree-item>
    <gd-tree-item>Item C</gd-tree-item>
  </gd-tree-item>
  <gd-tree-item>Item 2</gd-tree-item>
  <gd-tree-item>Item 3</gd-tree-item>
</gd-tree>
```

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@gesdisc/components/dist/react/tree';
import SlTreeItem from '@gesdisc/components/dist/react/tree-item';

const App = () => (
  <SlTree>
    <SlTreeItem>
      Item 1
      <SlTreeItem>Item A</SlTreeItem>
      <SlTreeItem>Item B</SlTreeItem>
      <SlTreeItem>Item C</SlTreeItem>
    </SlTreeItem>
    <SlTreeItem>Item 2</SlTreeItem>
    <SlTreeItem>Item 3</SlTreeItem>
  </SlTree>
);
```

## Examples

### Nested tree items

A tree item can contain other tree items. This allows the node to be expanded or collapsed by the user.

```html:preview
<gd-tree>
  <gd-tree-item>
    Item 1
    <gd-tree-item>
      Item A
      <gd-tree-item>Item Z</gd-tree-item>
      <gd-tree-item>Item Y</gd-tree-item>
      <gd-tree-item>Item X</gd-tree-item>
    </gd-tree-item>
    <gd-tree-item>Item B</gd-tree-item>
    <gd-tree-item>Item C</gd-tree-item>
  </gd-tree-item>
  <gd-tree-item>Item 2</gd-tree-item>
  <gd-tree-item>Item 3</gd-tree-item>
</gd-tree>
```

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@gesdisc/components/dist/react/tree';
import SlTreeItem from '@gesdisc/components/dist/react/tree-item';

const App = () => (
  <SlTree>
    <SlTreeItem>
      Item 1
      <SlTreeItem>
        Item A
        <SlTreeItem>Item Z</SlTreeItem>
        <SlTreeItem>Item Y</SlTreeItem>
        <SlTreeItem>Item X</SlTreeItem>
      </SlTreeItem>
      <SlTreeItem>Item B</SlTreeItem>
      <SlTreeItem>Item C</SlTreeItem>
    </SlTreeItem>
    <SlTreeItem>Item 2</SlTreeItem>
    <SlTreeItem>Item 3</SlTreeItem>
  </SlTree>
);
```

### Selected

Use the `selected` attribute to select a tree item initially.

```html:preview
<gd-tree>
  <gd-tree-item selected>
    Item 1
    <gd-tree-item>Item A</gd-tree-item>
    <gd-tree-item>Item B</gd-tree-item>
    <gd-tree-item>Item C</gd-tree-item>
  </gd-tree-item>
  <gd-tree-item>Item 2</gd-tree-item>
  <gd-tree-item>Item 3</gd-tree-item>
</gd-tree>
```

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@gesdisc/components/dist/react/tree';
import SlTreeItem from '@gesdisc/components/dist/react/tree-item';

const App = () => (
  <SlTree>
    <SlTreeItem selected>
      Item 1
      <SlTreeItem>Item A</SlTreeItem>
      <SlTreeItem>Item B</SlTreeItem>
      <SlTreeItem>Item C</SlTreeItem>
    </SlTreeItem>
    <SlTreeItem>Item 2</SlTreeItem>
    <SlTreeItem>Item 3</SlTreeItem>
  </SlTree>
);
```

### Expanded

Use the `expanded` attribute to expand a tree item initially.

```html:preview
<gd-tree>
  <gd-tree-item expanded>
    Item 1
    <gd-tree-item expanded>
      Item A
      <gd-tree-item>Item Z</gd-tree-item>
      <gd-tree-item>Item Y</gd-tree-item>
      <gd-tree-item>Item X</gd-tree-item>
    </gd-tree-item>
    <gd-tree-item>Item B</gd-tree-item>
    <gd-tree-item>Item C</gd-tree-item>
  </gd-tree-item>
  <gd-tree-item>Item 2</gd-tree-item>
  <gd-tree-item>Item 3</gd-tree-item>
</gd-tree>
```

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@gesdisc/components/dist/react/tree';
import SlTreeItem from '@gesdisc/components/dist/react/tree-item';

const App = () => (
  <SlTree>
    <SlTreeItem expanded>
      Item 1
      <SlTreeItem expanded>
        Item A
        <SlTreeItem>Item Z</SlTreeItem>
        <SlTreeItem>Item Y</SlTreeItem>
        <SlTreeItem>Item X</SlTreeItem>
      </SlTreeItem>
      <SlTreeItem>Item B</SlTreeItem>
      <SlTreeItem>Item C</SlTreeItem>
    </SlTreeItem>
    <SlTreeItem>Item 2</SlTreeItem>
    <SlTreeItem>Item 3</SlTreeItem>
  </SlTree>
);
```
