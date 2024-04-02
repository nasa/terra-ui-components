---
meta:
  title: Format Number
  description: Formats a number using the specified locale and options.
layout: component
---

Localization is handled by the browser's [`Intl.NumberFormat` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat). No language packs are required.

```html:preview
<div class="format-number-overview">
  <gd-format-number value="1000"></gd-format-number>
  <br /><br />
  <gd-input type="number" value="1000" label="Number to Format" style="max-width: 180px;"></gd-input>
</div>

<script>
  const container = document.querySelector('.format-number-overview');
  const formatter = container.querySelector('gd-format-number');
  const input = container.querySelector('gd-input');

  input.addEventListener('gd-input', () => (formatter.value = input.value || 0));
</script>
```

{% raw %}

```jsx:react
import { useState } from 'react';
import SlFormatNumber from '@gesdisc/components/dist/react/format-number';
import SlInput from '@gesdisc/components/dist/react/input';

const App = () => {
  const [value, setValue] = useState(1000);

  return (
    <>
      <SlFormatNumber value={value} />
      <br />
      <br />
      <SlInput
        type="number"
        value={value}
        label="Number to Format"
        style={{ maxWidth: '180px' }}
        onSlInput={event => setValue(event.target.value)}
      />
    </>
  );
};
```

{% endraw %}

## Examples

### Percentages

To get the value as a percent, set the `type` attribute to `percent`.

```html:preview
<gd-format-number type="percent" value="0"></gd-format-number><br />
<gd-format-number type="percent" value="0.25"></gd-format-number><br />
<gd-format-number type="percent" value="0.50"></gd-format-number><br />
<gd-format-number type="percent" value="0.75"></gd-format-number><br />
<gd-format-number type="percent" value="1"></gd-format-number>
```

```jsx:react
import SlFormatNumber from '@gesdisc/components/dist/react/format-number';

const App = () => (
  <>
    <SlFormatNumber type="percent" value={0} />
    <br />
    <SlFormatNumber type="percent" value={0.25} />
    <br />
    <SlFormatNumber type="percent" value={0.5} />
    <br />
    <SlFormatNumber type="percent" value={0.75} />
    <br />
    <SlFormatNumber type="percent" value={1} />
  </>
);
```

### Localization

Use the `lang` attribute to set the number formatting locale.

```html:preview
English: <gd-format-number value="2000" lang="en" minimum-fraction-digits="2"></gd-format-number><br />
German: <gd-format-number value="2000" lang="de" minimum-fraction-digits="2"></gd-format-number><br />
Russian: <gd-format-number value="2000" lang="ru" minimum-fraction-digits="2"></gd-format-number>
```

```jsx:react
import SlFormatNumber from '@gesdisc/components/dist/react/format-number';

const App = () => (
  <>
    English: <SlFormatNumber value="2000" lang="en" minimum-fraction-digits="2" />
    <br />
    German: <SlFormatNumber value="2000" lang="de" minimum-fraction-digits="2" />
    <br />
    Russian: <SlFormatNumber value="2000" lang="ru" minimum-fraction-digits="2" />
  </>
);
```

### Currency

To format a number as a monetary value, set the `type` attribute to `currency` and set the `currency` attribute to the desired ISO 4217 currency code. You should also specify `lang` to ensure the the number is formatted correctly for the target locale.

```html:preview
<gd-format-number type="currency" currency="USD" value="2000" lang="en-US"></gd-format-number><br />
<gd-format-number type="currency" currency="GBP" value="2000" lang="en-GB"></gd-format-number><br />
<gd-format-number type="currency" currency="EUR" value="2000" lang="de"></gd-format-number><br />
<gd-format-number type="currency" currency="RUB" value="2000" lang="ru"></gd-format-number><br />
<gd-format-number type="currency" currency="CNY" value="2000" lang="zh-cn"></gd-format-number>
```

```jsx:react
import SlFormatNumber from '@gesdisc/components/dist/react/format-number';

const App = () => (
  <>
    <SlFormatNumber type="currency" currency="USD" value="2000" lang="en-US" />
    <br />
    <SlFormatNumber type="currency" currency="GBP" value="2000" lang="en-GB" />
    <br />
    <SlFormatNumber type="currency" currency="EUR" value="2000" lang="de" />
    <br />
    <SlFormatNumber type="currency" currency="RUB" value="2000" lang="ru" />
    <br />
    <SlFormatNumber type="currency" currency="CNY" value="2000" lang="zh-cn" />
  </>
);
```
