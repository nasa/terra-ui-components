import { css } from 'lit'

export default css`
    :host {
        display: contents;

        /* For better DX, we'll reset the margin here so the base part can inherit it */
        margin: 0;
    }

    .banner {
        width: 100%;
        display: flex;
        align-items: center;
        padding: var(--terra-spacing-medium) var(--terra-spacing-large);
        border-radius: var(--terra-border-radius-medium);
        font-family: var(--terra-font-family--inter);
        font-size: var(--terra-font-size-medium);
        font-weight: var(--terra-font-weight-semibold);
        line-height: var(--terra-banner-line-height);
        margin: inherit;
        overflow: hidden;
        gap: var(--terra-spacing-medium);
    }

     .banner--open {
        display: flex;
    }
  
    .banner--sticky {
        position: sticky;
        top: 0;
        z-index: 1000; 
    }

   .banner__icon {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        font-size: var(--terra-font-size-large);
        padding-inline-start: var(--terra-spacing-2x-large);
        margin-right: var(--terra-spacing-medium);
    }

    .banner__message {
        flex: 1;
        align-items: center;
        margin: 0 auto; 
    }

    .banner__message ::slotted(a) {
        color: inherit !important;
        text-decoration-color: inherit !important;
    }

    .banner__message ::slotted(a):hover {
        text-decoration: none !important;
    }

   .banner--primary {
        background-color: var(--terra-color-nasa-blue-shade);
        color: white;
        padding-top: var(--terra-spacing-large);
        padding-bottom: var(--terra-spacing-large);
    }

    .banner--neutral {
        background-color: var(--terra-color-carbon-60);
        color: white;
    }
  
   .banner--danger {
        background-color: var(--terra-color-nasa-red);
        color: white;
    }

  .banner__close {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        font-size: var(--terra-font-size-large);
        margin-inline-end: var(--terra-spacing-2x-large);
        align-self: center;
        margin-left: auto;
    }

`