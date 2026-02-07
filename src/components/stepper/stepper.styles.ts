import { css } from 'lit'

export default css`
    :host {
        display: block;
        width: 100%;
    }

    .stepper {
        display: flex;
        width: 100%;
        flex-direction: row;
        gap: var(--terra-spacing-small);
    }
`
