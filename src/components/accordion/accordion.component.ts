import { html } from 'lit'
import { property } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './accordion.styles.js'
import type { CSSResultGroup } from 'lit'
import TerraIcon from '../icon/icon.component.js'

/**
 * @summary A collapsible content panel for showing and hiding content.
 * @documentation https://disc.gsfc.nasa.gov/components/accordion
 * @status experimental
 * @since 1.0
 *
 * The TerraAccordion component provides a simple, accessible way to show and hide content. It uses native <details> and <summary> elements for built-in accessibility and keyboard support. The summary/header can be set via the `summary` property for simple text, or via a named `summary` slot for custom content (such as icons or rich HTML). The open state can be controlled with the `open` property, which is reflected as an attribute.
 *
 * @slot - The default slot for accordion content.
 * @slot summary - The summary/header for the accordion (optional, overrides summary property)
 *
 * @property {string} summary - The summary/header for the accordion. Use the property for simple text, or the slot for custom content.
 * @property {boolean} open - Whether the accordion is open or not. This property is reflected as an attribute and can be controlled programmatically or by user interaction.
 *
 * @event terra-accordion-toggle - emitted when the accordion opens or closes
 *
 * @dependency terra-icon
 */
export default class TerraAccordion extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-icon': TerraIcon,
    }

    /**
     * The summary/header for the accordion. You can either set this property for a simple string summary,
     * or provide a <span slot="summary">...</span> for more advanced content (e.g., rich HTML, icons).
     */
    @property() summary?: string

    /** whether the accordion is open or not */
    @property({ reflect: true, type: Boolean }) open: boolean = false

    @property({ type: Boolean }) showArrow: boolean = true

    render() {
        return html`
            <details
                class="accordion"
                ?open=${this.open}
                @toggle=${this.handleToggle}
            >
                <summary class="accordion-summary">
                    <slot name="summary"> ${this.summary} </slot>

                    <div class="accordion-summary-right">
                        <slot name="summary-right"></slot>

                        ${this.showArrow &&
                        html`
                            <terra-icon
                                name="chevron-down-circle"
                                font-size="24px"
                            ></terra-icon>
                        `}
                    </div>
                </summary>

                <div class="accordion-content">
                    <slot></slot>
                </div>
            </details>
        `
    }

    private handleToggle(e: Event) {
        const details = e.currentTarget as HTMLDetailsElement
        this.open = details.open

        this.emit('terra-accordion-toggle', {
            detail: {
                open: this.open,
            },
        })
    }
}
