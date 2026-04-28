import { css } from 'lit'

export default css`
    :host {
        display: block;
        position: relative;
    }

    @media (max-width: 768px) {
        :host {
            max-width: 100%;
        }
    }

    terra-dropdown {
        width: 100%;
    }

    :host terra-input {
        width: 100%;
    }

    .spatial-picker {
        position: relative;
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
        width: 100%;
        max-width: min(600px, calc(100vw - 2rem));
        min-width: min(600px, 100vw);
        max-height: var(--auto-size-available-height, min(450px, calc(100vh - 2rem)));
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .spatial-picker__map-container--inline {
        position: static;
        max-height: none;
        margin-top: 1rem;
    }

    @media (max-width: 768px) {
        .spatial-picker__map-container {
            width: calc(100vw - 2rem);
            max-width: calc(100vw - 2rem);
        }
    }

    @media (max-width: 480px) {
        .spatial-picker__map-container {
            width: calc(100vw - 1rem);
            max-width: calc(100vw - 1rem);
        }
    }

    terra-map:not(.inline) {
        width: 100%;
        height: 100%;
        min-height: 0;
        flex: 1;
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
