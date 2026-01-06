---
meta:
    title: Button Group
    description: Button groups can be used to group related buttons into sections.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-button-group label="Alignment">
  <terra-button>Left</terra-button>
  <terra-button>Center</terra-button>
  <terra-button>Right</terra-button>
</terra-button-group>
```

```jsx:react
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraButtonGroup from '@nasa-terra/components/dist/react/button-group';

const App = () => (
  <TerraButtonGroup label="Alignment">
    <TerraButton>Left</TerraButton>
    <TerraButton>Center</TerraButton>
    <TerraButton>Right</TerraButton>
  </TerraButtonGroup>
);
```

## Examples

### Button Sizes

All button sizes are supported, but avoid mixing sizes within the same button group.

```html:preview
<div>
  <terra-button-group label="Alignment">
    <terra-button size="small">Left</terra-button>
    <terra-button size="small">Center</terra-button>
    <terra-button size="small">Right</terra-button>
  </terra-button-group>

  <br /><br />

  <terra-button-group label="Alignment">
    <terra-button size="medium">Left</terra-button>
    <terra-button size="medium">Center</terra-button>
    <terra-button size="medium">Right</terra-button>
  </terra-button-group>

  <br /><br />

  <terra-button-group label="Alignment">
    <terra-button size="large">Left</terra-button>
    <terra-button size="large">Center</terra-button>
    <terra-button size="large">Right</terra-button>
  </terra-button-group>
</div>
```

```jsx:react
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraButtonGroup from '@nasa-terra/components/dist/react/button-group';

const App = () => (
  <>
    <TerraButtonGroup label="Alignment">
      <TerraButton size="small">Left</TerraButton>
      <TerraButton size="small">Center</TerraButton>
      <TerraButton size="small">Right</TerraButton>
    </TerraButtonGroup>

    <br />
    <br />

    <TerraButtonGroup label="Alignment">
      <TerraButton size="medium">Left</TerraButton>
      <TerraButton size="medium">Center</TerraButton>
      <TerraButton size="medium">Right</TerraButton>
    </TerraButtonGroup>

    <br />
    <br />

    <TerraButtonGroup label="Alignment">
      <TerraButton size="large">Left</TerraButton>
      <TerraButton size="large">Center</TerraButton>
      <TerraButton size="large">Right</TerraButton>
    </TerraButtonGroup>
  </>
);
```

### Variants

Button variants are supported through the button's `variant` attribute.

```html:preview
<div>
  <terra-button-group label="Alignment">
    <terra-button variant="default">Left</terra-button>
    <terra-button variant="default">Center</terra-button>
    <terra-button variant="default">Right</terra-button>
  </terra-button-group>

  <br /><br />

  <terra-button-group label="Alignment">
    <terra-button variant="primary">Left</terra-button>
    <terra-button variant="primary">Center</terra-button>
    <terra-button variant="primary">Right</terra-button>
  </terra-button-group>

  <br /><br />

  <terra-button-group label="Alignment">
    <terra-button variant="success">Left</terra-button>
    <terra-button variant="success">Center</terra-button>
    <terra-button variant="success">Right</terra-button>
  </terra-button-group>

  <br /><br />

  <terra-button-group label="Alignment">
    <terra-button variant="warning">Left</terra-button>
    <terra-button variant="warning">Center</terra-button>
    <terra-button variant="warning">Right</terra-button>
  </terra-button-group>

  <br /><br />

  <terra-button-group label="Alignment">
    <terra-button variant="danger">Left</terra-button>
    <terra-button variant="danger">Center</terra-button>
    <terra-button variant="danger">Right</terra-button>
  </terra-button-group>
</div>
```

```jsx:react
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraButtonGroup from '@nasa-terra/components/dist/react/button-group';

const App = () => (
  <>
    <TerraButtonGroup label="Alignment">
      <TerraButton variant="default">Left</TerraButton>
      <TerraButton variant="default">Center</TerraButton>
      <TerraButton variant="default">Right</TerraButton>
    </TerraButtonGroup>

    <br />
    <br />

    <TerraButtonGroup label="Alignment">
      <TerraButton variant="primary">Left</TerraButton>
      <TerraButton variant="primary">Center</TerraButton>
      <TerraButton variant="primary">Right</TerraButton>
    </TerraButtonGroup>

    <br />
    <br />

    <TerraButtonGroup label="Alignment">
      <TerraButton variant="success">Left</TerraButton>
      <TerraButton variant="success">Center</TerraButton>
      <TerraButton variant="success">Right</TerraButton>
    </TerraButtonGroup>

    <br />
    <br />

    <TerraButtonGroup label="Alignment">
      <TerraButton variant="warning">Left</TerraButton>
      <TerraButton variant="warning">Center</TerraButton>
      <TerraButton variant="warning">Right</TerraButton>
    </TerraButtonGroup>

    <br />
    <br />

    <TerraButtonGroup label="Alignment">
      <TerraButton variant="danger">Left</TerraButton>
      <TerraButton variant="danger">Center</TerraButton>
      <TerraButton variant="danger">Right</TerraButton>
    </TerraButtonGroup>
  </>
);
```

### Outline Buttons

Outline buttons work well in button groups.

```html:preview
<div>
  <terra-button-group label="Alignment">
    <terra-button variant="primary" outline>Left</terra-button>
    <terra-button variant="primary" outline>Center</terra-button>
    <terra-button variant="primary" outline>Right</terra-button>
  </terra-button-group>

  <br /><br />

  <terra-button-group label="Alignment">
    <terra-button variant="success" outline>Left</terra-button>
    <terra-button variant="success" outline>Center</terra-button>
    <terra-button variant="success" outline>Right</terra-button>
  </terra-button-group>
</div>
```

```jsx:react
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraButtonGroup from '@nasa-terra/components/dist/react/button-group';

const App = () => (
  <>
    <TerraButtonGroup label="Alignment">
      <TerraButton variant="primary" outline>
        Left
      </TerraButton>
      <TerraButton variant="primary" outline>
        Center
      </TerraButton>
      <TerraButton variant="primary" outline>
        Right
      </TerraButton>
    </TerraButtonGroup>

    <br />
    <br />

    <TerraButtonGroup label="Alignment">
      <TerraButton variant="success" outline>
        Left
      </TerraButton>
      <TerraButton variant="success" outline>
        Center
      </TerraButton>
      <TerraButton variant="success" outline>
        Right
      </TerraButton>
    </TerraButtonGroup>
  </>
);
```

### Dropdowns in Button Groups

Dropdowns can be placed inside button groups as long as the trigger is a `<terra-button>` element.

```html:preview
<terra-button-group label="Example Button Group">
  <terra-button>Button</terra-button>
  <terra-button>Button</terra-button>
  <terra-dropdown>
    <terra-button slot="trigger" caret>Dropdown</terra-button>
    <terra-menu>
      <terra-menu-item>Item 1</terra-menu-item>
      <terra-menu-item>Item 2</terra-menu-item>
      <terra-menu-item>Item 3</terra-menu-item>
    </terra-menu>
  </terra-dropdown>
</terra-button-group>
```

```jsx:react
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraButtonGroup from '@nasa-terra/components/dist/react/button-group';
import TerraDropdown from '@nasa-terra/components/dist/react/dropdown';
import TerraMenu from '@nasa-terra/components/dist/react/menu';
import TerraMenuItem from '@nasa-terra/components/dist/react/menu-item';

const App = () => (
  <TerraButtonGroup label="Example Button Group">
    <TerraButton>Button</TerraButton>
    <TerraButton>Button</TerraButton>
    <TerraDropdown>
      <TerraButton slot="trigger" caret>
        Dropdown
      </TerraButton>
      <TerraMenu>
        <TerraMenuItem>Item 1</TerraMenuItem>
        <TerraMenuItem>Item 2</TerraMenuItem>
        <TerraMenuItem>Item 3</TerraMenuItem>
      </TerraMenu>
    </TerraDropdown>
  </TerraButtonGroup>
);
```

### Tooltips in Button Groups

Buttons can be wrapped in tooltips to provide more detail when the user interacts with them.

```html:preview
<terra-button-group label="Alignment">
  <terra-tooltip content="I'm on the left">
    <terra-button>Left</terra-button>
  </terra-tooltip>

  <terra-tooltip content="I'm in the middle">
    <terra-button>Center</terra-button>
  </terra-tooltip>

  <terra-tooltip content="I'm on the right">
    <terra-button>Right</terra-button>
  </terra-tooltip>
</terra-button-group>
```

```jsx:react
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraButtonGroup from '@nasa-terra/components/dist/react/button-group';
import TerraTooltip from '@nasa-terra/components/dist/react/tooltip';

const App = () => (
  <TerraButtonGroup label="Alignment">
    <TerraTooltip content="I'm on the left">
      <TerraButton>Left</TerraButton>
    </TerraTooltip>

    <TerraTooltip content="I'm in the middle">
      <TerraButton>Center</TerraButton>
    </TerraTooltip>

    <TerraTooltip content="I'm on the right">
      <TerraButton>Right</TerraButton>
    </TerraTooltip>
  </TerraButtonGroup>
);
```

### Toolbar Example

Create interactive toolbars with button groups.

```html:preview
<div class="button-group-toolbar">
  <terra-button-group label="History">
    <terra-tooltip content="Undo">
      <terra-button outline><terra-icon name="outline-arrow-uturn-left" library="heroicons"></terra-icon></terra-button>
    </terra-tooltip>
    <terra-tooltip content="Redo">
      <terra-button outline><terra-icon name="outline-arrow-uturn-right" library="heroicons"></terra-icon></terra-button>
    </terra-tooltip>
  </terra-button-group>

  <terra-button-group label="Formatting">
    <terra-tooltip content="Bold">
      <terra-button outline><terra-icon name="outline-bold" library="heroicons"></terra-icon></terra-button>
    </terra-tooltip>
    <terra-tooltip content="Italic">
      <terra-button outline><terra-icon name="outline-italic" library="heroicons"></terra-icon></terra-button>
    </terra-tooltip>
    <terra-tooltip content="Underline">
      <terra-button outline><terra-icon name="outline-underline" library="heroicons"></terra-icon></terra-button>
    </terra-tooltip>
  </terra-button-group>

  <terra-button-group label="Alignment">
    <terra-tooltip content="Align Left">
      <terra-button outline><terra-icon name="outline-bars-3-bottom-left" library="heroicons"></terra-icon></terra-button>
    </terra-tooltip>
    <terra-tooltip content="Align Center">
      <terra-button outline><terra-icon name="outline-bars-3" library="heroicons"></terra-icon></terra-button>
    </terra-tooltip>
    <terra-tooltip content="Align Right">
      <terra-button outline><terra-icon name="outline-bars-3-bottom-right" library="heroicons"></terra-icon></terra-button>
    </terra-tooltip>
  </terra-button-group>
</div>

<style>
  .button-group-toolbar terra-button-group:not(:last-of-type) {
    margin-right: var(--terra-spacing-x-small);
  }
</style>
```

```jsx:react
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraButtonGroup from '@nasa-terra/components/dist/react/button-group';
import TerraIcon from '@nasa-terra/components/dist/react/icon';
import TerraTooltip from '@nasa-terra/components/dist/react/tooltip';

const css = `
  .button-group-toolbar terra-button-group:not(:last-of-type) {
    margin-right: var(--terra-spacing-x-small);
  }
`;

const App = () => (
  <>
    <div className="button-group-toolbar">
      <TerraButtonGroup label="History">
        <TerraTooltip content="Undo">
          <TerraButton>
            <TerraIcon name="outline-arrow-uturn-left" library="heroicons"></TerraIcon>
          </TerraButton>
        </TerraTooltip>
        <TerraTooltip content="Redo">
          <TerraButton>
            <TerraIcon name="outline-arrow-uturn-right" library="heroicons"></TerraIcon>
          </TerraButton>
        </TerraTooltip>
      </TerraButtonGroup>

      <TerraButtonGroup label="Formatting">
        <TerraTooltip content="Bold">
          <TerraButton>
            <TerraIcon name="outline-bold" library="heroicons"></TerraIcon>
          </TerraButton>
        </TerraTooltip>
        <TerraTooltip content="Italic">
          <TerraButton>
            <TerraIcon name="outline-italic" library="heroicons"></TerraIcon>
          </TerraButton>
        </TerraTooltip>
        <TerraTooltip content="Underline">
          <TerraButton>
            <TerraIcon name="outline-underline" library="heroicons"></TerraIcon>
          </TerraButton>
        </TerraTooltip>
      </TerraButtonGroup>

      <TerraButtonGroup label="Alignment">
        <TerraTooltip content="Align Left">
          <TerraButton>
            <TerraIcon name="outline-align-left" library="heroicons"></TerraIcon>
          </TerraButton>
        </TerraTooltip>
        <TerraTooltip content="Align Center">
          <TerraButton>
            <TerraIcon name="outline-align-center" library="heroicons"></TerraIcon>
          </TerraButton>
        </TerraTooltip>
        <TerraTooltip content="Align Right">
          <TerraButton>
            <TerraIcon name="outline-align-right" library="heroicons"></TerraIcon>
          </TerraButton>
        </TerraTooltip>
      </TerraButtonGroup>
    </div>

    <style>{css}</style>
  </>
);
```

[component-metadata:terra-button-group]
