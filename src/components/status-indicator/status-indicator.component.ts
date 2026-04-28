import { property } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './status-indicator.styles.js'
import type { CSSResultGroup } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

/**
 * @summary Status indicators are dynamic labels that indicate the current state of a mission or project.
 * @documentation https://terra-ui.netlify.app/components/status-indicator
 * @status stable
 * @since 1.0
 *
 * @slot - The status label text.
 *
 * @csspart base - The component's base wrapper.
 * @csspart dot - The colored status dot.
 * @csspart label - The text label.
 *
 * @cssproperty --terra-status-indicator-dot-color - The color of the status dot.
 * @cssproperty --terra-status-indicator-label-color - The color of the label text.
 * @cssproperty --terra-status-indicator-font-family - The font family for the label.
 * @cssproperty --terra-status-indicator-font-size - The font size for the label.
 * @cssproperty --terra-status-indicator-font-weight - The font weight for the label.
 */
export default class TerraStatusIndicator extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** The status variant. Determines the color of the indicator dot. */
    @property({ reflect: true }) variant:
        | 'active'
        | 'completed'
        | 'testing'
        | 'future' = 'active'

    /** When true, forces dark mode styles regardless of system preference. Useful when placing the component on a dark background. */
    @property({ type: Boolean, reflect: true }) dark = false

    render() {
        return html`
            <div
                part="base"
                class="${classMap({
                    'status-indicator': true,
                    'status-indicator--active': this.variant === 'active',
                    'status-indicator--completed': this.variant === 'completed',
                    'status-indicator--testing': this.variant === 'testing',
                    'status-indicator--future': this.variant === 'future',
                })}"
            >
                <span part="dot" class="status-indicator__dot"></span>
                <span part="label" class="status-indicator__label">
                    <slot></slot>
                </span>
            </div>
        `
    }
}
