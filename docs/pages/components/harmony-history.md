---
meta:
    title: Harmony History
    description:
layout: component
sidebarSection: Hidden
---

```html:preview
<terra-login style="width: 100%">
    <span slot="loading">Loading...please wait</span>

    <div slot="logged-in" id="demo" style="padding: 100px 0;">
        <terra-harmony-history filter-by-labels="terra-time-series,terra-time-average-map" remove-labels-on-delete></terra-harmony-history>
        <button>Reset</button>
    </div>

    <p slot="logged-out">Please login to view this component</p>
</terra-login>

<script>
    const demo = document.getElementById('demo')

    demo.querySelector('button').addEventListener('click', () => {
        demo.querySelector('terra-harmony-history').refresh()
    })
</script>
```

## Examples

### First Example

TODO

### Second Example

TODO

[component-metadata:terra-harmony-history]
