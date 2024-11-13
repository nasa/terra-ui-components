import type { ListItem } from '../components/variable-combobox/variable-combobox.types.js'

export type TerraComboboxChangeEvent = CustomEvent<
    Partial<
        Exclude<ListItem, 'collectionLongName' | 'eventDetail'> & {
            datasetLandingPage?: string
            variableLandingPage?: string
        }
    >
>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-combobox-change': TerraComboboxChangeEvent
    }
}
