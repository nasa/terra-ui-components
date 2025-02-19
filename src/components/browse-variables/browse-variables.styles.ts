import { css } from 'lit'

export default css`
    :host {
        display: block;
        background-color: #1e3a5f;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
    }

    .initial-browse-container {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        position: relative;
        padding-bottom: 55%;
        margin: auto;
        overflow: hidden;
    }

    .scroll-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
    }

    .column {
        flex: 1;
        min-width: 200px;
        padding: 20px;
    }

    .column h2 {
        font-size: 1.5em;
        margin-bottom: 20px;
        color: white;
        font-weight: 500;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin: 8px 0;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    li:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    input[type='radio'] {
        margin-right: 10px;
        accent-color: white;
    }

    .radio-group {
        display: flex;
        gap: 8px;
    }

    .radio-group label {
        display: flex;
        align-items: center;
        padding: 8px;
        cursor: pointer;
        border-radius: 4px;
    }

    .radio-group label:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .view-all {
        background: none;
        border: 2px solid white;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 20px;
        transition: all 0.2s;
    }

    .view-all:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
        .initial-browse-container {
            flex-direction: column;
        }
        .column {
            min-width: 100%;
        }
    }

    .variables-container {
        display: flex;
        width: 100%;
        position: relative;
        padding-bottom: 55%;
        margin: auto;
        background-color: #1e3a5f;
        overflow: hidden;
    }

    .variables-container > * {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .sidebar {
        width: 250px;
        flex-shrink: 0;
        padding: 20px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        overflow-y: auto;
        height: 100%;
    }

    .sidebar h2 {
        color: white;
        font-size: 1.2em;
        margin-bottom: 20px;
    }

    details {
        margin-bottom: 15px;
    }

    summary {
        cursor: pointer;
        padding: 8px 0;
        color: white;
        font-weight: 500;
    }

    details div {
        margin-left: 15px;
        padding: 5px 0;
    }

    .content {
        flex-grow: 1;
        padding: 20px;
        overflow-y: auto;
    }

    input[type='checkbox'] {
        accent-color: white;
        margin-right: 8px;
    }

    .variable-list li {
        background-color: rgba(255, 255, 255, 0.05);
        margin-bottom: 8px;
        padding: 12px;
        border-radius: 4px;
    }

    .variable-list li:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .meta {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9em;
        margin-top: 4px;
    }

    .details-panel {
        background-color: #234270;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`
