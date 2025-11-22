import TerraAvatar from './avatar.component.js'

export * from './avatar.component.js'
export default TerraAvatar

TerraAvatar.define('terra-avatar')

declare global {
    interface HTMLElementTagNameMap {
        'terra-avatar': TerraAvatar
    }
}
