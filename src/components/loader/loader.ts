import TerraLoader from './loader.component.js'

export * from './loader.component.js'
export default TerraLoader

TerraLoader.define('terra-loader')

declare global {
    interface HTMLElementTagNameMap {
        'terra-loader': TerraLoader
    }
}
