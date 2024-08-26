---
meta:
    title: Time Series
    description: The time series is a plot of a sequence of data points that occur in successive order over some period of time for a given variable.
layout: component
---

## All Data Pre-Configured

```html:preview
<terra-time-series
    collection="GPM_3IMERGHH_06"
    variable="precipitationCal"
    start-date="01/01/2019"
    end-date="09/01/2021"
    location="39.002944230066724,-76.87690658569336"
></terra-time-series>
```

## Collection and Variable Pre-Configured

```html:preview
<terra-time-series
    collection="GPM_3IMERGHH_06"
    variable="precipitationCal"
></terra-time-series>
```

## No Pre-Configured Data

```html:preview
<terra-time-series
></terra-time-series>
```

```jsx:react
import TerraTimeSeries from '@nasa-terra/components/dist/react/time-series'

const App = () => <TerraTimeSeries
    collection="GPM_3IMERGHH_06"
    variable="precipitationCal"
    start-date="01/01/2019"
    end-date="09/01/2021"></TerraTimeSeries>
```

[component-metadata:terra-time-series]
