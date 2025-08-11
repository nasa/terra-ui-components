---
meta:
    title: Time Series
    description: The time series is a plot of a sequence of data points that occur in successive order over some period of time for a given variable.
layout: component
---

## Point-based Time Series

```html:preview
<terra-login style="width: 100%">
    <span slot="loading">Loading...please wait</span>

    <terra-time-series slot="logged-in"
        collection="NLDAS_FORA0125_H_2_0"
        variable="LWdown"
        start-date="01/01/2019"
        end-date="03/01/2019"
        location="33.9375,-86.9375"
    ></terra-time-series>

    <p slot="logged-out">Please login to view this plot</p>
</terra-login>
```

## Area-averaged Time Series

```html:preview
<terra-login style="width: 100%">
    <span slot="loading">Loading...please wait</span>

    <template slot="logged-in">
        <terra-time-series
            collection="M2T1NXAER_5.12.4"
            variable="BCCMASS"
            start-date="01/01/2009"
            end-date="01/05/2009"
            location="62,5,95,40"
        ></terra-time-series>
    </template>

    <p slot="logged-out">Please login to view this plot</p>
</terra-login>
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
