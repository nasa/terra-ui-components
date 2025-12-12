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

    terra-dropdown {
        width: 100%;
    }

    /* Styles for dropdown panel content */
    terra-dropdown::part(panel) {
        padding: 0;
    }

    terra-dropdown .date-picker__dropdown {
        position: static;
        box-shadow: none;
        border: none;
        margin: 0;
    }

    .date-picker__icon {
        display: var(--terra-datepicker-icon-display, block);
        flex-shrink: 0;
        color: var(--terra-input-icon-color);
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
        display: flex;
        flex-direction: column;
        background: var(--terra-panel-background-color);
        border-radius: var(--terra-border-radius-large);
        box-shadow: var(--terra-shadow-large);
        overflow: hidden;
    }

    /* For inline mode, position absolutely */
    .date-picker--inline .date-picker__dropdown {
        position: static;
        box-shadow: none;
        border: var(--terra-panel-border-width) solid var(--terra-panel-border-color);
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
        gap: var(--terra-spacing-medium);
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
        border: var(--terra-panel-border-width) solid var(--terra-panel-border-color);
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
        padding: var(--terra-spacing-x-small);
        background: var(--terra-color-carbon-5);
        border-right: var(--terra-panel-border-width) solid
            var(--terra-panel-border-color);
        flex-shrink: 0;
    }

    .date-picker__preset {
        display: block;
        width: 100%;
        padding: var(--terra-spacing-x-small) var(--terra-spacing-small);
        text-align: left;
        background: transparent;
        border: none;
        border-radius: var(--terra-border-radius-medium);
        font-size: var(--terra-font-size-small);
        font-family: var(--terra-font-family--inter);
        color: var(--terra-color-carbon-70);
        cursor: pointer;
        transition: background-color var(--terra-transition-fast);
    }

    .date-picker__preset:hover {
        background: var(--terra-color-carbon-10);
    }

    .date-picker__preset:focus {
        outline: none;
        background: var(--terra-menu-item-background-color-focus);
        color: var(--terra-color-spacesuit-white);
    }

    .date-picker__calendars {
        display: flex;
        gap: var(--terra-spacing-medium);
        padding: var(--terra-spacing-medium);
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
        margin-bottom: var(--terra-spacing-medium);
        padding: 0 var(--terra-spacing-x-small);
    }

    .calendar__month-year {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-x-small);
    }

    .calendar__month-dropdown-wrapper {
        position: relative;
    }

    .calendar__month-button {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-2x-small);
        padding: var(--terra-spacing-x-small) var(--terra-spacing-small);
        background: var(--terra-input-background-color);
        border: var(--terra-input-border-width) solid var(--terra-input-border-color);
        border-radius: var(--terra-border-radius-medium);
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-semibold);
        font-family: var(--terra-font-family--inter);
        color: var(--terra-color-carbon-90);
        cursor: pointer;
        transition: all var(--terra-transition-fast);
    }

    .calendar__month-button:hover {
        background: var(--terra-input-background-color-hover);
        border-color: var(--terra-input-border-color-hover);
    }

    .calendar__month-icon {
        color: var(--terra-input-icon-color);
    }

    .calendar__month-dropdown {
        position: absolute;
        top: calc(100% + var(--terra-spacing-2x-small));
        left: 0;
        z-index: var(--terra-z-index-tooltip);
        min-width: 140px;
        max-height: 280px;
        overflow-y: auto;
        background: var(--terra-panel-background-color);
        border: var(--terra-panel-border-width) solid var(--terra-panel-border-color);
        border-radius: var(--terra-border-radius-medium);
        box-shadow: var(--terra-shadow-large);
        padding: var(--terra-spacing-2x-small);
    }

    .calendar__month-option {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-x-small);
        width: 100%;
        padding: var(--terra-spacing-x-small) var(--terra-spacing-small);
        background: transparent;
        border: none;
        border-radius: var(--terra-border-radius-small);
        font-size: var(--terra-font-size-small);
        font-family: var(--terra-font-family--inter);
        color: var(--terra-color-carbon-70);
        text-align: left;
        cursor: pointer;
        transition: background-color var(--terra-transition-fast);
    }

    .calendar__month-option:hover {
        background: var(--terra-color-carbon-10);
    }

    .calendar__month-option--selected {
        background: var(--terra-menu-item-background-color-focus);
        color: var(--terra-color-spacesuit-white);
        font-weight: var(--terra-font-weight-semibold);
    }

    .calendar__month-check {
        flex-shrink: 0;
        color: var(--terra-color-spacesuit-white);
    }

    .calendar__year-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .calendar__year-input {
        width: 75px;
        padding: var(--terra-spacing-x-small) var(--terra-spacing-large)
            var(--terra-spacing-x-small) var(--terra-spacing-small);
        background: var(--terra-input-background-color);
        border: var(--terra-input-border-width) solid var(--terra-input-border-color);
        border-radius: var(--terra-border-radius-medium);
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-semibold);
        font-family: var(--terra-input-font-family);
        color: var(--terra-input-color);
        text-align: center;
        -moz-appearance: textfield;
    }

    .calendar__year-input::-webkit-outer-spin-button,
    .calendar__year-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .calendar__year-input:hover {
        background: var(--terra-input-background-color-hover);
        border-color: var(--terra-input-border-color-hover);
    }

    .calendar__year-input:focus {
        outline: none;
        border-color: var(--terra-input-border-color-focus);
        background: var(--terra-input-background-color-focus);
        box-shadow: 0 0 0 var(--terra-focus-ring-width)
            var(--terra-input-focus-ring-color);
    }

    .calendar__year-spinners {
        position: absolute;
        right: var(--terra-spacing-2x-small);
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
        border-radius: var(--terra-border-radius-small);
        color: var(--terra-input-icon-color);
        cursor: pointer;
        transition: all var(--terra-transition-fast);
    }

    .calendar__year-spinner:hover {
        background: var(--terra-color-carbon-10);
        color: var(--terra-color-carbon-90);
    }

    .calendar__year-spinner:active {
        background: var(--terra-color-carbon-20);
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
        border-radius: var(--terra-border-radius-medium);
        color: var(--terra-color-carbon-60);
        cursor: pointer;
        transition: all var(--terra-transition-fast);
    }

    .calendar__nav:hover {
        background: var(--terra-color-carbon-10);
        color: var(--terra-color-carbon-90);
    }

    .calendar__nav:focus {
        outline: none;
        background: var(--terra-color-carbon-10);
    }

    .calendar__weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: var(--terra-spacing-2x-small);
        margin-bottom: var(--terra-spacing-x-small);
    }

    .calendar__weekday {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2rem;
        font-size: var(--terra-font-size-x-small);
        font-weight: var(--terra-font-weight-semibold);
        font-family: var(--terra-font-family--inter);
        color: var(--terra-color-carbon-50);
        text-transform: uppercase;
    }

    .calendar__days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: var(--terra-spacing-2x-small);
    }

    .calendar__day {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.5rem;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: var(--terra-border-radius-medium);
        font-size: var(--terra-font-size-small);
        font-family: var(--terra-font-family--inter);
        color: var(--terra-color-carbon-90);
        cursor: pointer;
        transition: all var(--terra-transition-fast);
        position: relative;
    }

    .calendar__day:hover:not(.calendar__day--disabled) {
        background: var(--terra-color-carbon-10);
    }

    .calendar__day--outside {
        color: var(--terra-color-carbon-40);
    }

    .calendar__day--disabled {
        color: var(--terra-color-carbon-30);
        cursor: not-allowed;
    }

    .calendar__day--selected {
        background: var(--terra-color-nasa-blue) !important;
        color: var(--terra-color-spacesuit-white) !important;
        font-weight: var(--terra-font-weight-bold);
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
        background: var(--terra-color-nasa-blue-tint);
        color: var(--terra-color-carbon-90);
        border-radius: 0;
    }

    .calendar__day--hover-range {
        background: var(--terra-color-carbon-5);
        border-radius: 0;
    }

    .calendar__day--start.calendar__day--in-range {
        border-top-left-radius: var(--terra-border-radius-medium);
        border-bottom-left-radius: var(--terra-border-radius-medium);
    }

    .calendar__day--end.calendar__day--in-range {
        border-top-right-radius: var(--terra-border-radius-medium);
        border-bottom-right-radius: var(--terra-border-radius-medium);
    }

    .date-picker__separator {
        color: var(--terra-color-carbon-40);
    }

    /* Time Picker Styles */
    .date-picker__time {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--terra-spacing-medium);
        padding: var(--terra-spacing-medium);
        border-top: var(--terra-panel-border-width) solid
            var(--terra-panel-border-color);
        background: var(--terra-color-carbon-5);
        width: 100%;
    }

    .date-picker__time-section {
        display: flex;
        align-items: center;
    }

    .date-picker__time-inputs {
        display: flex;
        align-items: center;
        gap: var(--terra-spacing-x-small);
    }

    .date-picker__time-input-group {
        position: relative;
        display: flex;
        align-items: center;
    }

    .date-picker__time-input {
        width: 55px;
        padding: var(--terra-spacing-x-small) var(--terra-spacing-large)
            var(--terra-spacing-x-small) var(--terra-spacing-small);
        background: var(--terra-input-background-color);
        border: var(--terra-input-border-width) solid var(--terra-input-border-color);
        border-radius: var(--terra-border-radius-medium);
        font-size: var(--terra-font-size-small);
        font-weight: var(--terra-font-weight-semibold);
        font-family: var(--terra-input-font-family);
        color: var(--terra-input-color);
        text-align: center;
        -moz-appearance: textfield;
    }

    .date-picker__time-input::-webkit-outer-spin-button,
    .date-picker__time-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .date-picker__time-input:hover {
        border-color: var(--terra-input-border-color-hover);
    }

    .date-picker__time-input:focus {
        outline: none;
        border-color: var(--terra-input-border-color-focus);
        box-shadow: 0 0 0 var(--terra-focus-ring-width)
            var(--terra-input-focus-ring-color);
    }

    .date-picker__time-spinners {
        position: absolute;
        right: var(--terra-spacing-2x-small);
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
        border-radius: var(--terra-border-radius-small);
        color: var(--terra-input-icon-color);
        cursor: pointer;
        transition: all var(--terra-transition-fast);
    }

    .date-picker__time-spinner:hover {
        background: var(--terra-color-carbon-20);
        color: var(--terra-input-icon-color-hover);
    }

    .date-picker__time-spinner:active {
        background: var(--terra-color-carbon-30);
    }

    .date-picker__time-separator {
        font-size: var(--terra-font-size-large);
        font-weight: var(--terra-font-weight-bold);
        font-family: var(--terra-font-family--inter);
        color: var(--terra-color-carbon-60);
    }

    .date-picker__time-period {
        padding: var(--terra-spacing-x-small) var(--terra-spacing-small);
        background: var(--terra-input-background-color);
        border: var(--terra-input-border-width) solid var(--terra-input-border-color);
        border-radius: var(--terra-border-radius-medium);
        font-size: var(--terra-font-size-x-small);
        font-weight: var(--terra-font-weight-bold);
        font-family: var(--terra-font-family--inter);
        color: var(--terra-color-carbon-70);
        cursor: pointer;
        transition: all var(--terra-transition-fast);
        text-transform: uppercase;
    }

    .date-picker__time-period:hover {
        background: var(--terra-color-carbon-5);
        border-color: var(--terra-input-border-color-hover);
    }

    .date-picker__time-period:active {
        background: var(--terra-color-carbon-10);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .date-picker__dropdown {
            flex-direction: column;
        }

        .date-picker__sidebar {
            width: 100%;
            border-right: none;
            border-bottom: var(--terra-panel-border-width) solid
                var(--terra-panel-border-color);
        }

        .date-picker__calendars {
            flex-direction: column;
        }

        .date-picker__time {
            flex-direction: column;
        }
    }
`
