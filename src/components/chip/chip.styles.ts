import { css } from 'lit'

export default css`
    .chip--small {
        display: inline-flex;
        flex-direction: row;
        background-color: #ffffff;
        border: blue;
        cursor: default;
        height: 22px;
        outline: #0090f0;
        outline-style: solid;
        outline-width: 2px;
        border-radius: 2px;
        padding: 0;
        margin: 5px;
        font-size: 11px;
        font-weight: bold;
        color: #909090;
        font-family: 'Open Sans', sans-serif;
        white-space: nowrap;
        align-items: center;
        vertical-align: middle;
        text-decoration: none;
        justify-content: center;
    }
    .chip--medium {
        display: inline-flex;
        flex-direction: row;
        background-color: #ffffff;
        border: blue;
        cursor: default;
        height: 30px;
        outline: #0090f0;
        outline-style: solid;
        outline-width: 2px;
        border-radius: 2px;
        padding: 0;
        margin: 5px;
        font-size: 15px;
        font-weight: bold;
        color: #909090;
        font-family: 'Open Sans', sans-serif;
        white-space: nowrap;
        align-items: center;
        vertical-align: middle;
        text-decoration: none;
        justify-content: center;
    }

    .chip--large {
        display: inline-flex;
        flex-direction: row;
        background-color: #ffffff;
        border: blue;
        cursor: default;
        height: 38px;
        outline: #0090f0;
        outline-style: solid;
        outline-width: 2px;
        border-radius: 2px;
        padding: 0;
        margin: 5px;
        font-size: 20px;
        font-weight: bold;
        color: #909090;
        font-family: 'Open Sans', sans-serif;
        white-space: nowrap;
        align-items: center;
        vertical-align: middle;
        text-decoration: none;
        justify-content: center;
    }

    .chip-content--small {
        cursor: inherit;
        display: flex;
        align-items: center;
        user-select: none;
        white-space: nowrap;
        padding-left: 8px;
        padding-right: 8px;
    }
    .chip-content--medium {
        cursor: inherit;
        display: flex;
        align-items: center;
        user-select: none;
        white-space: nowrap;
        padding-left: 12px;
        padding-right: 12px;
    }
    .chip-content--large {
        cursor: inherit;
        display: flex;
        align-items: center;
        user-select: none;
        white-space: nowrap;
        padding-left: 15px;
        padding-right: 15px;
    }
    .chip-svg--small {
        color: #888888;
        cursor: pointer;
        height: auto;
        margin: 3px 3px -3px -6px;
        fill: currentColor;
        width: 0.75em;
        height: 0.75em;
        display: inline-block;
        font-size: 20px;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        user-select: none;
        flex-shrink: 0;
    }
    .chip-svg--medium {
        color: #888888;
        cursor: pointer;
        height: auto;
        margin: 4px 4px -4px -8px;
        fill: currentColor;
        width: 1em;
        height: 1em;
        display: inline-block;
        font-size: 24px;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        user-select: none;
        flex-shrink: 0;
    }

    .chip-svg--large {
        color: #888888;
        cursor: pointer;
        height: auto;
        margin: 6px 6px -6px -12px;
        fill: currentColor;
        width: 1.4em;
        height: 1.4em;
        display: inline-block;
        font-size: 24px;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        user-select: none;
        flex-shrink: 0;
    }
    .chip-svg--small:hover {
        visibility: 'visible';
        filter: invert(100%);
    }
    .chip-svg--medium:hover {
        visibility: 'visible';
        filter: invert(100%);
    }
    .chip-svg--large:hover {
        visibility: 'visible';
        filter: invert(100%);
    }
`
