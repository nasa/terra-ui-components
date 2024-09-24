import { css } from 'lit'

export default css`
    :host {
        display: block;
        padding: 16px;
        background: var(--terra-map-background-color);
        border: 1px solid var(--terra-map-border-color);
    }

    .map {
        aspect-ratio: 4 / 3;
        border: solid 1px var(--terra-map-border-color);
    }

    .leaflet-mouse-position-container {
        color: var(--terra-input-color);
        padding: 5px;
        background-color: var(--terra-input-background-color);
    }

    .leaflet-mouse-position-text {
        margin: 0;
        font-weight: 700;
    }

    .form-control {
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

    .map__select {
        width: 100%;
        box-shadow: none;
        margin-bottom: 1rem;
    }
`
