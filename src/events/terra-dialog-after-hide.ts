import TerraDialog from '../components/dialog/dialog.component.js'

export type TerraDialogAfterHideEvent = CustomEvent<Record<PropertyKey, never>> & {
    target: TerraDialog
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dialog-after-hide': TerraDialogAfterHideEvent
    }
}
