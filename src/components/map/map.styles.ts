import { css } from 'lit'

export default css`
    :host {
        display: block;
        padding: 16px;
        background: var(--edux-map-background-color);
        border: 1px solid var(--edux-map-border-color);
    }

    #map {
        width: 100%;
        height: 100%;
        border: solid 1px var(--edux-map-border-color);
    }

    :host .leaflet-mouse-position-container {
        color: var(--edux-input-color);
        padding: 5px;
        background-color: var(--edux-input-background-color);
    }

    :host .leaflet-mouse-position-text {
        margin: 0;
        font-weight: 700;
    }

    :host .form-control {
        display: block;
        width: 100%;
        height: 36px;
        padding: 6px 12px;
        background-image: none;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        -webkit-transition:
            border-color ease-in-out 0.15s,
            box-shadow ease-in-out 0.15s;
        transition:
            border-color ease-in-out 0.15s,
            box-shadow ease-in-out 0.15s;
    }

    :host .map__select {
        width: 100%;
        /* height: 1.7rem; */
        box-shadow: none;
        margin-bottom: 1rem;
    }
`
