---
meta:
    title: Collection Visualization
    description: Renders the top layer of a CMR collection's GIBS imagery stack on a map, given only a collection id.
layout: component
---

`<terra-collection-visualization>` takes a CMR collection id — either an entry-id (e.g. `MOD09GA_6`) or a concept-id (e.g. `C194001241-LPDAAC_ECS`) — looks up the collection's associated [GIBS](https://gibs.earthdata.nasa.gov/) imagery via CMR's visualization metadata, and renders the "best available" layer on a [`<terra-map>`](/components/map).

Not every CMR collection has an associated GIBS visualization. When one isn't found, the component shows a message instead of an empty map.

```html:preview
<div style="height: 400px;">
    <terra-collection-visualization
        collection-id="C3550187110-ESDIS"
    ></terra-collection-visualization>
</div>
```

## Examples

### Using a collection entry-id

Entry-ids are resolved to a CMR concept-id automatically before looking up GIBS imagery.

```html:preview
<div style="height: 400px;">
    <terra-collection-visualization
        collection-id="Agricultural_Lands_Croplands_2000_v1_STD"
    ></terra-collection-visualization>
</div>
```

### Requesting a specific date

```html:preview
<div style="height: 400px;">
    <terra-collection-visualization
        collection-id="C3550187110-ESDIS"
        date="2024-06-01"
    ></terra-collection-visualization>
</div>
```

### Listening for the resolved layer

```html:preview
<div style="height: 400px;">
    <terra-collection-visualization
        id="layer-change-example"
        collection-id="C3550187110-ESDIS"
    ></terra-collection-visualization>
</div>

<script>
    document
        .getElementById('layer-change-example')
        .addEventListener('terra-collection-visualization-layer-change', e => {
            console.log('Resolved GIBS layer:', e.detail.gibsLayer)
        })
</script>
```

[component-metadata:terra-collection-visualization]
