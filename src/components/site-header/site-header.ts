import TerraSiteHeader from './site-header.component.js'

export * from './site-header.component.js'
export default TerraSiteHeader

TerraSiteHeader.define('terra-site-header')

declare global {
    interface HTMLElementTagNameMap {
        'terra-site-header': TerraSiteHeader
    }
}
