---
meta:
    title: Data Subsetter History
    description: Shows a floating panel with a user's recent data subset requests and their status, with quick access to results and re-submission.
layout: component
---

## Overview

The `<terra-data-subsetter-history>` component displays a floating panel showing a user's recent data subset requests, their status, and quick access to results. It integrates with `<terra-data-subsetter>` for viewing and re-running jobs. The panel is typically shown in the lower right of the screen and is intended for authenticated users.

```html:preview
<terra-login style="width: 100%">
  <span slot="loading">Loading...</span>

  <terra-alert open variant="success" slot="logged-in">
    <terra-icon slot="icon" name="outline-check-circle" library="heroicons"></terra-icon>
    The history panel is at the bottom right of your screen
  </terra-alert>

  <p slot="logged-out">Please login to see your history</p>
</terra-login>

<terra-data-subsetter-history></terra-data-subsetter-history>
```

## Properties

| Property       | Type    | Default   | Description                                                         |
| -------------- | ------- | --------- | ------------------------------------------------------------------- |
| `label`        | string  | "History" | The label shown at the top of the history panel.                    |
| `bearer-token` | string  | —         | NASA Earthdata bearer token for fetching user-specific job history. |
| `always-show`  | boolean | false     | If true, always show the panel even if the user has no jobs.        |

## Best Practices

-   Use `always-show` if you want to encourage new users to create their first request.
-   Place the component once per page, typically at the root level, to avoid duplicate panels.
-   Clicking a job opens the full job details in a dialog for review or re-download.

## Accessibility

-   The panel and dialog are keyboard accessible.
-   All interactive elements have clear focus indicators.
-   Uses ARIA roles and labels for screen readers.

[component-metadata:terra-data-subsetter-history]
