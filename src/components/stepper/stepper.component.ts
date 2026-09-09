import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
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

    /** Screen size detection use to determine layout for mobile devices */

    @state() 
    isMobile = false

    @state()
    private steps: Element[] = []

    private mediaQuery = window.matchMedia('(max-width: 600px)');
    
    connectedCallback() {
        super.connectedCallback();

        this.isMobile = this.mediaQuery.matches;
        this.mediaQuery.addEventListener('change', this.handleMediaChange);
    }

    disconnectedCallback() {
        this.mediaQuery.removeEventListener('change', this.handleMediaChange);

        super.disconnectedCallback();
    }

    private handleMediaChange = (event: MediaQueryListEvent) => {
        this.isMobile = event.matches;
    };

    private getStepProgress(): {
        current: number
        total: number
        title?: string
        content?: string
    } {
        const currentIndex = this.steps.findIndex(
            (step) => step.getAttribute('state') === 'current'
        )

        const currentStep = this.steps[currentIndex]

        return {
            current: currentIndex + 1,
            total: this.steps.length,
            title: currentStep?.getAttribute('title') ?? undefined,
            content: currentStep?.textContent?.trim() || undefined,
        }
    }

    @query('slot') defaultSlot: HTMLSlotElement

    /**
     * The stepper's variant. The default variant includes titles and optional captions for each step.
     * The condensed variant uses colored bars to represent each step and is useful when space is a concern.
     */
    @property({ reflect: true }) variant: 'default' | 'condensed' = 'default'

    private handleSlotChange(event: Event) {
        const slottedElements = [
            ...this.defaultSlot.assignedElements({ flatten: true }),
        ] as HTMLElement[]

        const slot = event.target as HTMLSlotElement

        this.steps = slot.assignedElements().filter(
            (element) =>
                element.tagName.toLowerCase() === 'terra-stepper-step'
        )


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
        const { current, total, title, content } = this.getStepProgress()

        return html`
            <div
                part="base"
                class=${classMap({
                    stepper: true,
                    'stepper--default':
                        this.variant === 'default' && !this.isMobile,
                    'stepper--condensed':
                        this.variant === 'condensed' || this.isMobile,
                })}
            >
                <slot @slotchange=${this.handleSlotChange}></slot>
                ${this.variant === 'condensed' || this.isMobile
                    ? html `
                        <div class="stepper-step__title">
                            ${title}
                        </div>
                        <div class="stepper-step__caption">
                            ${content}
                        </div>
                        <div class="step-progress">
                            Step ${current} of ${total}
                        </div>                   
                    `
                    : ''}

            </div>
        `
    }
}

function findStep(el: HTMLElement) {
    const selector = 'terra-stepper-step'

    // The step could be the target element or a child of it
    return el.closest(selector) ?? el.querySelector(selector)
}
