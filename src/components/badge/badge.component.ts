import { classMap } from 'lit/directives/class-map.js'
import { html, nothing } from 'lit'
import { property } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './badge.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Badges are used to draw attention and display statuses or counts.
 * @documentation https://terra-ui.netlify.app/components/badge
 * @status stable
 * @since 1.0
 *
 * @slot - The badge's content.
 *
 * @csspart base - The component's base wrapper.
 */
export default class TerraBadge extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** The badge's theme variant. */
    @property({ reflect: true }) variant:
        | 'primary'
        | 'information'
        | 'success'
        | 'neutral'
        | 'warning'
        | 'danger' = 'information'

    /** The badge's size. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium'

    /** Draws a pill-style badge with rounded edges. */
    @property({ type: Boolean, reflect: true }) pill = false

    /** Makes the badge pulsate to draw attention. */
    @property({ type: Boolean, reflect: true }) pulse = false

    /** The ARIA role for the badge. Defaults to 'status'. */
    @property({ reflect: true }) role: string | null = 'status'

    render() {
        return html`
            <span
                part="base"
                class=${classMap({
                    badge: true,
                    'badge--primary': this.variant === 'primary',
                    'badge--information': this.variant === 'information',
                    'badge--success': this.variant === 'success',
                    'badge--neutral': this.variant === 'neutral',
                    'badge--warning': this.variant === 'warning',
                    'badge--danger': this.variant === 'danger',
                    'badge--small': this.size === 'small',
                    'badge--medium': this.size === 'medium',
                    'badge--large': this.size === 'large',
                    'badge--pill': this.pill,
                    'badge--pulse': this.pulse,
                })}
                role=${this.role ?? nothing}
            >
                <slot></slot>
            </span>
        `
    }
}
