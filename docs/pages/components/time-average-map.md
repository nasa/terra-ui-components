---
meta:
    title: Time Average Map
    description:
layout: component
---

## Examples

### Render of geotiff data from time average map service.

```html:preview
<terra-login style="width: 100%">
    <span slot="loading">Loading...please wait</span>

    <terra-time-average-map slot="logged-in"
        collection="M2T1NXAER_5_12_4"
        variable="BCCMASS"
        start-date="01/01/2009"
        end-date="01/05/2009"
        location="62,5,95,40"
    ></terra-time-average-map>

    <p slot="logged-out">Please login to view this plot</p>
</terra-login><br /><br />
<terra-login style="width: 100%">
    <span slot="loading">Loading...please wait</span>

    <terra-time-average-map slot="logged-in"
        collection="GLDAS_CLSM025_D_2_0"
        variable="Qg_tavg"
        start-date="01/01/2009"
        end-date="02/01/2009"
        location="-125.59,30.75,-112.14,43.46"
    ></terra-time-average-map>
</terra-login>

<script>
    document.querySelector('terra-time-average-map').addEventListener('terra-time-average-map-data-change', (e) => {
        console.log('caught! ', e)
    })
</script>
```
