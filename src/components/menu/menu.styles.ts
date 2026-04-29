import { css } from 'lit'

export default css`
    :host {
        display: block;
        position: relative;
        background: var(--terra-container-menu-bg);
        border: solid var(--terra-container-menu-border-width)
            var(--terra-container-menu-border);
        border-radius: var(--terra-container-panel-border-radius);
        padding: var(--terra-spacing-x-small) 0;
        overflow: auto;
        overscroll-behavior: none;
    }

    ::slotted(terra-divider) {
        --spacing: var(--terra-spacing-x-small);
    }
`
