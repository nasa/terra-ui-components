---
meta:
    title: Date Picker
    description: A versatile date picker component that supports both single date selection and date range selection, built on top of lit-flatpickr.
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

| Property        | Type                                                                                                                                  | Default    | Description                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `id`            | `string`                                                                                                                              | -          | The unique identifier for the date picker                                                          |
| `range`         | `boolean`                                                                                                                             | `false`    | Whether to show a date range picker (two inputs) or a single date picker                           |
| `minDate`       | `string`                                                                                                                              | -          | The minimum allowed date (format: YYYY-MM-DD)                                                      |
| `maxDate`       | `string`                                                                                                                              | -          | The maximum allowed date (format: YYYY-MM-DD)                                                      |
| `startDate`     | `string`                                                                                                                              | -          | The selected start date (in range mode) or single date (format: YYYY-MM-DD)                        |
| `endDate`       | `string`                                                                                                                              | -          | The selected end date (in range mode) (format: YYYY-MM-DD)                                         |
| `allowInput`    | `boolean`                                                                                                                             | `false`    | Allows the user to enter a date directly into the input field                                      |
| `altFormat`     | `string`                                                                                                                              | `'F j, Y'` | The format for the alternative input display (e.g., "March 20, 2024")                              |
| `altInput`      | `boolean`                                                                                                                             | `false`    | Shows a more readable date format in the input while maintaining the original format for the value |
| `altInputClass` | `string`                                                                                                                              | `''`       | Custom CSS class for the alternative input                                                         |
| `dateFormat`    | `string`                                                                                                                              | `'Y-m-d'`  | The format for the date display (e.g., "2024-03-20")                                               |
| `enableTime`    | `boolean`                                                                                                                             | `false`    | Enables time selection in the picker                                                               |
| `time24hr`      | `boolean`                                                                                                                             | `false`    | Uses 24-hour time format when time selection is enabled                                            |
| `weekNumbers`   | `boolean`                                                                                                                             | `false`    | Shows week numbers in the calendar                                                                 |
| `static`        | `boolean`                                                                                                                             | `false`    | Controls whether the calendar is positioned statically                                             |
| `position`      | `'auto' \| 'above' \| 'below'`                                                                                                        | `'auto'`   | Controls the calendar's position relative to the input                                             |
| `theme`         | `'light' \| 'dark' \| 'material_blue' \| 'material_red' \| 'material_green' \| 'material_orange' \| 'airbnb' \| 'confetti' \| 'none'` | `'light'`  | The visual theme of the date picker                                                                |

## Events

The component emits the following events:

-   `change`: Fired when a date is selected
    -   Event detail contains `selectedDates` array with the selected date(s)

## Examples

### Basic Usage

```html:preview
<terra-date-picker
  id="basic-picker"
  start-date="2024-03-20"
></terra-date-picker>
```

### Date Range with Time Selection

```html:preview
<terra-date-picker
  id="range-time-picker"
  range
  enable-time
  time-24hr
  start-date="2024-03-20T10:00"
  end-date="2024-03-25T15:30"
></terra-date-picker>
```

### Custom Format and Theme

```html:preview
<terra-date-picker
  id="custom-picker"
  date-format="Y-m-d"
  alt-format="F j, Y"
  alt-input
  theme="material_blue"
></terra-date-picker>
```

### With Week Numbers

```html:preview
<terra-date-picker
  id="week-picker"
  week-numbers
  position="below"
></terra-date-picker>
```

### Range with Two Months

```html:preview
<terra-date-picker
  id="two-month-picker"
  range
  show-months="2"
  start-date="2024-03-20"
  end-date="2024-04-15"
  min-date="2024-01-01"
  max-date="2024-12-31"
></terra-date-picker>
```

## Best Practices

1. Always provide an `id` for accessibility and to ensure unique identification
2. Use `minDate` and `maxDate` to prevent selection of invalid dates
3. Consider using `altInput` with `altFormat` for a more user-friendly display
4. Use `enableTime` only when time selection is necessary
5. Choose an appropriate theme that matches your application's design system

## Accessibility

The date picker is built with accessibility in mind:

-   Keyboard navigation support
-   ARIA attributes for screen readers
-   Focus management
-   Clear visual indicators for selected date

[component-metadata:terra-date-picker]
