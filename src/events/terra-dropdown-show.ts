import TerraDropdown from '../components/dropdown/dropdown.component.js'

export type TerraDropdownShowEvent = CustomEvent<Record<PropertyKey, never>> & {
    target: TerraDropdown
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dropdown-show': TerraDropdownShowEvent
    }
}
