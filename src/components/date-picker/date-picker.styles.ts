import { css } from 'lit'

export default css`
    :host {
        display: block;
    }

    .date-picker {
        position: relative;
        width: 100%;
    }

    .date-picker__dropdown-wrapper {
        position: relative;
    }

    .date-picker__icon {
        flex-shrink: 0;
        color: var(--terra-color-neutral-500, #6b7280);
        cursor: pointer;
    }

    /* Make the terra-input look clickable */
    terra-input {
        cursor: pointer;
    }

    terra-input::part(base) {
        cursor: pointer;
    }

    terra-input::part(input) {
        cursor: pointer;
    }

    .date-picker__dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 0.5rem;
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        overflow: hidden;
    }

    .date-picker--inline {
        width: auto;
        display: flex;
        flex-direction: column;
    }

    .date-picker--inline terra-input {
        width: auto;
        display: inline-block;
        min-width: 280px;
    }

    .date-picker--inline terra-input::part(base) {
        width: auto;
        min-width: 280px;
    }

    .date-picker__inputs {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }

    .date-picker--split-inputs .date-picker__inputs {
        width: 100%;
    }

    .date-picker--split-inputs .date-picker__inputs terra-input {
        flex: 1;
    }

    .date-picker--inline.date-picker--split-inputs .date-picker__inputs {
        width: auto;
    }

    .date-picker--inline.date-picker--split-inputs .date-picker__inputs terra-input {
        flex: none;
        width: auto;
        min-width: 280px;
    }

    .date-picker--inline .date-picker__dropdown-wrapper {
        position: static;
        width: fit-content;
        display: inline-block;
    }

    .date-picker__dropdown--inline {
        position: static;
        top: auto;
        left: auto;
        z-index: auto;
        box-shadow: none;
        border: 1px solid var(--terra-color-neutral-200, #e5e7eb);
        margin-top: 0;
        overflow: visible;
        width: fit-content;
        min-width: fit-content;
        max-width: fit-content;
    }

    .date-picker__content {
        display: flex;
    }

    .date-picker__dropdown--inline .date-picker__content {
        width: fit-content;
        min-width: fit-content;
    }

    .date-picker__sidebar {
        display: flex;
        flex-direction: column;
        width: 10rem;
        padding: 0.5rem;
        background: var(--terra-color-neutral-50, #f9fafb);
        border-right: 1px solid var(--terra-color-neutral-200, #e5e7eb);
        flex-shrink: 0;
    }

    .date-picker__preset {
        display: block;
        width: 100%;
        padding: 0.5rem 0.75rem;
        text-align: left;
        background: transparent;
        border: none;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        color: var(--terra-color-neutral-700, #374151);
        cursor: pointer;
        transition: background-color 0.15s ease;
    }

    .date-picker__preset:hover {
        background: var(--terra-color-neutral-100, #f3f4f6);
    }

    .date-picker__preset:focus {
        outline: none;
        background: var(--terra-color-primary-50, #eff6ff);
        color: var(--terra-color-primary-700, #1d4ed8);
    }

    .date-picker__calendars {
        display: flex;
        gap: 1rem;
        padding: 1rem;
    }

    .calendar {
        display: flex;
        flex-direction: column;
        min-width: 280px;
    }

    .calendar__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding: 0 0.5rem;
    }

    .calendar__month-year {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .calendar__month-dropdown-wrapper {
        position: relative;
    }

    .calendar__month-button {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.375rem 0.75rem;
        background: var(--terra-color-neutral-50, #f9fafb);
        border: 1px solid var(--terra-color-neutral-200, #e5e7eb);
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--terra-color-neutral-900, #111827);
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .calendar__month-button:hover {
        background: var(--terra-color-neutral-100, #f3f4f6);
        border-color: var(--terra-color-neutral-300, #d1d5db);
    }

    .calendar__month-icon {
        color: var(--terra-color-neutral-500, #6b7280);
    }

    .calendar__month-dropdown {
        position: absolute;
        top: calc(100% + 0.25rem);
        left: 0;
        z-index: 1001;
        min-width: 140px;
        max-height: 280px;
        overflow-y: auto;
        background: white;
        border: 1px solid var(--terra-color-neutral-200, #e5e7eb);
        border-radius: 0.375rem;
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        padding: 0.25rem;
    }

    .calendar__month-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: transparent;
        border: none;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        color: var(--terra-color-neutral-700, #374151);
        text-align: left;
        cursor: pointer;
        transition: background-color 0.15s ease;
    }

    .calendar__month-option:hover {
        background: var(--terra-color-neutral-100, #f3f4f6);
    }

    .calendar__month-option--selected {
        background: var(--terra-color-primary-50, #eff6ff);
        color: var(--terra-color-primary-700, #1d4ed8);
        font-weight: 500;
    }

    .calendar__month-check {
        flex-shrink: 0;
        color: var(--terra-color-primary-600, #2563eb);
    }

    .calendar__year-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .calendar__year-input {
        width: 75px;
        padding: 0.375rem 1.5rem 0.375rem 0.75rem;
        background: var(--terra-color-neutral-50, #f9fafb);
        border: 1px solid var(--terra-color-neutral-200, #e5e7eb);
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--terra-color-neutral-900, #111827);
        text-align: center;
        -moz-appearance: textfield;
    }

    .calendar__year-input::-webkit-outer-spin-button,
    .calendar__year-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .calendar__year-input:hover {
        background: var(--terra-color-neutral-100, #f3f4f6);
        border-color: var(--terra-color-neutral-300, #d1d5db);
    }

    .calendar__year-input:focus {
        outline: none;
        border-color: var(--terra-color-primary-500, #3b82f6);
        background: white;
    }

    .calendar__year-spinners {
        position: absolute;
        right: 0.25rem;
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    .calendar__year-spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 0.875rem;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 0.125rem;
        color: var(--terra-color-neutral-500, #6b7280);
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .calendar__year-spinner:hover {
        background: var(--terra-color-neutral-200, #e5e7eb);
        color: var(--terra-color-neutral-700, #374151);
    }

    .calendar__year-spinner:active {
        background: var(--terra-color-neutral-300, #d1d5db);
    }

    .calendar__nav {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 0.375rem;
        color: var(--terra-color-neutral-600, #4b5563);
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .calendar__nav:hover {
        background: var(--terra-color-neutral-100, #f3f4f6);
        color: var(--terra-color-neutral-900, #111827);
    }

    .calendar__nav:focus {
        outline: none;
        background: var(--terra-color-neutral-100, #f3f4f6);
    }

    .calendar__weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.25rem;
        margin-bottom: 0.5rem;
    }

    .calendar__weekday {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--terra-color-neutral-500, #6b7280);
        text-transform: uppercase;
    }

    .calendar__days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.25rem;
    }

    .calendar__day {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.5rem;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        color: var(--terra-color-neutral-900, #111827);
        cursor: pointer;
        transition: all 0.15s ease;
        position: relative;
    }

    .calendar__day:hover:not(.calendar__day--disabled) {
        background: var(--terra-color-neutral-100, #f3f4f6);
    }

    .calendar__day--outside {
        color: var(--terra-color-neutral-400, #9ca3af);
    }

    .calendar__day--disabled {
        color: var(--terra-color-neutral-300, #d1d5db);
        cursor: not-allowed;
    }

    .calendar__day--selected {
        background: var(--terra-color-primary-500, #3b82f6) !important;
        color: white !important;
        font-weight: 600;
    }

    .calendar__day--start {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .calendar__day--end {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .calendar__day--in-range {
        background: var(--terra-color-primary-100, #dbeafe);
        color: var(--terra-color-primary-900, #1e3a8a);
        border-radius: 0;
    }

    .calendar__day--hover-range {
        background: var(--terra-color-primary-50, #eff6ff);
        border-radius: 0;
    }

    .calendar__day--start.calendar__day--in-range {
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
    }

    .calendar__day--end.calendar__day--in-range {
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
    }

    .date-picker__separator {
        color: var(--terra-color-neutral-400, #9ca3af);
    }

    /* Time Picker Styles */
    .date-picker__time {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
        border-top: 1px solid var(--terra-color-neutral-200, #e5e7eb);
        background: var(--terra-color-neutral-50, #f9fafb);
        width: 100%;
    }

    .date-picker__time-section {
        display: flex;
        align-items: center;
    }

    .date-picker__time-inputs {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .date-picker__time-input-group {
        position: relative;
        display: flex;
        align-items: center;
    }

    .date-picker__time-input {
        width: 55px;
        padding: 0.5rem 1.5rem 0.5rem 0.75rem;
        background: white;
        border: 1px solid var(--terra-color-neutral-300, #d1d5db);
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--terra-color-neutral-900, #111827);
        text-align: center;
        -moz-appearance: textfield;
    }

    .date-picker__time-input::-webkit-outer-spin-button,
    .date-picker__time-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .date-picker__time-input:hover {
        border-color: var(--terra-color-neutral-400, #9ca3af);
    }

    .date-picker__time-input:focus {
        outline: none;
        border-color: var(--terra-color-primary-500, #3b82f6);
        box-shadow: 0 0 0 2px var(--terra-color-primary-100, #dbeafe);
    }

    .date-picker__time-spinners {
        position: absolute;
        right: 0.25rem;
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    .date-picker__time-spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 0.875rem;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 0.125rem;
        color: var(--terra-color-neutral-500, #6b7280);
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .date-picker__time-spinner:hover {
        background: var(--terra-color-neutral-200, #e5e7eb);
        color: var(--terra-color-neutral-700, #374151);
    }

    .date-picker__time-spinner:active {
        background: var(--terra-color-neutral-300, #d1d5db);
    }

    .date-picker__time-separator {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--terra-color-neutral-600, #4b5563);
    }

    .date-picker__time-period {
        padding: 0.5rem 0.75rem;
        background: white;
        border: 1px solid var(--terra-color-neutral-300, #d1d5db);
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--terra-color-neutral-700, #374151);
        cursor: pointer;
        transition: all 0.15s ease;
        text-transform: uppercase;
    }

    .date-picker__time-period:hover {
        background: var(--terra-color-neutral-50, #f9fafb);
        border-color: var(--terra-color-neutral-400, #9ca3af);
    }

    .date-picker__time-period:active {
        background: var(--terra-color-neutral-100, #f3f4f6);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .date-picker__dropdown {
            flex-direction: column;
        }

        .date-picker__sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--terra-color-neutral-200, #e5e7eb);
        }

        .date-picker__calendars {
            flex-direction: column;
        }

        .date-picker__time {
            flex-direction: column;
        }
    }
`
