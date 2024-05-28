import { css } from 'lit';

export default css`
    .chip{
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
        font-family:"Open Sans", sans-serif;
        white-space: nowrap;
        align-items: center;
        vertical-align: middle;
        text-decoration: none;
        justify-content: center;
    }

    .chip-content{
        cursor: inherit;
        display: flex;
        align-items: center;
        user-select: none;
        white-space: nowrap;
        padding-left: 12px;
        padding-right: 12px;
    }
    .chip-svg{
        color: #888888;
        cursor: pointer;
        height: auto;
        margin: 4px 4px 0 -8px;
        fill: currentColor;
        width: 1em;
        height: 1em;
        display: inline-block;
        font-size: 24px;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        user-select: none;
        flex-shrink: 0;
    }

    .chip-svg:hover {
        visibility: "visible";
        filter: invert(100%);
    }

`;
