---
meta:
    title: Time Series
    description: The time series is a plot of a sequence of data points that occur in successive order over some period of time for a given variable.
layout: component
---

```html:preview
<edux-time-series
    collection="M2T1NXSLV_5_12_4"
    variable="V50M"
    start-date="05/03/2024"
    end-date="06/03/2024"
></edux-time-series>
```

```jsx:react
import EduxTimeSeries from '@nasa/earthdata-ux-components/dist/react/time-series'

const App = () => <EduxTimeSeries 
    collection="GPM_3IMERGHH_06"
    variable="precipitationCal"
    start-date="01/01/2019"
    end-date="09/01/2021"></EduxTimeSeries>
```

[component-metadata:edux-time-series]
