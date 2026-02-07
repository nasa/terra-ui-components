import { css } from 'lit'

export default css`
    :host {
        display: block;
        background-color: var(--terra-color-carbon-black);
        color: var(--terra-color-spacesuit-white);

        /* Set CSS custom properties that cascade to navigation children */
        /* These will be available to buttons and menus inside site-navigation */
        --terra-button-text-text-color: var(--terra-color-nasa-blue);
        --terra-button-text-text-color-hover: var(--terra-color-nasa-blue-tint);
        --terra-panel-background-color: var(--terra-color-carbon-black);
        --terra-panel-border-color: var(--terra-color-carbon-20);
        --terra-menu-item-color: var(--terra-color-spacesuit-white);
        --terra-menu-item-color-hover: var(--terra-color-spacesuit-white);
        --terra-menu-item-background-color-hover: var(--terra-color-carbon-80);
        --terra-menu-item-background-color-focus: var(--terra-color-nasa-blue);
        --terra-menu-item-color-focus: var(--terra-color-spacesuit-white);
    }

    .site-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: var(--terra-spacing-small) var(--terra-spacing-medium);
        gap: var(--terra-spacing-medium);
    }

    .site-header__left {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-small);
        flex: 0 0 auto;
    }

    .site-header__logo {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }

    .site-header__title {
        display: flex;
        align-items: center;
        font-family: var(--terra-font-family--public-sans);
        font-size: var(--terra-font-size-x-large);
        font-weight: var(--terra-font-weight-bold);
        color: var(--terra-color-spacesuit-white);
        white-space: nowrap;
    }

    .site-header__center {
        display: flex;
        align-items: center;
        flex: 1 1 auto;
        justify-content: center;
        gap: var(--terra-spacing-small);
    }

    .site-header__right {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-small);
        flex: 0 0 auto;
    }

    .site-header__search {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: var(--terra-color-spacesuit-white);
        cursor: pointer;
        padding: var(--terra-spacing-2x-small);
        border-radius: var(--terra-border-radius-medium);
        transition: background-color var(--terra-transition-fast);
    }

    .site-header__search:hover {
        background-color: var(--terra-color-carbon-80);
    }

    .site-header__search:focus-visible {
        outline: var(--terra-focus-ring);
        outline-offset: var(--terra-focus-ring-offset);
    }

    .site-header__search terra-icon {
        font-size: var(--terra-icon-medium);
    }
`
