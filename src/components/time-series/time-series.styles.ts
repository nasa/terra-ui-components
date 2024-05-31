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

    edux-variable-combobox {
        grid-area: variable;
    }

    edux-spatial-picker {
        grid-area: spatial;
    }

    edux-plot {
        grid-area: plot;
    }

    edux-date-range-slider {
        grid-area: time;
    }

    /* The current Giovanni API doesn't accept bounding box subsetting. */
    edux-spatial-picker::part(leaflet-bbox),
    edux-spatial-picker::part(leaflet-edit) {
        display: none;
    }
`
