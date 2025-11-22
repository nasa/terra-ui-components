import TerraTag from './tag.component.js'

export * from './tag.component.js'
export default TerraTag

TerraTag.define('terra-tag')

declare global {
    interface HTMLElementTagNameMap {
        'terra-tag': TerraTag
    }
}
