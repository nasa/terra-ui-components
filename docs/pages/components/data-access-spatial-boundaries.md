---
meta:
    title: Data Access
    description: Browse and filter collection files (granules), estimate sizes, export download workflows and for those files that have supporting spatial metadata, view their boundaries on a map.
layout: component
---

## Overview

The `<terra-data-access-spatial-boundaries>` component extends the capabilities of the `<terra-data-access>` component to provide display of granule boundaries in addition to the information already displayed by `<terra-data-access>`.  For more information on the `<terra-data-access>` component view its documenation.

```html:preview
<terra-data-access-spatial-boundaries short-name="MODISA_L2_OC" version="2022.0"></terra-data-access-spatial-boundaries>
```

## Properties

| Property     | Type   | Default | Description                                                          |
| ------------ | ------ | ------- | -------------------------------------------------------------------- |
| `short-name` | string | —       | Collection short name used to construct the CMR Collection Entry ID. |
| `version`    | string | —       | Collection version used to construct the CMR Collection Entry ID.    |

Notes:

-   The component derives the CMR Collection Entry ID as `short-name_version` (e.g., `MODISA_L2_OC_2022.0`).
-   Cloud cover filtering appears only for collections that provide a cloud cover range.

## Events

This component does not emit custom events.

## Slots

| Slot      | Description |
| --------- | ----------- |
| (default) | Not used.   |

## Examples

### Basic Usage

```html:preview
<terra-data-access-spatial-boundaries short-name="FLDAS_NOAHMP001_G_CA_D" version="001"></terra-data-access-spatial-boundaries>
<br/>
<br/>
<terra-data-access-spatial-boundaries short-name="OCO3_L2_Standard" version="11r"></terra-data-access-spatial-boundaries>
<br/>
<br/>
<terra-data-access-spatial-boundaries short-name="S5P_L2__AER_AI_HiR" version="2"></terra-data-access-spatial-boundaries>
```

### With Filters (Temporal, Spatial, Cloud Cover)

```html:preview
<terra-data-access short-name="GPM_3IMERGDF" version="07"></terra-data-access>
```

Use the top filter bar to:

-   Search filenames
-   Choose a date range
-   Pick a spatial area (point, bounding box, or shape)
-   Adjust cloud cover (when available)

The results grid updates as filters change. The selection summary displays file count and estimated total size.

### Sub-daily Data

```html:preview
<terra-data-access short-name="GPM_3IMERGHHL" version="07"></terra-data-access>
```

Datepicker supports sub-daily granules. Select a date and then choose specific times from the dropdown.

### Export Download Options

```html:preview
<terra-data-access-spatial-boundaries short-name="MODISA_L2_OC" version="2022.0"></terra-data-access-spatial-boundaries>
```

-   Download Options → Python Script: generates a script pre-populated with your current filters.
-   Earthdata Download: currently not supported and will show a notice.
-   Open in Jupyter Notebook: opens an interactive flow using the `terra_ui_components` Python package.

## Best Practices

-   Provide both `short-name` and `version` so the component can query the correct collection.
-   Encourage users to set temporal and spatial filters to reduce result size and improve performance.
-   Cloud cover filter appears only when the collection supports it; do not rely on it being present.
-   Listen for grid sorting and filtering changes visually; no custom events are required.

## Accessibility

-   Filter controls and buttons are keyboard accessible.
-   Clear focus states and labels are provided for interactive elements.
-   Icons include accessible text where relevant, and controls include descriptive labels.

[component-metadata:terra-data-access-spatial-boundaries]
