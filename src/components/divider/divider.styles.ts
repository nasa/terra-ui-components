import { css } from 'lit'

export default css`
    :host {
        --color: var(--terra-divider-color, var(--terra-panel-border-color));
        --width: var(--terra-divider-width, var(--terra-panel-border-width));
        --spacing: var(--terra-divider-spacing, var(--terra-spacing-medium));
    }

    :host(:not([vertical])) {
        display: block;
        border-top: solid var(--width) var(--color);
        margin: var(--spacing) 0;
    }

    :host([vertical]) {
        display: inline-block;
        height: 100%;
        border-left: solid var(--width) var(--color);
        margin: 0 var(--spacing);
    }
`
