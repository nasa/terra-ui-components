import { property } from 'lit/decorators.js'
import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './loader.styles.js'
import type { CSSResultGroup } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

/**
 * @summary Loaders are used to indicate there is content that is loading.
 * @documentation https://disc.gsfc.nasa.gov/components/loader
 * @status experimental
 * @since 1.0
 *
 *
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class TerraLoader extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** The loader's size */
    @property({ reflect: true }) size: 'small' | 'large' = 'large'

    /** The loader's theme, light or dark mode */
    @property({ reflect: true }) theme: 'light' | 'dark'

    /** The percent complete for the loader to display */
    @property({ type: Number })
    percent: number = 0

    /** an indeterminate loader has an unknown progress and will show a spinner */
    @property({ type: Boolean })
    indeterminate: boolean = false

    /** A label used by a screen reader which describes the loader element (e.g., "Loading video of Tropical Storm Nepartak") */
    @property({ type: String })
    label: string = 'Loading request'

    /** A message used by a screen reader to describe current value of loader element in a more human-understandable way (e.g, "12% of 45MB") */
    @property({ type: String })
    message: string = ''

    formatPercent(percent: number) {
        if (percent > 100) {
            percent = 100
        }
        return percent > 0 ? percent + '%' : ''
    }

    render() {
        /* TODO: The svg viewbox attribute ideally should be a fixed size for both the large and small loaders.
         * Since the coordinates and dimension of the svg are dynamically set in the CSS this may be why
         * the scale of the rendered graphic does not match the calculated svg size when the viewport does not match.
         */
        return html`
            <div
                class=${classMap({
                    loader: true,
                    'loader--small': this.size === 'small',
                    'loader--large': this.size === 'large',
                    'loader--light': this.theme === 'light',
                    'loader--dark': this.theme === 'dark',
                })}
                arial-lable=${this.label}
                aria-valuetext="${this.message || nothing}"
                ${this.message != '' ? 'aria-valuetext=${this.message}' : ''}
                aria-valuenow=${this.formatPercent(this.percent)}
                role="progressbar"
                tabindex="-1"
            >
                ${this.size === 'large'
                    ? html`
                          <div class="percent">
                              ${this.formatPercent(this.percent)}
                          </div>
                      `
                    : ``}

                <svg
                    viewBox=${this.size == 'small' ? '0 0 30 30' : '0 0 52 52'}
                    aria-hidden="true"
                    style="--progress: ${this.percent}"
                    class="circular-progress ${this.indeterminate
                        ? 'indeterminate'
                        : ''}"
                >
                    <circle class="bg"></circle>
                    <circle class="fg"></circle>
                </svg>
            </div>
        `
    }
}
