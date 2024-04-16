import { css } from 'lit'

export default css`
    @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    @import url('https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css');

    :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 600px;
    }

    #map {
        height: 300px;
    }
`
