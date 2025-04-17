import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    dialog[open] {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        inset: 0px;
        z-index: 999;
    }
`
