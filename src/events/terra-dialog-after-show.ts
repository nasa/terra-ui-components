import TerraDialog from '../components/dialog/dialog.component.js'

export type TerraDialogAfterShowEvent = CustomEvent<Record<PropertyKey, never>> & {
    target: TerraDialog
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dialog-after-show': TerraDialogAfterShowEvent
    }
}
