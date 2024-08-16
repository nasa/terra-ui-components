import { css } from 'lit'

export default css`
    :host {
        display: grid;
        gap: 0.25rem 1rem;
        grid-template-areas:
            'variable spatial'
            'plot plot'
            'time time';
        grid-template-columns: 1fr 1fr;
    }

    terra-variable-combobox {
        grid-area: variable;
    }

    terra-spatial-picker {
        grid-area: spatial;
    }

    terra-plot {
        grid-area: plot;
    }

    terra-date-range-slider {
        grid-area: time;
    }

    /* The current Giovanni API doesn't accept bounding box subsetting. */
    terra-spatial-picker::part(leaflet-bbox),
    terra-spatial-picker::part(leaflet-edit) {
        display: none;
    }
`
