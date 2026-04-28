import type TerraMenuItem from '../components/menu-item/menu-item.js'

export type TerraSelectEvent = CustomEvent<{ item: TerraMenuItem }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-select': TerraSelectEvent
    }
}
