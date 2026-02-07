import TerraDataAccess from './data-access.component.js'

export * from './data-access.component.js'
export default TerraDataAccess

TerraDataAccess.define('terra-data-access')

declare global {
    interface HTMLElementTagNameMap {
        'terra-data-access': TerraDataAccess
    }
}
