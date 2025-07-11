import TerraAccordion from './accordion.component.js'

export * from './accordion.component.js'
export default TerraAccordion

TerraAccordion.define('terra-accordion')

declare global {
    interface HTMLElementTagNameMap {
        'terra-accordion': TerraAccordion
    }
}
