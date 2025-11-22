import TerraScrollHint from './scroll-hint.component.js'

export * from './scroll-hint.component.js'
export default TerraScrollHint

TerraScrollHint.define('terra-scroll-hint')

declare global {
    interface HTMLElementTagNameMap {
        'terra-scroll-hint': TerraScrollHint
    }
}
