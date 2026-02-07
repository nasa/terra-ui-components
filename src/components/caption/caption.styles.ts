import { css } from 'lit'

export default css`
    :host {
        display: block;
        font-family: var(--terra-caption-font-family);
        font-size: var(--terra-caption-font-size);
        font-weight: var(--terra-caption-font-weight);
        line-height: var(--terra-caption-line-height);
        color: var(--terra-caption-color);
        margin: 0;
    }

    /* Credit text within captions has higher contrast */
    ::slotted(.credit),
    ::slotted([class*='credit']) {
        color: var(--terra-caption-credit-color);
    }
`
