---
meta:
  title: Format Date
  description: Formats a date/time using the specified locale and options.
layout: component
---

Localization is handled by the browser's [`Intl.DateTimeFormat` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat). No language packs are required.

```html:preview
<!-- Shoelace 2 release date 🎉 -->
<gd-format-date date="2020-07-15T09:17:00-04:00"></gd-format-date>
```

```jsx:react
import SlFormatDate from '@gesdisc/components/dist/react/format-date';

const App = () => <SlFormatDate date="2020-07-15T09:17:00-04:00" />;
```

The `date` attribute determines the date/time to use when formatting. It must be a string that [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) can interpret or a [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object set via JavaScript. If omitted, the current date/time will be assumed.

:::tip
When using strings, avoid ambiguous dates such as `03/04/2020` which can be interpreted as March 4 or April 3 depending on the user's browser and locale. Instead, always use a valid [ISO 8601 date time string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#Date_Time_String_Format) to ensure the date will be parsed properly by all clients.
:::

## Examples

### Date & Time Formatting

Formatting options are based on those found in the [`Intl.DateTimeFormat` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat). When formatting options are provided, the date/time will be formatted according to those values. When no formatting options are provided, a localized, numeric date will be displayed instead.

```html:preview
<!-- Human-readable date -->
<gd-format-date month="long" day="numeric" year="numeric"></gd-format-date><br />

<!-- Time -->
<gd-format-date hour="numeric" minute="numeric"></gd-format-date><br />

<!-- Weekday -->
<gd-format-date weekday="long"></gd-format-date><br />

<!-- Month -->
<gd-format-date month="long"></gd-format-date><br />

<!-- Year -->
<gd-format-date year="numeric"></gd-format-date><br />

<!-- No formatting options -->
<gd-format-date></gd-format-date>
```

```jsx:react
import SlFormatDate from '@gesdisc/components/dist/react/format-date';

const App = () => (
  <>
    {/* Human-readable date */}
    <SlFormatDate month="long" day="numeric" year="numeric" />
    <br />

    {/* Time */}
    <SlFormatDate hour="numeric" minute="numeric" />
    <br />

    {/* Weekday */}
    <SlFormatDate weekday="long" />
    <br />

    {/* Month */}
    <SlFormatDate month="long" />
    <br />

    {/* Year */}
    <SlFormatDate year="numeric" />
    <br />

    {/* No formatting options */}
    <SlFormatDate />
  </>
);
```

### Hour Formatting

By default, the browser will determine whether to use 12-hour or 24-hour time. To force one or the other, set the `hour-format` attribute to `12` or `24`.

```html:preview
<gd-format-date hour="numeric" minute="numeric" hour-format="12"></gd-format-date><br />
<gd-format-date hour="numeric" minute="numeric" hour-format="24"></gd-format-date>
```

```jsx:react
import SlFormatDate from '@gesdisc/components/dist/react/format-date';

const App = () => (
  <>
    <SlFormatDate hour="numeric" minute="numeric" hour-format="12" />
    <br />
    <SlFormatDate hour="numeric" minute="numeric" hour-format="24" />
  </>
);
```

### Localization

Use the `lang` attribute to set the date/time formatting locale.

```html:preview
English: <gd-format-date lang="en"></gd-format-date><br />
French: <gd-format-date lang="fr"></gd-format-date><br />
Russian: <gd-format-date lang="ru"></gd-format-date>
```

```jsx:react
import SlFormatDate from '@gesdisc/components/dist/react/format-date';

const App = () => (
  <>
    English: <SlFormatDate lang="en" />
    <br />
    French: <SlFormatDate lang="fr" />
    <br />
    Russian: <SlFormatDate lang="ru" />
  </>
);
```
