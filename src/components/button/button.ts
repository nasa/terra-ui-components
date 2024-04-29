import EduxButton from './button.component.js'

export * from './button.component.js'
export default EduxButton

EduxButton.define('edux-button')

declare global {
    interface HTMLElementTagNameMap {
        'edux-button': EduxButton
    }
}
