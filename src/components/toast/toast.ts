import TerraToast from './toast.component.js'

export * from './toast.component.js'
export default TerraToast

TerraToast.define('terra-toast')

declare global {
    interface HTMLElementTagNameMap {
        'terra-toast': TerraToast
    }
}
