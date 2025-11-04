import { css } from 'lit'

export default css`
    :host {
        display: block;
        position: relative;
        max-width: 600px;
    }

    :host terra-input {
        width: 100%;
    }

    :host .spatial-picker__input_icon {
        height: 1.4rem;
        width: 1.4rem;
        cursor: pointer;
        color: var(--terra-color-neutral-500, #6b7280);
        flex-shrink: 0;
    }

    :host .spatial-picker__input_icon:hover {
        color: var(--terra-color-neutral-700, #374151);
    }

    .spatial-picker__map-container {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        z-index: 200;
        margin-top: 8px;
    }

    .spatial-picker__map-container.flipped {
        top: auto;
        bottom: 100%;
        margin-bottom: 8px;
    }

    terra-map:not(.inline) {
        width: 100%;
    }

    .button-icon {
        height: 1rem;
        width: 1rem;
    }

    .spatial-picker__error {
        color: #a94442;
        font-size: 0.8rem;
        padding: 10px;
    }
`
