import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .accordion {
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        background: #fff;
        margin-bottom: 1rem;
    }

    .accordion-summary {
        background: #f9fafb;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #e5e7eb;
        font-size: 0.95rem;
        font-weight: 500;
        color: #374151;
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .accordion-summary terra-icon {
        transition: transform 0.2s ease;
    }

    :host([open]) .accordion-summary terra-icon {
        transform: rotate(180deg);
    }

    .accordion-content {
        padding: 1rem;
    }

    .variable-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        cursor: pointer;
    }

    .variable-label:last-child {
        margin-bottom: 0;
    }

    .variable-checkbox {
        accent-color: #2563eb;
        border-radius: 0.25rem;
    }
`
