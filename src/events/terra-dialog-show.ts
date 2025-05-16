import TerraDialog from '../components/dialog/dialog.component.js'

export type TerraDialogShowEvent = CustomEvent<Record<PropertyKey, never>> & {
    target: TerraDialog
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dialog-show': TerraDialogShowEvent
    }
}
