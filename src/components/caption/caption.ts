import TerraCaption from './caption.component.js'

export * from './caption.component.js'
export default TerraCaption

TerraCaption.define('terra-caption')

declare global {
    interface HTMLElementTagNameMap {
        'terra-caption': TerraCaption
    }
}
