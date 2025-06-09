---
meta:
    title: Time Series
    description: The time series is a plot of a sequence of data points that occur in successive order over some period of time for a given variable.
layout: component
---

## All Data Pre-Configured

```html:preview
<terra-time-series
    collection="NLDAS_FORA0125_H_2_0"
    variable="LWdown"
    start-date="01/01/2019"
    end-date="03/01/2019"
    location="33.9375,-86.9375"
></terra-time-series>
```

## Collection and Variable Pre-Configured

```html:preview
<terra-time-series
    collection="M2T1NXSLV_5_12_4"
    variable="V50M"
    start-date="05/03/2024"
    end-date="06/03/2024"
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
