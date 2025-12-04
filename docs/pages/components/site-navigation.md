---
meta:
    title: Site Navigation
    description: Site navigation provides a flexible navigation structure with dropdown menus.
layout: component
---

```html:preview
<terra-site-navigation>
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
</terra-site-navigation>
```

## Examples

### Basic Navigation

A simple navigation with dropdown menus.

```html:preview
<terra-site-navigation>
    <terra-dropdown placement="bottom-start" distance="3" hover>
        <terra-button slot="trigger" size="medium" variant="text" caret>
            Data
        </terra-button>
        <terra-menu role="menu">
            <terra-menu-item value="catalog">
                <a href="#">Data Catalog</a>
            </terra-menu-item>
            <terra-menu-item value="alerts">
                <a href="#">Data Alerts and Outages</a>
            </terra-menu-item>
            <terra-menu-item value="projects">
                <a href="#">Projects</a>
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
```

### Full-Width Navigation

Use the `full-width` attribute to enable full-width dropdown panels that span the entire viewport.

```html:preview
<terra-site-navigation full-width>
    <terra-dropdown placement="bottom-start" distance="3" hover>
        <terra-button slot="trigger" size="medium" variant="text" caret>
            Data
        </terra-button>
        <div style="padding: var(--terra-spacing-large); background: var(--terra-panel-background-color); color: var(--terra-color-carbon-90);">
            <h3 style="margin-top: 0;">Data</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--terra-spacing-large);">
                <div>
                    <h4>Data Catalog</h4>
                    <p>Browse and search for Earth science data.</p>
                </div>
                <div>
                    <h4>Data Alerts</h4>
                    <p>Stay informed about data outages and updates.</p>
                </div>
                <div>
                    <h4>Projects</h4>
                    <p>Explore data projects and initiatives.</p>
                </div>
            </div>
        </div>
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
```

### Custom Dropdown Content

You can use any content in the dropdown slots, including custom HTML or other Terra components.

```html:preview
<terra-site-navigation>
    <terra-dropdown placement="bottom-start" distance="3" hover>
        <terra-button slot="trigger" size="medium" variant="text" caret>
            Custom Menu
        </terra-button>
        <div style="padding: var(--terra-spacing-medium); min-width: 300px;">
            <h4 style="margin-top: 0;">Custom Content</h4>
            <p>You can put any content here, including custom HTML, forms, or other components.</p>
            <terra-button variant="primary" size="small">Action Button</terra-button>
        </div>
    </terra-dropdown>
</terra-site-navigation>
```

[component-metadata:terra-site-navigation]
