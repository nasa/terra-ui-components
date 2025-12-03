---
meta:
    title: Data Access
    description: Browse and filter collection granules, estimate sizes, and export download workflows.
layout: component
---

## Overview

The `<terra-data-access>` component provides a streamlined UI for discovering and exporting granules for a given data collection. It supports searching by filename, filtering by temporal range, spatial area, and cloud cover (when available), and estimating total download size. Users can export a ready-to-run Python script or open the experience in a Jupyter environment.

```html:preview
<terra-data-access short-name="MODISA_L2_OC" version="2022.0"></terra-data-access>
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
<terra-data-access short-name="MODISA_L2_OC" version="2022.0"></terra-data-access>
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

### Export Download Options

```html:preview
<terra-data-access short-name="MODISA_L2_OC" version="2022.0"></terra-data-access>
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

[component-metadata:terra-data-access]
