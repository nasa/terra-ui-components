import TerraLogin from './login.component.js'

export * from './login.component.js'
export default TerraLogin

TerraLogin.define('terra-login')

declare global {
    interface HTMLElementTagNameMap {
        'terra-login': TerraLogin
    }
}
