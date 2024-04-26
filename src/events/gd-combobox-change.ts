import type { ListItem } from '../components/variable-combobox/variable-combobox.controller.js'

export type GdComboboxChangeEvent = CustomEvent<
    Partial<Exclude<ListItem, 'eventDetail'>>
>

declare global {
    interface GlobalEventHandlersEventMap {
        'gd-combobox-change': GdComboboxChangeEvent
    }
}
