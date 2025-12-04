import TerraSiteNavigation from './site-navigation.component.js'

export * from './site-navigation.component.js'
export default TerraSiteNavigation

TerraSiteNavigation.define('terra-site-navigation')

declare global {
    interface HTMLElementTagNameMap {
        'terra-site-navigation': TerraSiteNavigation
    }
}
