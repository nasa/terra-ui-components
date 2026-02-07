import TerraDropdown from '../components/dropdown/dropdown.component.js'

export type TerraDropdownHideEvent = CustomEvent<Record<PropertyKey, never>> & {
    target: TerraDropdown
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dropdown-hide': TerraDropdownHideEvent
    }
}
