---
meta:
    title: Site Header
    description: Site headers provide a consistent navigation structure at the top of pages.
layout: component
---

```html:preview
<terra-site-header site-name="Terra UI"></terra-site-header>
```

## Examples

### Basic Header

A basic header with just the site name.

```html:preview
<terra-site-header site-name="My Site"></terra-site-header>
```

### Header with Navigation

A header with navigation in the center slot.

```html:preview
<terra-site-header site-name="Terra UI">
    <terra-site-navigation slot="center">
        <terra-dropdown placement="bottom-start" distance="3" hover>
            <terra-button slot="trigger" size="medium" variant="text" caret>
                Data
            </terra-button>
            <terra-menu role="menu">
                <terra-menu-item value="catalog">
                    <a href="#">Data Catalog</a>
                </terra-menu-item>
                <terra-menu-item value="alerts">
                    <a href="#">Data Alerts</a>
                </terra-menu-item>
            </terra-menu>
        </terra-dropdown>
        <terra-dropdown placement="bottom-start" distance="3" hover>
            <terra-button slot="trigger" size="medium" variant="text" caret>
                Topics
            </terra-button>
            <terra-menu role="menu">
                <terra-menu-item value="atmosphere">
                    <a href="#">Atmosphere</a>
                </terra-menu-item>
                <terra-menu-item value="ocean">
                    <a href="#">Ocean</a>
                </terra-menu-item>
            </terra-menu>
        </terra-dropdown>
    </terra-site-navigation>
</terra-site-header>
```

### Custom Title Slot

You can customize the title slot with a link or other content.

```html:preview
<terra-site-header>
    <a slot="title" href="/" style="text-decoration: none; color: inherit;">Terra UI</a>
    <terra-site-navigation slot="center">
        <terra-dropdown placement="bottom-start" distance="3" hover>
            <terra-button slot="trigger" size="medium" variant="text" caret>
                About
            </terra-button>
            <terra-menu role="menu">
                <terra-menu-item value="overview">
                    <a href="#">Overview</a>
                </terra-menu-item>
            </terra-menu>
        </terra-dropdown>
    </terra-site-navigation>
    <div slot="right" style="display: flex; align-items: center; gap: var(--terra-spacing-small);">
        <button type="button" style="background: transparent; border: none; color: var(--terra-color-spacesuit-white); cursor: pointer; padding: var(--terra-spacing-2x-small);">
            <terra-icon name="search" library="heroicons"></terra-icon>
        </button>
    </div>
</terra-site-header>
```

[component-metadata:terra-site-header]
