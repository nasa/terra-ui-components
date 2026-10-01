import { css } from 'lit'

export default css`
    :host {
        display: flex;
        align-items: center;
        height: 80px;
        background: var(--terra-color-neutral-0, #ffffff);
        border-top: 1px solid var(--terra-color-neutral-200, #e2e8f0);
        gap: 4px;
        padding: 0 4px;
    }

    .nav-button {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--terra-color-neutral-600, #4a5568);
        border-radius: var(--terra-border-radius-medium, 4px);
        transition:
            background-color 0.2s,
            color 0.2s;
        padding: 0;
    }

    .nav-button:hover:not(:disabled) {
        background-color: var(--terra-color-neutral-100, #f7fafc);
        color: var(--terra-color-neutral-900, #1a202c);
    }

    .nav-button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .viewport {
        flex: 1;
        overflow: hidden;
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .track {
        display: flex;
        gap: 12px;
        align-items: center;
        transition: transform 0.3s ease-in-out;
    }

    .thumbnail {
        flex-shrink: 0;
        width: 96px;
        height: 64px;
        position: relative;
        cursor: pointer;
        border-radius: var(--terra-border-radius-medium, 6px);
        transition: transform 0.2s ease-in-out;
    }

    .thumbnail:hover {
        transform: translateY(-2px);
    }

    .thumbnail:hover .delete-button {
        opacity: 1;
    }

    .thumbnail-inner {
        width: 100%;
        height: 100%;
        background: var(--terra-color-primary-50, #ebf5ff);
        border: 1px solid var(--terra-color-neutral-200, #e2e8f0);
        border-radius: var(--terra-border-radius-medium, 6px);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        transition:
            border-color 0.2s,
            box-shadow 0.2s;
        color: var(--terra-color-primary-500, #4a90e2);
    }

    .thumbnail-img {
        width: 100%;
        height: 100%;
        object-fit: fit;
        display: block;
    }

    .thumbnail:hover .thumbnail-inner {
        border-color: var(--terra-color-primary-300, #63b3ed);
        box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15);
    }

    .loading-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.7);
        border-radius: inherit;
        z-index: 1;
    }

    .delete-button {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--terra-color-danger-500, #e53e3e);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        line-height: 1;
        padding: 0;
        opacity: 0;
        transition:
            opacity 0.15s,
            background-color 0.15s;
        z-index: 2;
    }

    .delete-button:hover {
        background: var(--terra-color-danger-600, #c53030);
    }

    .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
    }

    .font-weight-semibold {
        font-weight: 600;
    }

    .text-gray-300 {
        color: var(--terra-color-neutral-400, #d1d5dc);
    }

    .mb-1 {
        margin-bottom: 4px;
    }

    .tooltip-row {
        display: flex;
        align-items: center;
    }

    .tooltip-row terra-icon {
        margin-right: 4px;
    }
`
