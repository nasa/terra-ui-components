---
meta:
    title: Breadcrumbs
    description: Breadcrumbs show visitors where the current page sits in the site hierarchy and let them navigate back to higher-level pages.
layout: component
---

```html:preview
<terra-breadcrumbs>
    <terra-breadcrumb href="/">Home</terra-breadcrumb>
    <terra-breadcrumb href="/section">Section</terra-breadcrumb>
    <terra-breadcrumb current>Current page</terra-breadcrumb>
</terra-breadcrumbs>
```

## Examples

### Basic breadcrumbs

Use `terra-breadcrumbs` with one or more `terra-breadcrumb` items to show the path to the current page.

```html:preview
<terra-breadcrumbs>
    <terra-breadcrumb href="/">Home</terra-breadcrumb>
    <terra-breadcrumb href="/missions">Missions</terra-breadcrumb>
    <terra-breadcrumb current>Artemis</terra-breadcrumb>
</terra-breadcrumbs>
```

Always mark the last breadcrumb as current in your app:

-   This ensures the current page is styled correctly.
-   It also applies `aria-current="page"` to the active breadcrumb for screen readers. Omitting `current` means assistive technologies can’t reliably identify the current location.

### With longer hierarchies

Breadcrumbs should not display more than three levels of hierarchy. For deeper pages, replace the earlier levels with an ellipsis breadcrumb that you manage in your application.

```html:preview
<terra-breadcrumbs style="--terra-breadcrumbs-separator: '/';">
    <terra-breadcrumb>...</terra-breadcrumb>
    <terra-breadcrumb href="/missions">Missions</terra-breadcrumb>
    <terra-breadcrumb current>Artemis</terra-breadcrumb>
</terra-breadcrumbs>
```

In this example, your application is responsible for:

-   **Truncation logic**: choosing when to show the `...` breadcrumb and which levels to omit.
-   **Current page**: setting `current` on the last breadcrumb, which applies `aria-current="page"` for accessibility.

[component-metadata:terra-breadcrumbs]
