---
meta:
    title: Breadcrumb
    description: A single breadcrumb item used inside `terra-breadcrumbs`.
layout: component
sidebarSection: Hidden
---

```html:preview
<terra-breadcrumb current>Current page</terra-breadcrumb>
```

## Examples

### Link vs. current page

Use `href` for navigable ancestors in the path and set `current` on the last breadcrumb to indicate the current page.

```html:preview
<terra-breadcrumbs>
    <terra-breadcrumb href="/">Home</terra-breadcrumb>
    <terra-breadcrumb href="/section">Section</terra-breadcrumb>
    <terra-breadcrumb current>Current page</terra-breadcrumb>
</terra-breadcrumbs>
```

When `current` is set, the underlying element will receive `aria-current="page"` for accessibility.

For accessibility, your app should always set `current` on exactly one breadcrumb in each `terra-breadcrumbs` trail (typically the last one). Leaving out `current` will still render visually, but assistive technologies won’t know which page in the trail is active.

[component-metadata:terra-breadcrumb]
