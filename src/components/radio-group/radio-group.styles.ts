import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .form-control {
        position: relative;
        border: none;
        padding: 0;
        margin: 0;
    }

    .form-control__label {
        padding: 0;
    }

    .form-control--required .form-control__label::after {
        content: var(--terra-input-required-content);
        color: var(--terra-input-required-content-color);
        margin-inline-start: var(--terra-input-required-content-offset);
    }

    .visually-hidden {
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
