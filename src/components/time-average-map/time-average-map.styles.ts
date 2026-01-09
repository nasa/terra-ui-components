import { css } from 'lit'

export default css`
    :host {
        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: 1fr;
        position: relative;
    }

    .toolbar-container {
        grid-row: 1;
    }

    .map-container {
        grid-row: 2;
        position: relative;
        width: 100%;
        height: 100%;
        aspect-ratio: 100 / 52;
    }

    #map {
        position: relative;
        width: 100%;
        height: 100%;
    }

    #settings {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: rgba(255, 255, 255, 0.9);
        padding: 8px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-family: monospace;
        z-index: 10;
    }

    label {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    dialog {
        position: absolute;
        top: calc(50% - 100px);
    }
`
