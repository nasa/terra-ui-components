import TerraDropdown from '../components/dropdown/dropdown.component.js'

export type TerraDropdownAfterHideEvent = CustomEvent<Record<PropertyKey, never>> & {
    target: TerraDropdown
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dropdown-after-hide': TerraDropdownAfterHideEvent
    }
}
