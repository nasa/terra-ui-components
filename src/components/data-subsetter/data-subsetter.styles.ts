import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    :host * {
        box-sizing: border-box;
    }

    :host .container {
        font-size: 16px;
        text-align: left;
        margin: 0 auto;
        padding: 20px;
        background: white;
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

    .minimize-btn {
        background: none;
        border: none;
        font-size: 20px;
        color: #6c757d;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .minimize-btn:hover {
        background-color: #f8f9fa;
    }

    .size-info {
        border: 1px solid transparent;
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 25px;
    }

    .size-info.warning {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
    }

    .size-info.neutral {
        background: #f8f9fa;
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

    .section,
    .results-section {
        margin-bottom: 25px;
    }

    .section-title,
    .results-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 15px;
        color: #333;
    }

    .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .help-icon,
    .info-icon {
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
        justify-content: space-between;
        align-items: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #dee2e6;
        position: relative;
        overflow: visible;
    }

    .btn {
        padding: 10px 20px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
        text-decoration: none;
        display: inline-block;
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

    .btn-success {
        background: #28a745;
        color: white;
        border-color: #28a745;
    }

    .btn-success:hover {
        background: #218838;
        border-color: #1e7e34;
    }

    .hidden {
        display: none;
    }

    .download-icon,
    .icon-scissors {
        width: 16px;
        height: 16px;
    }

    .icon-scissors {
        color: #28a745;
    }

    .progress-container {
        margin-bottom: 20px;
    }

    .progress-text,
    .search-status,
    .job-info {
        font-size: 14px;
        color: #666;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .progress-text {
        margin-bottom: 8px;
    }

    .search-status {
        margin-bottom: 20px;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid #e9ecef;
        border-top: 2px solid #0066cc;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background-color: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 10px;
    }

    .progress-fill {
        height: 100%;
        background-color: #0066cc;
        border-radius: 4px;
        transition: width 0.3s ease;
        width: 28%;
    }

    .tabs {
        display: flex;
        border-bottom: 1px solid #dee2e6;
        margin-bottom: 20px;
    }

    .tab {
        padding: 12px 20px;
        background: none;
        border: none;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
    }

    .tab.active {
        color: #0066cc;
        border-bottom-color: #0066cc;
        background: #f8f9fa;
    }

    .tab:hover:not(.active) {
        color: #495057;
        background: #f8f9fa;
    }

    .tab-content {
        display: none;
    }

    .tab-content.active {
        display: block;
    }

    .file-list {
        list-style: none;
        padding: 0;
        max-height: 250px;
        overflow-y: auto;
        overflow-x: auto;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 10px;
        white-space: nowrap;
    }

    .file-item {
        margin-bottom: 8px;
        white-space: nowrap;
    }

    .file-link,
    .doc-link {
        color: #0066cc;
        text-decoration: none;
        font-size: 14px;
        display: block;
        transition: all 0.2s;
        white-space: nowrap;
    }

    .file-link {
        padding: 8px 0;
        border-radius: 4px;
    }

    .file-link:hover {
        text-decoration: underline;
        background: #f8f9fa;
        padding-left: 8px;
    }

    .doc-link {
        margin-bottom: 8px;
    }

    .doc-link:hover {
        text-decoration: underline;
    }

    .documentation-links {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 20px;
    }

    .job-id {
        font-family: 'Courier New', monospace;
        background: #f8f9fa;
        padding: 2px 6px;
        border-radius: 3px;
        border: 1px solid #dee2e6;
    }

    .status-complete {
        color: #28a745;
        font-weight: 500;
    }

    .status-running {
        color: #ffc107;
        font-weight: 500;
    }

    .file-count {
        font-weight: 500;
        color: #333;
    }

    .estimated-total {
        color: #666;
        font-size: 13px;
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

    .minimize-btn {
        background: none;
        border: none;
        font-size: 20px;
        color: #6c757d;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .minimize-btn:hover {
        background-color: #f8f9fa;
    }

    .size-info {
        border: 1px solid transparent;
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
        justify-content: space-between;
        align-items: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #dee2e6;
        position: relative;
        overflow: visible;
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

    /* Collection Search Styles */
    .search-tabs-mini {
        display: flex;
        border-bottom: 1px solid #dee2e6;
        margin-bottom: 15px;
    }

    .search-tab-mini {
        background: none;
        border: none;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 500;
        color: #666;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
    }

    .search-tab-mini.active {
        color: #0066cc;
        border-bottom-color: #0066cc;
        background: #f8f9fa;
    }

    .search-tab-mini:hover:not(.active) {
        color: #495057;
        background: #f8f9fa;
    }

    .search-container-mini {
        display: flex;
        gap: 0;
        margin-bottom: 15px;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #dee2e6;
    }

    .search-input-mini {
        flex: 1;
        padding: 10px 12px;
        border: none;
        font-size: 14px;
        outline: none;
        background: white;
    }

    .search-input-mini::placeholder {
        color: #999;
    }

    .search-button-mini {
        background: #0066cc;
        color: white;
        border: none;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .search-button-mini:hover {
        background: #0056b3;
    }

    .search-icon-mini {
        width: 14px;
        height: 14px;
    }

    .quick-links-mini {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .quick-link-mini {
        color: #0066cc;
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s;
    }

    .quick-link-mini:hover {
        text-decoration: underline;
    }

    .search-results-section {
        border-top: 1px solid #dee2e6;
        padding-top: 15px;
        margin-top: 15px;
    }

    .results-header-mini {
        margin-bottom: 15px;
    }

    .results-count-mini {
        font-size: 14px;
        color: #666;
        font-weight: 500;
    }

    .results-container-mini {
        max-height: 320px;
        overflow-y: auto;
    }

    .result-item-mini {
        padding: 12px;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        margin-bottom: 8px;
        background: white;
        transition: all 0.2s;
        cursor: pointer;
    }

    .result-item-mini:hover {
        border-color: #0066cc;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }

    .result-item-mini.selected {
        border-color: #0066cc;
        background: #f0f8ff;
    }

    .result-title-mini {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
    }

    .result-id-mini {
        font-size: 12px;
        color: #666;
        font-family: 'Courier New', monospace;
        background: #f8f9fa;
        padding: 1px 4px;
        border-radius: 2px;
        display: inline-block;
        margin-bottom: 6px;
    }

    .result-description-mini {
        font-size: 13px;
        color: #666;
        line-height: 1.4;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .result-meta-mini {
        display: flex;
        gap: 12px;
        font-size: 11px;
        color: #999;
        flex-wrap: wrap;
    }

    .tag-mini {
        background: #e3f2fd;
        color: #1976d2;
        padding: 1px 6px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 500;
    }

    .loading-mini {
        text-align: center;
        padding: 20px;
        color: #666;
        font-size: 14px;
    }

    .spinner-mini {
        width: 20px;
        height: 20px;
        border: 2px solid #e9ecef;
        border-top: 2px solid #0066cc;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 10px;
    }

    .no-results-mini {
        text-align: center;
        padding: 20px;
        color: #666;
        font-size: 14px;
    }

    /* Download Options Styles */
    .download-dropdown {
        position: relative;
        display: inline-block;
        z-index: 10000;
    }

    .download-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: #0066cc;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .download-btn:hover {
        background: #0056b3;
    }

    .download-icon-small {
        width: 16px;
        height: 16px;
    }

    .dropdown-arrow {
        width: 16px;
        height: 16px;
        transition: transform 0.2s;
    }

    .download-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s;
        margin-top: 4px;
        min-width: 200px;
    }

    .download-menu.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .download-dropdown.open .dropdown-arrow {
        transform: rotate(180deg);
    }

    .jupyter-btn {
        background: #fff;
        color: #333;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 1em;
        cursor: pointer;
        transition:
            background 0.2s,
            box-shadow 0.2s;
        margin-left: 8px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .jupyter-btn:hover,
    .jupyter-btn:focus {
        background: #f8f8f8;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        outline: none;
    }

    .download-option {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 12px 16px;
        background: none;
        border: none;
        text-align: left;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .download-option:hover {
        background: #f8f9fa;
    }

    .download-option:first-child {
        border-radius: 6px 6px 0 0;
    }

    .download-option:last-child {
        border-radius: 0 0 6px 6px;
    }

    .file-icon {
        width: 16px;
        height: 16px;
        color: #666;
    }
`
