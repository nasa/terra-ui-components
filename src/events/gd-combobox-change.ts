import type { ListItem } from '../components/variable-combobox/variable-combobox.controller.js'

export type EduxComboboxChangeEvent = CustomEvent<
    Partial<Exclude<ListItem, 'eventDetail'>>
>

declare global {
    interface GlobalEventHandlersEventMap {
        'edux-combobox-change': EduxComboboxChangeEvent
    }
}
