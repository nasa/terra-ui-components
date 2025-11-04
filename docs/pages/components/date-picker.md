---
meta:
    title: Date Picker
    description: A versatile date picker component that supports both single date selection and date range selection.
layout: component
---

```html:preview
<terra-date-picker></terra-date-picker>
```

```jsx:react
import TerraDatePicker from '@nasa-terra/components/dist/react/date-picker';

const App = () => <TerraDatePicker />;
```

## Usage

```html:preview
<!-- Single date picker -->
<terra-date-picker
  id="my-date-picker"
  start-date="2024-03-20"
  min-date="2024-01-01"
  max-date="2024-12-31"
></terra-date-picker>

<!-- Date range picker -->
<terra-date-picker
  id="my-range-picker"
  range
  start-date="2024-03-20"
  end-date="2024-03-25"
  min-date="2024-01-01"
  max-date="2024-12-31"
></terra-date-picker>
```

## Properties

| Property        | Attribute        | Type            | Default                               | Description                                                                                   |
| --------------- | ---------------- | --------------- | ------------------------------------- | --------------------------------------------------------------------------------------------- |
| `id`            | `id`             | `string`        | -                                     | The unique identifier for the date picker                                                     |
| `range`         | `range`          | `boolean`       | `false`                               | Enables date range picking (two calendars)                                                    |
| `minDate`       | `min-date`       | `string`        | -                                     | Minimum selectable date (YYYY-MM-DD)                                                          |
| `maxDate`       | `max-date`       | `string`        | -                                     | Maximum selectable date (YYYY-MM-DD)                                                          |
| `startDate`     | `start-date`     | `string`        | -                                     | Initial start/single date (ISO or YYYY-MM-DD)                                                 |
| `endDate`       | `end-date`       | `string`        | -                                     | Initial end date (range mode; ISO or YYYY-MM-DD)                                              |
| `label`         | `label`          | `string`        | `"Select Date"`                       | Input label text                                                                              |
| `hideLabel`     | `hide-label`     | `boolean`       | `false`                               | Visually hide the label while keeping it accessible                                           |
| `enableTime`    | `enable-time`    | `boolean`       | `false`                               | Enables time selection UI (12-hour with AM/PM)                                                |
| `displayFormat` | `display-format` | `string`        | `YYYY-MM-DD` or `YYYY-MM-DD HH:mm:ss` | Display format for the input value                                                            |
| `showPresets`   | `show-presets`   | `boolean`       | `false`                               | Shows a sidebar with preset ranges; shown if preset overlaps `min/max`. Hidden if none remain |
| `presets`       | `presets`        | `PresetRange[]` | `[]` (auto-fill)                      | Custom preset ranges; when empty, a default set is provided                                   |

## Events

The component emits:

-   `terra-date-range-change`: Fired when a selection is made or changed
    -   Event `detail`: `{ startDate: string, endDate: string }`
        -   If `enable-time` is off, values are `YYYY-MM-DD`
        -   If `enable-time` is on, values are ISO strings (e.g., `2024-03-20T10:00:00.000Z`)

## Examples

### Basic Usage

```html:preview
<terra-date-picker
  id="basic-picker"
  start-date="2024-03-20"
></terra-date-picker>
```

### Date Range

```html:preview
<terra-date-picker
  id="range-picker"
  range
  start-date="2024-03-20"
  end-date="2024-03-25"
></terra-date-picker>
```

### With Time Selection

```html:preview
<terra-date-picker
  id="range-time-picker"
  range
  enable-time
  start-date="2024-03-20T10:00:00Z"
  end-date="2024-03-25T15:30:00Z"
></terra-date-picker>
```

### Custom Display Format

```html:preview
<terra-date-picker
  id="custom-format-picker"
  start-date="2024-03-20"
  display-format="YYYY/MM/DD"
></terra-date-picker>
```

### Labels and Accessibility

```html:preview
<terra-date-picker
  id="labeled-picker"
  label="Acquisition Date"
  start-date="2024-06-01"
></terra-date-picker>

<!-- Visually hide the label but keep it accessible -->
<terra-date-picker
  id="hidden-label-picker"
  label="Acquisition Date"
  hide-label
  start-date="2024-06-01"
></terra-date-picker>
```

### Preset Ranges Sidebar

```html:preview
<!-- Default presets provided when show-presets is enabled -->
<terra-date-picker
  id="preset-picker"
  range
  show-presets
></terra-date-picker>
```

Note: Presets are shown if any part of the preset range overlaps the `min-date`/`max-date` window. When a preset is selected, dates are clamped to the allowed range. If no presets overlap, the sidebar is hidden.

### Min/Max Constraints

```html:preview
<terra-date-picker
  id="bounded-picker"
  range
  min-date="2024-01-01"
  max-date="2024-12-31"
></terra-date-picker>
```

### Presets With Min/Max

```html:preview
<terra-date-picker
  id="preset-bounded-picker"
  range
  show-presets
  min-date="2024-03-15"
  max-date="2024-03-20"
></terra-date-picker>
```

Only presets whose start and end are within the bounds are shown. If none qualify, the sidebar is hidden.

## Best Practices

1. Always provide an `id` for accessibility and to ensure unique identification
2. Use `minDate` and `maxDate` to prevent selection of invalid dates
3. Use `displayFormat` to match the expected input display in your application
4. Use `enableTime` only when time selection is necessary
5. Show `showPresets` to accelerate common range selections when helpful

## Accessibility

The date picker is built with accessibility in mind:

-   Keyboard navigation support
-   ARIA attributes for screen readers
-   Focus management
-   Clear visual indicators for selected date

[component-metadata:terra-date-picker]
