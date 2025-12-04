import { css } from 'lit'

export default css`
    :host {
        display: inline-block;
        color: var(--terra-breadcrumb-color, var(--terra-color-carbon-60));
        font-family: var(--terra-font-family--inter);
        font-size: 0.875rem;
        line-height: 1.5;
    }

    .breadcrumb {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
    }

    .breadcrumb__link {
        color: inherit;
        text-decoration: none;
    }

    .breadcrumb__link:visited {
        color: var(--terra-breadcrumb-color-visited, var(--terra-color-carbon-70));
    }

    .breadcrumb__link:hover,
    .breadcrumb__link:focus-visible {
        text-decoration: underline;
    }

    .breadcrumb--current .breadcrumb__link,
    .breadcrumb--current .breadcrumb__label {
        font-weight: var(--terra-font-weight-bold);
    }
`
