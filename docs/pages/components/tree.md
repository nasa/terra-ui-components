---
meta:
  title: Tree
  description: Trees allow you to display a hierarchical list of selectable tree items. Items with children can be expanded and collapsed as desired by the user.
layout: component
---

```html:preview
<gd-tree>
  <gd-tree-item>
    Deciduous
    <gd-tree-item>Birch</gd-tree-item>
    <gd-tree-item>
      Maple
      <gd-tree-item>Field maple</gd-tree-item>
      <gd-tree-item>Red maple</gd-tree-item>
      <gd-tree-item>Sugar maple</gd-tree-item>
    </gd-tree-item>
    <gd-tree-item>Oak</gd-tree-item>
  </gd-tree-item>

  <gd-tree-item>
    Coniferous
    <gd-tree-item>Cedar</gd-tree-item>
    <gd-tree-item>Pine</gd-tree-item>
    <gd-tree-item>Spruce</gd-tree-item>
  </gd-tree-item>

  <gd-tree-item>
    Non-trees
    <gd-tree-item>Bamboo</gd-tree-item>
    <gd-tree-item>Cactus</gd-tree-item>
    <gd-tree-item>Fern</gd-tree-item>
  </gd-tree-item>
</gd-tree>
```

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@gesdisc/components/dist/react/tree';
import SlTreeItem from '@gesdisc/components/dist/react/tree-item';

const App = () => (
  <SlTree>
    <SlTreeItem>
      Deciduous
      <SlTreeItem>Birch</SlTreeItem>
      <SlTreeItem>
        Maple
        <SlTreeItem>Field maple</SlTreeItem>
        <SlTreeItem>Red maple</SlTreeItem>
        <SlTreeItem>Sugar maple</SlTreeItem>
      </SlTreeItem>
      <SlTreeItem>Oak</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Coniferous
      <SlTreeItem>Cedar</SlTreeItem>
      <SlTreeItem>Pine</SlTreeItem>
      <SlTreeItem>Spruce</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Non-trees
      <SlTreeItem>Bamboo</SlTreeItem>
      <SlTreeItem>Cactus</SlTreeItem>
      <SlTreeItem>Fern</SlTreeItem>
    </SlTreeItem>
  </SlTree>
);
```

## Examples

### Selection Modes

The `selection` attribute lets you change the selection behavior of the tree.

- Use `single` to allow the selection of a single item (default).
- Use `multiple` to allow the selection of multiple items.
- Use `leaf` to only allow leaf nodes to be selected.

```html:preview
<gd-select id="selection-mode" value="single" label="Selection">
  <gd-option value="single">Single</gd-option>
  <gd-option value="multiple">Multiple</gd-option>
  <gd-option value="leaf">Leaf</gd-option>
</gd-select>

<br />

<gd-tree class="tree-selectable">
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

<script>
  const selectionMode = document.querySelector('#selection-mode');
  const tree = document.querySelector('.tree-selectable');

  selectionMode.addEventListener('gd-change', () => {
    tree.querySelectorAll('gd-tree-item').forEach(item => (item.selected = false));
    tree.selection = selectionMode.value;
  });
</script>
```

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@gesdisc/components/dist/react/tree';
import SlTreeItem from '@gesdisc/components/dist/react/tree-item';

const App = () => {
  const [selection, setSelection] = useState('single');

  return (
    <>
      <SlSelect label="Selection" value={selection} onSlChange={event => setSelection(event.target.value)}>
        <SlMenuItem value="single">single</SlMenuItem>
        <SlMenuItem value="multiple">multiple</SlMenuItem>
        <SlMenuItem value="leaf">leaf</SlMenuItem>
      </SlSelect>

      <br />

      <SlTree selection={selection}>
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
    </>
  );
};
```

### Showing Indent Guides

Indent guides can be drawn by setting `--indent-guide-width`. You can also change the color, offset, and style, using `--indent-guide-color`, `--indent-guide-style`, and `--indent-guide-offset`, respectively.

```html:preview
<gd-tree class="tree-with-lines">
  <gd-tree-item expanded>
    Deciduous
    <gd-tree-item>Birch</gd-tree-item>
    <gd-tree-item expanded>
      Maple
      <gd-tree-item>Field maple</gd-tree-item>
      <gd-tree-item>Red maple</gd-tree-item>
      <gd-tree-item>Sugar maple</gd-tree-item>
    </gd-tree-item>
    <gd-tree-item>Oak</gd-tree-item>
  </gd-tree-item>

  <gd-tree-item>
    Coniferous
    <gd-tree-item>Cedar</gd-tree-item>
    <gd-tree-item>Pine</gd-tree-item>
    <gd-tree-item>Spruce</gd-tree-item>
  </gd-tree-item>

  <gd-tree-item>
    Non-trees
    <gd-tree-item>Bamboo</gd-tree-item>
    <gd-tree-item>Cactus</gd-tree-item>
    <gd-tree-item>Fern</gd-tree-item>
  </gd-tree-item>
</gd-tree>

<style>
  .tree-with-lines {
    --indent-guide-width: 1px;
  }
</style>
```

{% raw %}

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@gesdisc/components/dist/react/tree';
import SlTreeItem from '@gesdisc/components/dist/react/tree-item';

const App = () => (
  <SlTree class="tree-with-lines" style={{ '--indent-guide-width': '1px' }}>
    <SlTreeItem expanded>
      Deciduous
      <SlTreeItem>Birch</SlTreeItem>
      <SlTreeItem expanded>
        Maple
        <SlTreeItem>Field maple</SlTreeItem>
        <SlTreeItem>Red maple</SlTreeItem>
        <SlTreeItem>Sugar maple</SlTreeItem>
      </SlTreeItem>
      <SlTreeItem>Oak</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Coniferous
      <SlTreeItem>Cedar</SlTreeItem>
      <SlTreeItem>Pine</SlTreeItem>
      <SlTreeItem>Spruce</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Non-trees
      <SlTreeItem>Bamboo</SlTreeItem>
      <SlTreeItem>Cactus</SlTreeItem>
      <SlTreeItem>Fern</SlTreeItem>
    </SlTreeItem>
  </SlTree>
);
```

{% endraw %}

### Lazy Loading

Use the `lazy` attribute on a tree item to indicate that the content is not yet present and will be loaded later. When the user tries to expand the node, the `loading` state is set to `true` and the `gd-lazy-load` event will be emitted to allow you to load data asynchronously. The item will remain in a loading state until its content is changed.

If you want to disable this behavior after the first load, simply remove the `lazy` attribute and, on the next expand, the existing content will be shown instead.

```html:preview
<gd-tree>
  <gd-tree-item lazy>Available Trees</gd-tree-item>
</gd-tree>

<script type="module">
  const lazyItem = document.querySelector('gd-tree-item[lazy]');

  lazyItem.addEventListener('gd-lazy-load', () => {
    // Simulate asynchronous loading
    setTimeout(() => {
      const subItems = ['Birch', 'Cedar', 'Maple', 'Pine'];

      for (const item of subItems) {
        const treeItem = document.createElement('gd-tree-item');
        treeItem.innerText = item;
        lazyItem.append(treeItem);
      }

      // Disable lazy mode once the content has been loaded
      lazyItem.lazy = false;
    }, 1000);
  });
</script>
```

```jsx:react
import SlTree from '@gesdisc/components/dist/react/tree';
import SlTreeItem from '@gesdisc/components/dist/react/tree-item';

const App = () => {
  const [childItems, setChildItems] = useState([]);
  const [lazy, setLazy] = useState(true);

  const handleLazyLoad = () => {
    // Simulate asynchronous loading
    setTimeout(() => {
      setChildItems(['Birch', 'Cedar', 'Maple', 'Pine']);

      // Disable lazy mode once the content has been loaded
      setLazy(false);
    }, 1000);
  };

  return (
    <SlTree>
      <SlTreeItem lazy={lazy} onSlLazyLoad={handleLazyLoad}>
        Available Trees
        {childItems.map(item => (
          <SlTreeItem>{item}</SlTreeItem>
        ))}
      </SlTreeItem>
    </SlTree>
  );
};
```

### Customizing the Expand and Collapse Icons

Use the `expand-icon` and `collapse-icon` slots to change the expand and collapse icons, respectively. To disable the animation, override the `rotate` property on the `expand-button` part as shown below.

```html:preview
<gd-tree class="custom-icons">
  <gd-icon name="plus-square" slot="expand-icon"></gd-icon>
  <gd-icon name="dash-square" slot="collapse-icon"></gd-icon>

  <gd-tree-item>
    Deciduous
    <gd-tree-item>Birch</gd-tree-item>
    <gd-tree-item>
      Maple
      <gd-tree-item>Field maple</gd-tree-item>
      <gd-tree-item>Red maple</gd-tree-item>
      <gd-tree-item>Sugar maple</gd-tree-item>
    </gd-tree-item>
    <gd-tree-item>Oak</gd-tree-item>
  </gd-tree-item>

  <gd-tree-item>
    Coniferous
    <gd-tree-item>Cedar</gd-tree-item>
    <gd-tree-item>Pine</gd-tree-item>
    <gd-tree-item>Spruce</gd-tree-item>
  </gd-tree-item>

  <gd-tree-item>
    Non-trees
    <gd-tree-item>Bamboo</gd-tree-item>
    <gd-tree-item>Cactus</gd-tree-item>
    <gd-tree-item>Fern</gd-tree-item>
  </gd-tree-item>
</gd-tree>

<style>
  .custom-icons gd-tree-item::part(expand-button) {
    /* Disable the expand/collapse animation */
    rotate: none;
  }
</style>
```

<!-- prettier-ignore -->
```jsx:react
import SlTree from '@gesdisc/components/dist/react/tree';
import SlTreeItem from '@gesdisc/components/dist/react/tree-item';

const App = () => (
  <SlTree>
    <SlIcon name="plus-square" slot="expand-icon"></SlIcon>
    <SlIcon name="dash-square" slot="collapse-icon"></SlIcon>

    <SlTreeItem>
      Deciduous
      <SlTreeItem>Birch</SlTreeItem>
      <SlTreeItem>
        Maple
        <SlTreeItem>Field maple</SlTreeItem>
        <SlTreeItem>Red maple</SlTreeItem>
        <SlTreeItem>Sugar maple</SlTreeItem>
      </SlTreeItem>
      <SlTreeItem>Oak</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Coniferous
      <SlTreeItem>Cedar</SlTreeItem>
      <SlTreeItem>Pine</SlTreeItem>
      <SlTreeItem>Spruce</SlTreeItem>
    </SlTreeItem>

    <SlTreeItem>
      Non-trees
      <SlTreeItem>Bamboo</SlTreeItem>
      <SlTreeItem>Cactus</SlTreeItem>
      <SlTreeItem>Fern</SlTreeItem>
    </SlTreeItem>
  </SlTree>
);
```

### With Icons

Decorative icons can be used before labels to provide hints for each node.

```html:preview
<gd-tree class="tree-with-icons">
  <gd-tree-item expanded>
    <gd-icon name="folder"></gd-icon>
    Documents

    <gd-tree-item>
      <gd-icon name="folder"> </gd-icon>
      Photos
      <gd-tree-item>
        <gd-icon name="image"></gd-icon>
        birds.jpg
      </gd-tree-item>
      <gd-tree-item>
        <gd-icon name="image"></gd-icon>
        kitten.jpg
      </gd-tree-item>
      <gd-tree-item>
        <gd-icon name="image"></gd-icon>
        puppy.jpg
      </gd-tree-item>
    </gd-tree-item>

    <gd-tree-item>
      <gd-icon name="folder"></gd-icon>
      Writing
      <gd-tree-item>
        <gd-icon name="file"></gd-icon>
        draft.txt
      </gd-tree-item>
      <gd-tree-item>
        <gd-icon name="file-pdf"></gd-icon>
        final.pdf
      </gd-tree-item>
      <gd-tree-item>
        <gd-icon name="file-bar-graph"></gd-icon>
        sales.xls
      </gd-tree-item>
    </gd-tree-item>
  </gd-tree-item>
</gd-tree>
```

```jsx:react
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlTree from '@gesdisc/components/dist/react/tree';
import SlTreeItem from '@gesdisc/components/dist/react/tree-item';

const App = () => {
  return (
    <SlTree class="tree-with-icons">
      <SlTreeItem expanded>
        <SlIcon name="folder" />
        Root
        <SlTreeItem>
          <SlIcon name="folder" />
          Folder 1<SlTreeItem>
            <SlIcon name="files" />
            File 1 - 1
          </SlTreeItem>
          <SlTreeItem disabled>
            <SlIcon name="files" />
            File 1 - 2
          </SlTreeItem>
          <SlTreeItem>
            <SlIcon name="files" />
            File 1 - 3
          </SlTreeItem>
        </SlTreeItem>
        <SlTreeItem>
          <SlIcon name="files" />
          Folder 2<SlTreeItem>
            <SlIcon name="files" />
            File 2 - 1
          </SlTreeItem>
          <SlTreeItem>
            <SlIcon name="files" />
            File 2 - 2
          </SlTreeItem>
        </SlTreeItem>
        <SlTreeItem>
          <SlIcon name="files" />
          File 1
        </SlTreeItem>
      </SlTreeItem>
    </SlTree>
  );
};
```
