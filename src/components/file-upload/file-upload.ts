import TerraFileUpload from './file-upload.component.js'

export * from './file-upload.component.js'
export default TerraFileUpload

TerraFileUpload.define('terra-file-upload')

declare global {
    interface HTMLElementTagNameMap {
        'terra-file-upload': TerraFileUpload
    }
}
