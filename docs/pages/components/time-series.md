---
meta:
    title: Time Series
    description: The time series is a plot of a sequence of data points that occur in successive order over some period of time for a given variable.
layout: component
---

```html:preview
<gd-time-series
    collection="GPM_3IMERGHH_06"
    variable="precipitationCal"
    min-date="06/01/2000"
    max-date="09/30/2021"
    start-date="01/01/2019"
    end-date="09/01/2021"
></gd-time-series>
```

```jsx:react
import GdTimeSeries from '@gesdisc/components/dist/react/time-series'

const App = () => <GdTimeSeries 
    collection="GPM_3IMERGHH_06"
    variable="precipitationCal"
    min-date="06/01/2000"
    max-date="09/30/2021"
    start-date="01/01/2019"
    end-date="09/01/2021"></GdTimeSeries>
```

[component-metadata:gd-time-series]
