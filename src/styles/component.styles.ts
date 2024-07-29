import { css } from 'lit'

export default css`
    :host {
        box-sizing: border-box;
    }

    :host *,
    :host *::before,
    :host *::after {
        box-sizing: inherit;
    }

    [hidden] {
        display: none !important;
    }

    /* UTILITY CSS */
    .sr-only {
        block-size: 1px;
        border-width: 0;
        clip: rect(0, 0, 0, 0);
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        white-space: nowrap;
        width: 1px;
    }
`
