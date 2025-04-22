import TerraDialog from './dialog.component.js'

export * from './dialog.component.js'
export default TerraDialog

TerraDialog.define('terra-dialog')

declare global {
    interface HTMLElementTagNameMap {
        'terra-dialog': TerraDialog
    }
}
