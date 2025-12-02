import TerraDialog from '../components/dialog/dialog.component.js'

export type TerraDialogRequestCloseEvent = CustomEvent<{
    source: 'close-button' | 'keyboard' | 'overlay'
}> & {
    target: TerraDialog
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-dialog-request-close': TerraDialogRequestCloseEvent
    }
}
