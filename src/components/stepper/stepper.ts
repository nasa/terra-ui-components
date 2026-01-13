import TerraStepper from './stepper.component.js'

export * from './stepper.component.js'
export default TerraStepper

TerraStepper.define('terra-stepper')

declare global {
    interface HTMLElementTagNameMap {
        'terra-stepper': TerraStepper
    }
}
