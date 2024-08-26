import type { ListItem } from '../components/variable-combobox/variable-combobox.controller.js'

export type TerraComboboxChangeEvent = CustomEvent<
    Partial<Exclude<ListItem, 'collectionLongName' | 'eventDetail' | 'units'>>
>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-combobox-change': TerraComboboxChangeEvent
    }
}
