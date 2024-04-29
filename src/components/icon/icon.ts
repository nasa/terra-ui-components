import EduxIcon from './icon.component.js'

export * from './icon.component.js'
export default EduxIcon

EduxIcon.define('edux-icon')

declare global {
    interface HTMLElementTagNameMap {
        'edux-icon': EduxIcon
    }
}
