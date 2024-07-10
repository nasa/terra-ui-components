import { css } from 'lit'

export default css`
    .chip {
        display: inline-flex;
        flex-direction: row;
        background-color: #ffffff;
        border: blue;
        cursor: default;
        outline: #0090f0;
        outline-style: solid;
        outline-width: 2px;
        border-radius: 2px;
        padding: 0;
        margin: 5px;
        font-weight: bold;
        color: #909090;
        font-family: 'Open Sans', sans-serif;
        white-space: nowrap;
        align-items: center;
        vertical-align: middle;
        text-decoration: none;
        justify-content: center;
    }
    .chip--small {
        height: 22px;
        font-size: 11px;
    }
    .chip--medium {
        height: 30px;
        font-size: 15px;
    }

    .chip--large {
        height: 38px;
        font-size: 20px;
    }
    .chip-content {
        cursor: inherit;
        display: flex;
        align-items: center;
        user-select: none;
        white-space: nowrap;
    }
    .chip-content--small {
        padding-left: 8px;
        padding-right: 8px;
    }
    .chip-content--medium {
        padding-left: 12px;
        padding-right: 12px;
    }
    .chip-content--large {
        padding-left: 15px;
        padding-right: 15px;
    }
    .chip-svg {
        color: #888888;
        cursor: pointer;
        height: auto;
        fill: currentColor;
        display: inline-block;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        user-select: none;
        flex-shrink: 0;
    }
    .chip-svg--small {
        margin: 3px 3px 0px -6px;
        width: 0.75em;
        height: 0.75em;
        font-size: 20px;
    }
    .chip-svg--medium {
        margin: 4px 4px 0px -8px;
        width: 1em;
        height: 1em;
        font-size: 24px;
    }

    .chip-svg--large {
        margin: 6px 6px 0px -12px;
        width: 1.4em;
        height: 1.4em;
        font-size: 24px;
    }
    .chip-svg:hover {
        visibility: 'visible';
        filter: invert(100%);
    }
    .chip-close {
        padding: 0;
        border: 0;
        background: none;
        box-shadow: none;
        text-align: center;
        vertical-align: middle;
    }
`
