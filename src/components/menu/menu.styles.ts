import { css } from 'lit'

export default css`
    :host {
        display: block;
        position: relative;
        background: var(--terra-menu-background-color);
        border: solid var(--terra-menu-border-width) var(--terra-menu-border-color);
        border-radius: var(--terra-panel-border-radius);
        padding: var(--terra-spacing-x-small) 0;
        overflow: auto;
        overscroll-behavior: none;
    }

    ::slotted(terra-divider) {
        --spacing: var(--terra-spacing-x-small);
    }
`
