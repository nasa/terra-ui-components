import { css } from 'lit'

export default css`
    :host {
        display: block;
        padding: 16px;
        background: var(--terra-map-background-color);
        border: 1px solid var(--terra-map-border-color);
        border-radius: var(--terra-border-radius-medium);
    }

    :root,
    :host {
        --ol-background-color: red;
    }

`
