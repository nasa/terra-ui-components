import TerraDropdown from '../components/dropdown/dropdown.component.js'

export type TerraDropdownAfterShowEvent = CustomEvent<Record<PropertyKey, never>> & {
    target: TerraDropdown
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dropdown-after-show': TerraDropdownAfterShowEvent
    }
}
