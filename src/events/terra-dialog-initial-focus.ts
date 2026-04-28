import TerraDialog from '../components/dialog/dialog.component.js'

export type TerraDialogInitialFocusEvent = CustomEvent<Record<PropertyKey, never>> & {
    target: TerraDialog
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dialog-initial-focus': TerraDialogInitialFocusEvent
    }
}
