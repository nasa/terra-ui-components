import TerraStepperStep from './stepper-step.component.js'

export * from './stepper-step.component.js'
export default TerraStepperStep

TerraStepperStep.define('terra-stepper-step')

declare global {
    interface HTMLElementTagNameMap {
        'terra-stepper-step': TerraStepperStep
    }
}
