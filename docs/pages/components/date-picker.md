---
meta:
    title: Date Picker
    description: A versatile date picker component that supports both single date selection and date range selection.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-date-picker></terra-date-picker>
```

```jsx:react
import TerraDatePicker from '@nasa-terra/components/dist/react/date-picker';

const App = () => <TerraDatePicker />;
```

## Usage

The Date Picker component implements the [Horizon Design System (HDS) Date Picker](https://website.nasa.gov/hds/) patterns. It is a form field that includes a calendar popup, which is used to select a single date. The component uses the `terra-input` component for the input field.

The date picker is useful for forms involving scheduling (for example, requesting a speaker for an event on a specific day). It allows users to type a date like a normal text field, or open the calendar popup, which helps format the date correctly.

Use help text to display the desired date formatting, in case visitors choose to type their date into the field.

```html:preview
<!-- Single date picker -->
<terra-date-picker
  id="my-date-picker"
  label="Event Date"
  start-date="2024-03-20"
  min-date="2024-01-01"
  max-date="2024-12-31"
  help-text="Format: YYYY-MM-DD"
></terra-date-picker>

<!-- Date range picker -->
<terra-date-picker
  id="my-range-picker"
  label="Date Range"
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
| `helpText`      | `help-text`      | `string`        | `''`                                  | Help text displayed below the input (e.g., "Format: YYYY-MM-DD")                              |
| `startLabel`    | `start-label`    | `string`        | -                                     | Custom label for the start date input (only used when `split-inputs` and `range` are true)    |
| `endLabel`      | `end-label`      | `string`        | -                                     | Custom label for the end date input (only used when `split-inputs` and `range` are true)      |
| `hideLabel`     | `hide-label`     | `boolean`       | `false`                               | Visually hide the label while keeping it accessible                                           |
| `enableTime`    | `enable-time`    | `boolean`       | `false`                               | Enables time selection UI (12-hour with AM/PM)                                                |
| `displayFormat` | `display-format` | `string`        | `YYYY-MM-DD` or `YYYY-MM-DD HH:mm:ss` | Display format for the input value                                                            |
| `showPresets`   | `show-presets`   | `boolean`       | `false`                               | Shows a sidebar with preset ranges; shown if preset overlaps `min/max`. Hidden if none remain |
| `presets`       | `presets`        | `PresetRange[]` | `[]` (auto-fill)                      | Custom preset ranges; when empty, a default set is provided                                   |
| `inline`        | `inline`         | `boolean`       | `false`                               | Displays the calendar inline (always visible) instead of as a popover dropdown                |
| `splitInputs`   | `split-inputs`   | `boolean`       | `false`                               | When `range` is true, displays two separate inputs side by side (one for start, one for end)  |

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

### Labels and Help Text

```html:preview
<terra-date-picker
  id="labeled-picker"
  label="Acquisition Date"
  help-text="Format: YYYY-MM-DD"
  start-date="2024-06-01"
></terra-date-picker>

<!-- Visually hide the label but keep it accessible -->
<terra-date-picker
  id="hidden-label-picker"
  label="Acquisition Date"
  hide-label
  help-text="Format: YYYY-MM-DD"
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

### Split Inputs

When using range mode, you can optionally display two separate inputs side by side instead of a single combined input. This is useful when you want clearer visual separation between the start and end dates.

```html:preview
<!-- Range picker with split inputs -->
<terra-date-picker
  id="split-inputs-picker"
  range
  split-inputs
  start-date="2024-03-20"
  end-date="2024-03-25"
></terra-date-picker>

<!-- Split inputs with inline calendar -->
<terra-date-picker
  id="split-inline-picker"
  range
  split-inputs
  inline
  start-date="2024-03-20"
  end-date="2024-03-25"
></terra-date-picker>
```

Note: The `split-inputs` prop only has an effect when `range` is `true`. When enabled, the labels will automatically append "(Start)" and "(End)" to the provided label, or use "Start Date" and "End Date" if no label is provided. You can customize the labels using the `start-label` and `end-label` properties.

```html:preview
<!-- Custom labels for split inputs -->
<terra-date-picker
  id="custom-labels-picker"
  range
  split-inputs
  start-label="From"
  end-label="To"
  start-date="2024-03-20"
  end-date="2024-03-25"
></terra-date-picker>
```

### Inline Mode

When `inline` is enabled, the calendar is always visible and displayed as part of the page flow rather than as a popover dropdown. The input field remains visible and displays the selected date(s), but clicking it does not toggle the calendar visibility since it's always shown.

```html:preview
<!-- Inline single date picker -->
<terra-date-picker
  id="inline-picker"
  inline
  start-date="2024-03-20"
></terra-date-picker>

<!-- Inline date range picker -->
<terra-date-picker
  id="inline-range-picker"
  inline
  range
  start-date="2024-03-20"
  end-date="2024-03-25"
></terra-date-picker>

<!-- Inline with presets -->
<terra-date-picker
  id="inline-preset-picker"
  inline
  range
  show-presets
></terra-date-picker>
```

## Best Practices

1. Always provide a `label` for accessibility - the component uses `terra-input` which requires proper labeling
2. Use `help-text` to display the desired date formatting (e.g., "Format: YYYY-MM-DD") in case visitors choose to type their date into the field
3. Always provide an `id` for accessibility and to ensure unique identification
4. Use `minDate` and `maxDate` to prevent selection of invalid dates
5. Use `displayFormat` to match the expected input display in your application
6. Use `enableTime` only when time selection is necessary
7. Show `showPresets` to accelerate common range selections when helpful
8. Use `inline` mode when you want the calendar to be permanently visible as part of the page layout

## Accessibility

The date picker is built with accessibility in mind:

-   Keyboard navigation support
-   ARIA attributes for screen readers
-   Focus management
-   Clear visual indicators for selected date

[component-metadata:terra-date-picker]
