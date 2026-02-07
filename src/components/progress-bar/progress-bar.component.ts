import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './progress-bar.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Progress bars are used to show the status of an ongoing operation.
 * @documentation https://terra-ui.netlify.app/components/progress-bar
 * @status stable
 * @since 1.0
 *
 * @slot - A label to show inside the progress indicator.
 *
 * @csspart base - The component's base wrapper.
 * @csspart indicator - The progress bar's indicator.
 * @csspart label - The progress bar's label.
 *
 * @cssproperty --height - The progress bar's height.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the indicator.
 * @cssproperty --label-color - The color of the label.
 */
export default class TerraProgressBar extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** The current progress as a percentage, 0 to 100. */
    @property({ type: Number, reflect: true }) value = 0

    /** When true, percentage is ignored, the label is hidden, and the progress bar is drawn in an indeterminate state. */
    @property({ type: Boolean, reflect: true }) indeterminate = false

    /** A custom label for assistive devices. */
    @property() label = ''

    /** The progress bar's theme variant. */
    @property({ reflect: true }) variant:
        | 'default'
        | 'primary'
        | 'success'
        | 'warning'
        | 'danger' = 'primary'

    @property() title = '' // make reactive to pass through

    render() {
        const isRtl = getComputedStyle(this).direction === 'rtl'

        return html`
            <div
                part="base"
                class=${classMap({
                    'progress-bar': true,
                    'progress-bar--indeterminate': this.indeterminate,
                    'progress-bar--rtl': isRtl,
                    'progress-bar--default': this.variant === 'default',
                    'progress-bar--primary': this.variant === 'primary',
                    'progress-bar--success': this.variant === 'success',
                    'progress-bar--warning': this.variant === 'warning',
                    'progress-bar--danger': this.variant === 'danger',
                })}
                role="progressbar"
                title=${ifDefined(this.title || undefined)}
                aria-label=${this.label || 'Progress'}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=${ifDefined(
                    this.indeterminate ? undefined : this.value
                )}
            >
                <div
                    part="indicator"
                    class="progress-bar__indicator"
                    style=${styleMap({
                        width: this.indeterminate ? undefined : `${this.value}%`,
                    })}
                >
                    ${!this.indeterminate
                        ? html`
                              <slot part="label" class="progress-bar__label"></slot>
                          `
                        : ''}
                </div>
            </div>
        `
    }
}
