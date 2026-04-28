import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .tabs {
        display: flex;
        border-radius: 0;
    }

    .tabs__tabs {
        display: flex;
        position: relative;
    }

    .tabs__indicator {
        position: absolute;
        width: 0;
        height: 0;
        display: block;
        transition:
            var(--terra-transition-fast) translate ease,
            var(--terra-transition-fast) width ease,
            var(--terra-transition-fast) height ease;
    }

    .tabs--has-scroll-controls .tabs__nav-container {
        position: relative;
        padding: 0 var(--terra-tabs-scroll-button-width);
    }

    .tabs--has-scroll-controls .tabs__scroll-button--start--hidden,
    .tabs--has-scroll-controls .tabs__scroll-button--end--hidden {
        visibility: hidden;
    }

    .tabs__body {
        display: block;
        overflow: auto;
    }

    .tabs__scroll-button {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        bottom: 0;
        width: var(--terra-tabs-scroll-button-width);
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--terra-color-carbon-90);
        padding: 0;
        transition: var(--terra-transition-fast) color;
    }

    .tabs__scroll-button:hover {
        color: var(--terra-color-carbon-black);
    }

    .tabs__scroll-button:focus-visible {
        outline: var(--terra-focus-ring-style);
        outline-offset: 2px;
    }

    .tabs__scroll-button--start {
        left: 0;
    }

    .tabs__scroll-button--end {
        right: 0;
    }

    .tabs--rtl .tabs__scroll-button--start {
        left: auto;
        right: 0;
    }

    .tabs--rtl .tabs__scroll-button--end {
        left: 0;
        right: auto;
    }

    .tabs__resize-observer {
        display: contents;
    }

    /*
   * Top
   */

    .tabs--top {
        flex-direction: column;
    }

    .tabs--top .tabs__nav-container {
        order: 1;
    }

    .tabs--top .tabs__nav {
        display: flex;
        overflow-x: auto;

        /* Hide scrollbar in Firefox */
        scrollbar-width: none;
    }

    /* Hide scrollbar in Chrome/Safari */
    .tabs--top .tabs__nav::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    .tabs--top .tabs__tabs {
        flex: 1 1 auto;
        position: relative;
        flex-direction: row;
        border-bottom: solid var(--terra-tabs-track-width)
            var(--terra-tabs-track-color);
    }

    .tabs--top .tabs__indicator {
        bottom: 0;
        height: var(--terra-tabs-indicator-width);
        background-color: var(--terra-tabs-indicator-color);
    }

    .tabs--top .tabs__body {
        order: 2;
    }

    .tabs--top ::slotted(terra-tab-panel) {
        --padding: var(--terra-spacing-medium) 0;
    }

    /*
   * Bottom
   */

    .tabs--bottom {
        flex-direction: column;
    }

    .tabs--bottom .tabs__nav-container {
        order: 2;
    }

    .tabs--bottom .tabs__nav {
        display: flex;
        overflow-x: auto;

        /* Hide scrollbar in Firefox */
        scrollbar-width: none;
    }

    /* Hide scrollbar in Chrome/Safari */
    .tabs--bottom .tabs__nav::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    .tabs--bottom .tabs__tabs {
        flex: 1 1 auto;
        position: relative;
        flex-direction: row;
        border-top: solid var(--terra-tabs-track-width) var(--terra-tabs-track-color);
    }

    .tabs--bottom .tabs__indicator {
        top: 0;
        height: var(--terra-tabs-indicator-width);
        background-color: var(--terra-tabs-indicator-color);
    }

    .tabs--bottom .tabs__body {
        order: 1;
    }

    .tabs--bottom ::slotted(terra-tab-panel) {
        --padding: var(--terra-spacing-medium) 0;
    }

    /*
   * Start
   */

    .tabs--start {
        flex-direction: row;
    }

    .tabs--start .tabs__nav-container {
        order: 1;
    }

    .tabs--start .tabs__tabs {
        flex: 0 0 auto;
        flex-direction: column;
        border-inline-end: solid var(--terra-tabs-track-width)
            var(--terra-tabs-track-color);
    }

    .tabs--start .tabs__indicator {
        right: 0;
        width: var(--terra-tabs-indicator-width);
        background-color: var(--terra-tabs-indicator-color);
    }

    .tabs--start.tabs--rtl .tabs__indicator {
        right: auto;
        left: calc(-1 * var(--terra-tabs-track-width));
    }

    .tabs--start .tabs__body {
        flex: 1 1 auto;
        order: 2;
    }

    .tabs--start ::slotted(terra-tab-panel) {
        --padding: 0 var(--terra-spacing-medium);
    }

    /*
   * End
   */

    .tabs--end {
        flex-direction: row;
    }

    .tabs--end .tabs__nav-container {
        order: 2;
    }

    .tabs--end .tabs__tabs {
        flex: 0 0 auto;
        flex-direction: column;
        border-left: solid var(--terra-tabs-track-width) var(--terra-tabs-track-color);
    }

    .tabs--end .tabs__indicator {
        left: 0;
        width: var(--terra-tabs-indicator-width);
        background-color: var(--terra-tabs-indicator-color);
    }

    .tabs--end.tabs--rtl .tabs__indicator {
        right: calc(-1 * var(--terra-tabs-track-width));
        left: auto;
    }

    .tabs--end .tabs__body {
        flex: 1 1 auto;
        order: 1;
    }

    .tabs--end ::slotted(terra-tab-panel) {
        --padding: 0 var(--terra-spacing-medium);
    }
`
