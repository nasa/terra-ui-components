import { css } from 'lit'

export default css`
    :host {
        display: block;
        position: relative;
        background: var(--terra-panel-background-color);
        border: solid var(--terra-panel-border-width) var(--terra-panel-border-color);
        border-radius: var(--terra-border-radius-medium);
        padding: var(--terra-spacing-x-small) 0;
        overflow: auto;
        overscroll-behavior: none;
    }

    ::slotted(terra-divider) {
        --spacing: var(--terra-spacing-x-small);
    }
`
