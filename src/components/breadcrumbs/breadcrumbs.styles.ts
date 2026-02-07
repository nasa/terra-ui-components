import { css } from 'lit'

export default css`
    :host {
        display: block;
        --terra-breadcrumbs-gap: 0.25rem;
    }

    :host([theme='dark']) {
        color: var(--terra-color-carbon-10);
    }

    :host([theme='light']) {
        color: var(--terra-color-carbon-60);
    }

    .breadcrumbs {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--terra-breadcrumbs-gap);
        font-family: var(--terra-font-family--inter);
        font-size: 0.875rem;
        line-height: 1.5;
    }

    ::slotted(terra-breadcrumb:not(:first-child))::before {
        content: var(--terra-breadcrumbs-separator, '/');
        margin: 0 0.25rem;
        color: inherit;
        font-weight: var(--terra-font-weight-regular);
    }
`
