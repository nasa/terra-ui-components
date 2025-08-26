import { css } from 'lit'

export default css`
    :host {
        display: block;
        height: 800px;
    }

    #map {
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
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        z-index: 10;
        pointer-events: auto;
    }

    label {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    input[type='range'] {
        vertical-align: middle;
    }
`
