import { css } from 'lit'

export default css`
    :host {
        display: block;
        position: relative;
        max-width: 600px;
    }

    :host .spatial-picker__input_fields {
        position: relative;
    }

    :host input {
        box-shadow: none;
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
            background-color 0.2s ease,
            border-color 0.2s ease;
    }

    :host .spatial-picker__input_icon_button {
        position: absolute;
        top: 0;
        right: 0;
        height: 36px;
        padding: 0px;
        z-index: 2;
        margin-block: 0;
        margin-inline: 0;
    }

    :host .spatial-picker__input_icon_button svg {
        height: 1.4rem;
        width: 1.4rem;
    }

    terra-map:not(.inline) {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        z-index: 200;
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
