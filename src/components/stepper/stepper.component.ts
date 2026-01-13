import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { property, query } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './stepper.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Steppers display a visitor's progress through linear workflows and experiences with multiple steps.
 * @documentation https://terra-ui.netlify.app/components/stepper
 * @status stable
 * @since 1.0
 *
 * @slot - One or more `<terra-stepper-step>` elements to display in the stepper.
 *
 * @csspart base - The component's base wrapper.
 */
export default class TerraStepper extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @query('slot') defaultSlot: HTMLSlotElement

    /**
     * The stepper's variant. The default variant includes titles and optional captions for each step.
     * The condensed variant uses colored bars to represent each step and is useful when space is a concern.
     */
    @property({ reflect: true }) variant: 'default' | 'condensed' = 'default'

    private handleSlotChange() {
        const slottedElements = [
            ...this.defaultSlot.assignedElements({ flatten: true }),
        ] as HTMLElement[]

        slottedElements.forEach((el, index) => {
            const step = findStep(el)

            if (step) {
                step.toggleAttribute('data-terra-stepper__step', true)
                step.toggleAttribute('data-terra-stepper__step--first', index === 0)
                step.toggleAttribute(
                    'data-terra-stepper__step--last',
                    index === slottedElements.length - 1
                )
            }
        })
    }

    render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    stepper: true,
                    'stepper--default': this.variant === 'default',
                    'stepper--condensed': this.variant === 'condensed',
                })}
            >
                <slot @slotchange=${this.handleSlotChange}></slot>
            </div>
        `
    }
}

function findStep(el: HTMLElement) {
    const selector = 'terra-stepper-step'

    // The step could be the target element or a child of it
    return el.closest(selector) ?? el.querySelector(selector)
}
