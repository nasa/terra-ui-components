---
meta:
    title: Data Subsetter
    description: Easily allow users to select, subset, and download NASA Earth science data collections with spatial, temporal, and variable filters.
layout: component
---

## Overview

The `<terra-data-subsetter>` component provides a complete UI for subsetting and downloading NASA Earth science data collections. It supports collection search, spatial/temporal/variable filtering, and download options. It can be embedded standalone or inside dialogs and supports advanced integration via properties and events.

```html:preview
<terra-data-subsetter collection-entry-id="OMAERO_003"></terra-data-subsetter>
```

## Properties

| Property                 | Type    | Default | Description                                                               |
| ------------------------ | ------- | ------- | ------------------------------------------------------------------------- |
| `collection-entry-id`    | string  | —       | The CMR Collection Entry ID to pre-select a collection.                   |
| `show-collection-search` | boolean | true    | Whether to show the collection search UI.                                 |
| `job-id`                 | string  | —       | If set, loads and displays the status/results for an existing subset job. |
| `bearer-token`           | string  | —       | Optional. Pass a NASA Earthdata bearer token for authenticated requests.  |

## Events

| Event                       | Description                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `terra-subset-job-complete` | Fired when a subset job enters a final state (e.g. successful, failed, completed_with_errors). The event detail contains the job object. |

## Slots

| Slot      | Description |
| --------- | ----------- |
| (default) | Not used.   |
| example   | Not used.   |

## Examples

### Basic Usage

```html:preview
<terra-data-subsetter collection-entry-id="OMAERO_003"></terra-data-subsetter>
```

### No collection (enables Collection search)

```html:preview
<terra-data-subsetter></terra-data-subsetter>
```

### Subsetter in a Dialog

```html:preview
<div style="height: 200px;">
    <terra-dialog id="my-dialog">
        <terra-data-subsetter collection-entry-id="OMAERO_003"></terra-data-subsetter>
    </terra-dialog>
    <terra-button for-dialog="my-dialog">
        Open Subsetter
    </terra-button>
</div>
```

### Displaying an Existing Job

```html:preview
<terra-data-subsetter job-id="harmony-job-123456"></terra-data-subsetter>
```

## Best Practices

-   Use `collection-entry-id` to pre-select a collection and skip the search UI for a streamlined experience.
-   Use `bearer-token` for authenticated users.
-   Place the component inside a dialog for a focused, modal workflow.
-   Listen for the `terra-subset-job-complete` event to trigger downstream actions (e.g., notifications, analytics).

## Accessibility

-   All form controls and buttons are keyboard accessible.
-   Uses ARIA roles and labels for screen readers.
-   Visual focus indicators are present for all interactive elements.

[component-metadata:terra-data-subsetter]
