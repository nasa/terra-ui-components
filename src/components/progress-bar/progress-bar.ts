import TerraProgressBar from './progress-bar.component.js'

export * from './progress-bar.component.js'
export default TerraProgressBar

TerraProgressBar.define('terra-progress-bar')

declare global {
    interface HTMLElementTagNameMap {
        'terra-progress-bar': TerraProgressBar
    }
}
