import { css } from 'lit'

export default css`
    :host {
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        max-width: 600px;
    }

    :host input {
        box-shadow: none;
    }

    :host .form-control {
        box-sizing: border-box;
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

    :host .date-picker__input_fields {
        position: relative;
    }

    :host lit-flatpickr {
        width: 100%;
        display: block;
        width: 100%;
        height: 36px;
        padding: 6px 40px 6px 12px;
        background-image: none;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        border: 1px solid #ccc;
        -webkit-transition:
            border-color ease-in-out 0.15s,
            box-shadow ease-in-out 0.15s;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
    }

    :host .date-picker__input_icon_button {
        position: absolute;
        top: 0;
        right: 0;
        height: 36px;
        width: 36px;
        padding: 0;
        margin: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        box-shadow: none;
    }

    :host .date-picker__input_icon_button svg {
        height: 1.4rem;
        width: 1.4rem;
        color: currentColor;
    }

    :host .date-picker__input_icon_button:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    :host .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`
