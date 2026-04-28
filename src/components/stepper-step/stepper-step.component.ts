import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { property } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './stepper-step.styles.js'
import TerraIcon from '../icon/icon.component.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary A step within a stepper component that displays progress through a multi-step workflow.
 * @documentation https://terra-ui.netlify.app/components/stepper-step
 * @status stable
 * @since 1.0
 *
 * @slot - The step's caption (optional, only shown in default variant).
 *
 * @csspart base - The component's base wrapper.
 * @csspart bar - The progress bar indicator.
 * @csspart content - The content area containing title and caption.
 * @csspart title - The step's title.
 * @csspart caption - The step's caption.
 * @csspart icon - The checkmark icon (shown when completed).
 */
export default class TerraStepperStep extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-icon': TerraIcon,
    }

    /**
     * The step's state. "completed" shows a checkmark, "current" highlights the step as active,
     * and "upcoming" shows the step as not yet reached.
     */
    @property({ reflect: true }) state: 'completed' | 'current' | 'upcoming' =
        'upcoming'

    /** The step's title. Should be short, preferably 1-2 words. */
    @property() title = ''

    /** When true, hides the checkmark icon for completed steps. */
    @property({ type: Boolean, reflect: true, attribute: 'hide-checkmark' })
    hideCheckmark = false

    private getStepperVariant(): 'default' | 'condensed' {
        const stepper = this.closest('terra-stepper')
        if (stepper) {
            return (stepper as any).variant || 'default'
        }
        return 'default'
    }

    render() {
        const variant = this.getStepperVariant()
        const isCondensed = variant === 'condensed'
        const isCompleted = this.state === 'completed'
        const isCurrent = this.state === 'current'

        return html`
            <div
                part="base"
                class=${classMap({
                    'stepper-step': true,
                    'stepper-step--default': !isCondensed,
                    'stepper-step--condensed': isCondensed,
                    'stepper-step--completed': isCompleted,
                    'stepper-step--current': isCurrent,
                    'stepper-step--upcoming': this.state === 'upcoming',
                })}
            >
                <div part="bar" class="stepper-step__bar"></div>
                ${!isCondensed
                    ? html`
                          <div part="content" class="stepper-step__content">
                              <div part="title" class="stepper-step__title">
                                  ${isCompleted && !this.hideCheckmark
                                      ? html`
                                            <terra-icon
                                                part="icon"
                                                name="solid-check"
                                                library="heroicons"
                                                class="stepper-step__icon"
                                            ></terra-icon>
                                        `
                                      : ''}
                                  ${this.title}
                              </div>
                              <div part="caption" class="stepper-step__caption">
                                  <slot></slot>
                              </div>
                          </div>
                      `
                    : ''}
            </div>
        `
    }
}
