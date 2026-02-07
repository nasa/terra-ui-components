import TerraEarthdataLogin from './earthdata-login.component.js'

export * from './earthdata-login.component.js'
export default TerraEarthdataLogin

TerraEarthdataLogin.define('terra-earthdata-login')

declare global {
    interface HTMLElementTagNameMap {
        'terra-earthdata-login': TerraEarthdataLogin
    }
}
