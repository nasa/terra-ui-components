import { css } from 'lit'

export default css`
    :host {
        display: block;
        position: fixed;
        right: 32px;
        bottom: 0;
        z-index: 1000;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
        border-radius: 12px 12px 0 0;
        background: #fff;
        min-width: 340px;
        max-width: 400px;
        font-family: var(
            --terra-font-family--public-sans,
            'Public Sans',
            Arial,
            sans-serif
        );
        color: #222;
        transition:
            box-shadow 0.2s,
            transform 0.2s;
    }

    .history-header {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        background: #183153;
        color: #fff;
        border-radius: 12px 12px 0 0;
        padding: 12px 20px;
        cursor: pointer;
        user-select: none;
    }

    .history-header .count {
        background: #fff;
        color: #183153;
        font-weight: 700;
        border-radius: 16px;
        padding: 2px 10px;
        font-size: 0.95em;
        margin-right: 8px;
    }

    .history-panel {
        padding: 0 0 16px 0;
        background: #fff;
        border-radius: 0 0 12px 12px;
        box-shadow: none;
        border-top: 1px solid #e9ecef;
        transition: max-height 0.2s;
    }

    .tabs {
        display: flex;
        gap: 8px;
        margin: 16px 0 0 20px;
    }
    .tab {
        background: #f8f9fa;
        border: none;
        border-radius: 16px;
        padding: 4px 16px;
        font-size: 0.95em;
        color: #222;
        cursor: pointer;
        font-weight: 500;
        transition:
            background 0.2s,
            color 0.2s;
    }
    .tab.active {
        background: #183153;
        color: #fff;
    }

    .history-list {
        margin: 0;
        padding: 0 20px;
        max-height: calc(3 * 102px);
        overflow-y: auto;
    }
    .history-item {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 16px 16px 12px 16px;
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 1px 2px rgba(24, 49, 83, 0.04);
    }
    .history-item .item-header {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1em;
        font-weight: 600;
        color: #222;
    }
    .history-item .item-header .icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .history-item .item-title {
        font-size: 1em;
        font-weight: 500;
        color: #222;
        margin-bottom: 4px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
    }
    .history-item .progress-bar {
        background: #e9ecef;
        border-radius: 6px;
        height: 24px;
        width: 100%;
        overflow: hidden;
        margin-top: 8px;
        display: flex;
        align-items: center;
    }
    .history-item .progress-fill {
        background: #4caf50;
        height: 100%;
        border-radius: 6px 0 0 6px;
        transition: width 0.3s;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #fff;
        font-weight: 600;
        font-size: 0.95em;
        padding-left: 10px;
    }

    .collapsed .history-panel {
        display: none;
    }
    .collapsed {
        min-width: 0;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 600px) {
        :host {
            right: 0;
            bottom: 0;
            left: 0;
            min-width: 0;
            max-width: 100vw;
            border-radius: 0;
        }
        .history-header {
            border-radius: 0;
        }
        .history-panel {
            border-radius: 0;
        }
    }

    .history-link-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 20px;
    }

    .history-link {
        font-size: 0.98em;
        color: #0066cc;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .history-link:hover {
        text-decoration: underline;
    }

    .history-alert {
        padding: 32px 0;
        text-align: center;
        color: #666;
        font-size: 1.05em;
    }

    .history-alert-link {
        color: #0066cc;
        text-decoration: underline;
        cursor: pointer;
    }

    .history-alert-link:hover {
        text-decoration: underline;
        color: #004999;
    }
`
