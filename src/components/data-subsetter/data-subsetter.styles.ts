import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background: white;
        min-height: 100vh;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e9ecef;
    }

    .header h1 {
        font-size: 16px;
        font-weight: 600;
        color: #0066cc;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 20px;
        color: #6c757d;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .close-btn:hover {
        background-color: #f8f9fa;
    }

    .size-info {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 25px;
    }

    .size-info h2 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #333;
    }

    .size-stats {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
    }

    .size-warning {
        font-size: 14px;
        color: #856404;
    }

    .section {
        margin-bottom: 25px;
    }

    .section-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 15px;
        color: #333;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .help-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #6c757d;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        cursor: help;
    }

    .accordion {
        border: 1px solid #dee2e6;
        border-radius: 6px;
        background: white;
        overflow: hidden;
    }

    .accordion-header {
        background: #f8f9fa;
        padding: 12px 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #dee2e6;
        transition: background-color 0.2s;
        user-select: none;
    }

    .accordion-header:hover {
        background: #e9ecef;
    }

    .accordion-header.active {
        background: #e7f3ff;
    }

    .accordion-title {
        font-weight: 500;
        color: #333;
    }

    .accordion-content {
        padding: 15px;
        border-top: 1px solid #dee2e6;
        background: white;
    }

    .accordion-value {
        color: #28a745;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .accordion-value.error {
        color: #dc3545;
    }

    .accordion-value::before {
        content: '✓';
        font-weight: bold;
    }

    .accordion-value.error::before {
        content: '✗';
    }

    .chevron {
        transition: transform 0.2s;
        font-size: 12px;
        color: #666;
    }

    .chevron.open {
        transform: rotate(180deg);
    }

    .option-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
    }

    .checkbox-option {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
    }

    .checkbox-option input[type='checkbox'] {
        width: 16px;
        height: 16px;
        accent-color: #0066cc;
    }

    .reset-btn {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 13px;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
    }

    .reset-btn:hover {
        background: #e9ecef;
        border-color: #adb5bd;
    }

    .footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #dee2e6;
    }

    .btn {
        padding: 10px 20px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
    }

    .btn-secondary {
        background: #f8f9fa;
        color: #666;
        border-color: #dee2e6;
    }

    .btn-secondary:hover {
        background: #e9ecef;
    }

    .btn-primary {
        background: #0066cc;
        color: white;
    }

    .btn-primary:hover {
        background: #0056b3;
    }

    .hidden {
        display: none;
    }

    .download-icon {
        width: 16px;
        height: 16px;
        margin-right: 5px;
    }

    .icon-scissors {
        width: 16px;
        height: 16px;
        color: #28a745;
    }
`
