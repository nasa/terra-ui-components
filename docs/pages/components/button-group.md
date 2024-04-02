---
meta:
  title: Button Group
  description: Button groups can be used to group related buttons into sections.
layout: component
---

```html:preview
<gd-button-group label="Alignment">
  <gd-button>Left</gd-button>
  <gd-button>Center</gd-button>
  <gd-button>Right</gd-button>
</gd-button-group>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlButtonGroup from '@gesdisc/components/dist/react/button-group';

const App = () => (
  <SlButtonGroup label="Alignment">
    <SlButton>Left</SlButton>
    <SlButton>Center</SlButton>
    <SlButton>Right</SlButton>
  </SlButtonGroup>
);
```

## Examples

### Button Sizes

All button sizes are supported, but avoid mixing sizes within the same button group.

```html:preview
<gd-button-group label="Alignment">
  <gd-button size="small">Left</gd-button>
  <gd-button size="small">Center</gd-button>
  <gd-button size="small">Right</gd-button>
</gd-button-group>

<br /><br />

<gd-button-group label="Alignment">
  <gd-button size="medium">Left</gd-button>
  <gd-button size="medium">Center</gd-button>
  <gd-button size="medium">Right</gd-button>
</gd-button-group>

<br /><br />

<gd-button-group label="Alignment">
  <gd-button size="large">Left</gd-button>
  <gd-button size="large">Center</gd-button>
  <gd-button size="large">Right</gd-button>
</gd-button-group>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlButtonGroup from '@gesdisc/components/dist/react/button-group';

const App = () => (
  <>
    <SlButtonGroup label="Alignment">
      <SlButton size="small">Left</SlButton>
      <SlButton size="small">Center</SlButton>
      <SlButton size="small">Right</SlButton>
    </SlButtonGroup>

    <br />
    <br />

    <SlButtonGroup label="Alignment">
      <SlButton size="medium">Left</SlButton>
      <SlButton size="medium">Center</SlButton>
      <SlButton size="medium">Right</SlButton>
    </SlButtonGroup>

    <br />
    <br />

    <SlButtonGroup label="Alignment">
      <SlButton size="large">Left</SlButton>
      <SlButton size="large">Center</SlButton>
      <SlButton size="large">Right</SlButton>
    </SlButtonGroup>
  </>
);
```

### Theme Buttons

Theme buttons are supported through the button's `variant` attribute.

```html:preview
<gd-button-group label="Alignment">
  <gd-button variant="primary">Left</gd-button>
  <gd-button variant="primary">Center</gd-button>
  <gd-button variant="primary">Right</gd-button>
</gd-button-group>

<br /><br />

<gd-button-group label="Alignment">
  <gd-button variant="success">Left</gd-button>
  <gd-button variant="success">Center</gd-button>
  <gd-button variant="success">Right</gd-button>
</gd-button-group>

<br /><br />

<gd-button-group label="Alignment">
  <gd-button variant="neutral">Left</gd-button>
  <gd-button variant="neutral">Center</gd-button>
  <gd-button variant="neutral">Right</gd-button>
</gd-button-group>

<br /><br />

<gd-button-group label="Alignment">
  <gd-button variant="warning">Left</gd-button>
  <gd-button variant="warning">Center</gd-button>
  <gd-button variant="warning">Right</gd-button>
</gd-button-group>

<br /><br />

<gd-button-group label="Alignment">
  <gd-button variant="danger">Left</gd-button>
  <gd-button variant="danger">Center</gd-button>
  <gd-button variant="danger">Right</gd-button>
</gd-button-group>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlButtonGroup from '@gesdisc/components/dist/react/button-group';

const App = () => (
  <>
    <SlButtonGroup label="Alignment">
      <SlButton variant="primary">Left</SlButton>
      <SlButton variant="primary">Center</SlButton>
      <SlButton variant="primary">Right</SlButton>
    </SlButtonGroup>

    <br />
    <br />

    <SlButtonGroup label="Alignment">
      <SlButton variant="success">Left</SlButton>
      <SlButton variant="success">Center</SlButton>
      <SlButton variant="success">Right</SlButton>
    </SlButtonGroup>

    <br />
    <br />

    <SlButtonGroup label="Alignment">
      <SlButton variant="neutral">Left</SlButton>
      <SlButton variant="neutral">Center</SlButton>
      <SlButton variant="neutral">Right</SlButton>
    </SlButtonGroup>

    <br />
    <br />

    <SlButtonGroup label="Alignment">
      <SlButton variant="warning">Left</SlButton>
      <SlButton variant="warning">Center</SlButton>
      <SlButton variant="warning">Right</SlButton>
    </SlButtonGroup>

    <br />
    <br />

    <SlButtonGroup label="Alignment">
      <SlButton variant="danger">Left</SlButton>
      <SlButton variant="danger">Center</SlButton>
      <SlButton variant="danger">Right</SlButton>
    </SlButtonGroup>
  </>
);
```

### Pill Buttons

Pill buttons are supported through the button's `pill` attribute.

```html:preview
<gd-button-group label="Alignment">
  <gd-button size="small" pill>Left</gd-button>
  <gd-button size="small" pill>Center</gd-button>
  <gd-button size="small" pill>Right</gd-button>
</gd-button-group>

<br /><br />

<gd-button-group label="Alignment">
  <gd-button size="medium" pill>Left</gd-button>
  <gd-button size="medium" pill>Center</gd-button>
  <gd-button size="medium" pill>Right</gd-button>
</gd-button-group>

<br /><br />

<gd-button-group label="Alignment">
  <gd-button size="large" pill>Left</gd-button>
  <gd-button size="large" pill>Center</gd-button>
  <gd-button size="large" pill>Right</gd-button>
</gd-button-group>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlButtonGroup from '@gesdisc/components/dist/react/button-group';

const App = () => (
  <>
    <SlButtonGroup label="Alignment">
      <SlButton size="small" pill>
        Left
      </SlButton>
      <SlButton size="small" pill>
        Center
      </SlButton>
      <SlButton size="small" pill>
        Right
      </SlButton>
    </SlButtonGroup>

    <br />
    <br />

    <SlButtonGroup label="Alignment">
      <SlButton size="medium" pill>
        Left
      </SlButton>
      <SlButton size="medium" pill>
        Center
      </SlButton>
      <SlButton size="medium" pill>
        Right
      </SlButton>
    </SlButtonGroup>

    <br />
    <br />

    <SlButtonGroup label="Alignment">
      <SlButton size="large" pill>
        Left
      </SlButton>
      <SlButton size="large" pill>
        Center
      </SlButton>
      <SlButton size="large" pill>
        Right
      </SlButton>
    </SlButtonGroup>
  </>
);
```

### Dropdowns in Button Groups

Dropdowns can be placed inside button groups as long as the trigger is an `<gd-button>` element.

```html:preview
<gd-button-group label="Example Button Group">
  <gd-button>Button</gd-button>
  <gd-button>Button</gd-button>
  <gd-dropdown>
    <gd-button slot="trigger" caret>Dropdown</gd-button>
    <gd-menu>
      <gd-menu-item>Item 1</gd-menu-item>
      <gd-menu-item>Item 2</gd-menu-item>
      <gd-menu-item>Item 3</gd-menu-item>
    </gd-menu>
  </gd-dropdown>
</gd-button-group>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlButtonGroup from '@gesdisc/components/dist/react/button-group';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlButtonGroup label="Example Button Group">
    <SlButton>Button</SlButton>
    <SlButton>Button</SlButton>
    <SlDropdown>
      <SlButton slot="trigger" caret>
        Dropdown
      </SlButton>
      <SlMenu>
        <SlMenuItem>Item 1</SlMenuItem>
        <SlMenuItem>Item 2</SlMenuItem>
        <SlMenuItem>Item 3</SlMenuItem>
      </SlMenu>
    </SlDropdown>
  </SlButtonGroup>
);
```

### Split Buttons

Create a split button using a button and a dropdown. Use a [visually hidden](/components/visually-hidden) label to ensure the dropdown is accessible to users with assistive devices.

```html:preview
<gd-button-group label="Example Button Group">
  <gd-button variant="primary">Save</gd-button>
  <gd-dropdown placement="bottom-end">
    <gd-button slot="trigger" variant="primary" caret>
      <gd-visually-hidden>More options</gd-visually-hidden>
    </gd-button>
    <gd-menu>
      <gd-menu-item>Save</gd-menu-item>
      <gd-menu-item>Save as&hellip;</gd-menu-item>
      <gd-menu-item>Save all</gd-menu-item>
    </gd-menu>
  </gd-dropdown>
</gd-button-group>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlButtonGroup from '@gesdisc/components/dist/react/button-group';
import SlDropdown from '@gesdisc/components/dist/react/dropdown';
import SlMenu from '@gesdisc/components/dist/react/menu';
import SlMenuItem from '@gesdisc/components/dist/react/menu-item';

const App = () => (
  <SlButtonGroup label="Example Button Group">
    <SlButton variant="primary">Save</SlButton>
    <SlDropdown placement="bottom-end">
      <SlButton slot="trigger" variant="primary" caret></SlButton>
      <SlMenu>
        <SlMenuItem>Save</SlMenuItem>
        <SlMenuItem>Save as&hellip;</SlMenuItem>
        <SlMenuItem>Save all</SlMenuItem>
      </SlMenu>
    </SlDropdown>
  </SlButtonGroup>
);
```

### Tooltips in Button Groups

Buttons can be wrapped in tooltips to provide more detail when the user interacts with them.

```html:preview
<gd-button-group label="Alignment">
  <gd-tooltip content="I'm on the left">
    <gd-button>Left</gd-button>
  </gd-tooltip>

  <gd-tooltip content="I'm in the middle">
    <gd-button>Center</gd-button>
  </gd-tooltip>

  <gd-tooltip content="I'm on the right">
    <gd-button>Right</gd-button>
  </gd-tooltip>
</gd-button-group>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlButtonGroup from '@gesdisc/components/dist/react/button-group';
import SlTooltip from '@gesdisc/components/dist/react/tooltip';

const App = () => (
  <>
    <SlButtonGroup label="Alignment">
      <SlTooltip content="I'm on the left">
        <SlButton>Left</SlButton>
      </SlTooltip>

      <SlTooltip content="I'm in the middle">
        <SlButton>Center</SlButton>
      </SlTooltip>

      <SlTooltip content="I'm on the right">
        <SlButton>Right</SlButton>
      </SlTooltip>
    </SlButtonGroup>
  </>
);
```

### Toolbar Example

Create interactive toolbars with button groups.

```html:preview
<div class="button-group-toolbar">
  <gd-button-group label="History">
    <gd-tooltip content="Undo">
      <gd-button><gd-icon name="arrow-counterclockwise" label="Undo"></gd-icon></gd-button>
    </gd-tooltip>
    <gd-tooltip content="Redo">
      <gd-button><gd-icon name="arrow-clockwise" label="Redo"></gd-icon></gd-button>
    </gd-tooltip>
  </gd-button-group>

  <gd-button-group label="Formatting">
    <gd-tooltip content="Bold">
      <gd-button><gd-icon name="type-bold" label="Bold"></gd-icon></gd-button>
    </gd-tooltip>
    <gd-tooltip content="Italic">
      <gd-button><gd-icon name="type-italic" label="Italic"></gd-icon></gd-button>
    </gd-tooltip>
    <gd-tooltip content="Underline">
      <gd-button><gd-icon name="type-underline" label="Underline"></gd-icon></gd-button>
    </gd-tooltip>
  </gd-button-group>

  <gd-button-group label="Alignment">
    <gd-tooltip content="Align Left">
      <gd-button><gd-icon name="justify-left" label="Align Left"></gd-icon></gd-button>
    </gd-tooltip>
    <gd-tooltip content="Align Center">
      <gd-button><gd-icon name="justify" label="Align Center"></gd-icon></gd-button>
    </gd-tooltip>
    <gd-tooltip content="Align Right">
      <gd-button><gd-icon name="justify-right" label="Align Right"></gd-icon></gd-button>
    </gd-tooltip>
  </gd-button-group>
</div>

<style>
  .button-group-toolbar gd-button-group:not(:last-of-type) {
    margin-right: var(--gd-spacing-x-small);
  }
</style>
```

```jsx:react
import SlButton from '@gesdisc/components/dist/react/button';
import SlButtonGroup from '@gesdisc/components/dist/react/button-group';
import SlIcon from '@gesdisc/components/dist/react/icon';
import SlTooltip from '@gesdisc/components/dist/react/tooltip';

const css = `
  .button-group-toolbar gd-button-group:not(:last-of-type) {
    margin-right: var(--gd-spacing-x-small);
  }
`;

const App = () => (
  <>
    <div className="button-group-toolbar">
      <SlButtonGroup label="History">
        <SlTooltip content="Undo">
          <SlButton>
            <SlIcon name="arrow-counterclockwise"></SlIcon>
          </SlButton>
        </SlTooltip>
        <SlTooltip content="Redo">
          <SlButton>
            <SlIcon name="arrow-clockwise"></SlIcon>
          </SlButton>
        </SlTooltip>
      </SlButtonGroup>

      <SlButtonGroup label="Formatting">
        <SlTooltip content="Bold">
          <SlButton>
            <SlIcon name="type-bold"></SlIcon>
          </SlButton>
        </SlTooltip>
        <SlTooltip content="Italic">
          <SlButton>
            <SlIcon name="type-italic"></SlIcon>
          </SlButton>
        </SlTooltip>
        <SlTooltip content="Underline">
          <SlButton>
            <SlIcon name="type-underline"></SlIcon>
          </SlButton>
        </SlTooltip>
      </SlButtonGroup>

      <SlButtonGroup label="Alignment">
        <SlTooltip content="Align Left">
          <SlButton>
            <SlIcon name="justify-left"></SlIcon>
          </SlButton>
        </SlTooltip>
        <SlTooltip content="Align Center">
          <SlButton>
            <SlIcon name="justify"></SlIcon>
          </SlButton>
        </SlTooltip>
        <SlTooltip content="Align Right">
          <SlButton>
            <SlIcon name="justify-right"></SlIcon>
          </SlButton>
        </SlTooltip>
      </SlButtonGroup>
    </div>

    <style>{css}</style>
  </>
);
```
