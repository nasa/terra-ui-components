import TerraDialog from '../components/dialog/dialog.component.js'

export type TerraDialogHideEvent = CustomEvent<Record<PropertyKey, never>> & {
    target: TerraDialog
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dialog-hide': TerraDialogHideEvent
    }
}
