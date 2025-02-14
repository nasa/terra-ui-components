import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .initial-browse-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        max-width: 1200px;
        margin: auto;
    }

    .column {
        flex: 1;
        min-width: 200px;
        padding: 20px;
    }

    .column h2 {
        font-size: 1.2em;
        margin-bottom: 10px;
        text-transform: uppercase;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin: 5px 0;
        cursor: pointer;
    }

    .radio-group {
        display: flex;
        flex-direction: column;
    }

    .radio-group label {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 5px 0;
    }

    .radio-group input[type='radio'] {
        margin-right: 10px;
    }

    @media (max-width: 768px) {
        .container {
            flex-direction: column;
        }
        .column {
            text-align: center;
        }
    }

    .variables-container {
        display: flex;
        max-width: 1200px;
        width: 100%;
    }

    /* Sidebar */
    .sidebar {
        width: 250px;
        flex-shrink: 0;
        padding: 20px;
    }

    /* Main Content */
    .content {
        flex-grow: 1;
        padding: 20px;
    }

    .group h3 {
        margin-bottom: 5px;
    }

    /* Variable List */
    .variable-list {
        list-style: none;
        padding: 0;
    }

    .variable-list li {
        padding: 10px;
        border: 1px solid white;
        margin-bottom: 5px;
        cursor: pointer;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    /* Show Details on Hover or Focus */
    .variable-list li:hover .details-panel,
    .variable-list li:focus-within .details-panel {
        display: block;
    }

    /* Details Panel */
    .details-panel {
        display: none;
        position: absolute;
        left: 100%;
        top: 0;
        width: 250px;
        background: #fff;
        padding: 10px;
        border-radius: 5px;
        z-index: 200;
    }

    .details-panel h4 {
        margin: 0;
    }

    /* Keyboard Accessibility */
    .variable-list li:focus {
        outline: 2px solid white;
    }

    /* Responsive Layout */
    @media (max-width: 768px) {
        .container {
            flex-direction: column;
        }

        .sidebar {
            width: 100%;
        }

        .details-panel {
            position: static;
            width: 100%;
            display: block;
            border-top: 1px solid white;
            margin-top: 5px;
        }

        .variable-list li:hover .details-panel {
            display: none; /* Disable hover effect for mobile */
        }
    }
`
