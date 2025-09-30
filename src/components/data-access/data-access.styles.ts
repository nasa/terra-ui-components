import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .info-bar {
        margin-bottom: 20px;
        color: #333;
    }

    .grid-container {
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
    }

    .grid-header {
        display: grid;
        grid-template-columns: 3fr 1fr 1.5fr 1.5fr;
        gap: 1px;
        background: #1e3a5f;
        color: white;
        font-weight: 600;
    }

    .grid-header > div {
        padding: 12px 16px;
        background: #1e3a5f;
    }

    .grid-body {
        display: grid;
        grid-template-columns: 1fr;
    }

    .grid-row {
        display: grid;
        grid-template-columns: 3fr 1fr 1.5fr 1.5fr;
        gap: 1px;
        background: #e0e0e0;
    }

    .grid-row > div {
        min-height: 45px;
        padding: 12px 16px;
        background: white;
        display: flex;
        align-items: center;
        word-break: break-word;
        border-bottom: 1px solid #e0e0e0;
    }

    .grid-row:hover > div {
        background: #f8f9fa;
    }

    .file-name {
        color: #333;
    }

    .size {
        text-align: right;
    }

    .time {
        color: #555;
    }
`
