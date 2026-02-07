import TerraTextarea from './textarea.component.js'

export * from './textarea.component.js'
export default TerraTextarea

TerraTextarea.define('terra-textarea')

declare global {
    interface HTMLElementTagNameMap {
        'terra-textarea': TerraTextarea
    }
}
