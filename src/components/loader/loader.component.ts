import { property, state } from 'lit/decorators.js'
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

    /** The loader's variant */
    @property({ reflect: true }) variant: 'small' | 'large' | 'orbit' = 'large'

    /** The percent complete for the loader to display */
    @property({ type: String })
    percent: string = '0'

    /** an indeterminate loader has an unknown progress and will show a spinner */
    @property({ type: Boolean })
    indeterminate: boolean = false

    @state() _currentPercent = 0

    formatPercent(percent: string) {
        if (parseInt(percent) > 100) {
            percent = '100'
        }
        return parseInt(percent) > 0 ? percent + '%' : ''
    }

    render() {
        /* TODO: The svg viewbox attribute ideally should be a fixed size for both the large and small loaders.
         * Since the coordinates and dimension of the svg are dynamically set in the CSS this may be why
         * the scale of the rendered graphic does not match the calculated svg size when the viewport does not match.
         */

        this._currentPercent = parseInt(this.percent)

        return html`
            <div
                class=${classMap({
                    loader: true,
                    'loader--small': this.variant === 'small',
                    'loader--large': this.variant === 'large',
                    'loader--orbit': this.variant === 'orbit',
                })}
                aria-valuenow=${this.formatPercent(this.percent)}
                role="progressbar"
                tabindex="-1"
            >
                ${this.variant === 'large' || this.variant === 'orbit'
                    ? html`
                          <div
                              class="percent ${this.variant == 'orbit'
                                  ? 'number-14'
                                  : 'number-11'}"
                          >
                              ${this.formatPercent(this.percent)}
                          </div>
                      `
                    : nothing}
                ${this.variant === 'orbit'
                    ? html`
                          <svg viewBox="0 0 160 160">
                              <circle class="planet" />

                              <!-- total length of orbit ellipse = 298.2393493652344 -->
                              <path
                                  id="orbit"
                                  d="M 53.528 96.775 C 73.584 124.975 100.654 140.601 115.393 130.137 C 132.613 117.912 119.246 79.55 105.434 60.525 C 90.233 39.587 60.506 18.543 44.962 30.114 C 29.456 41.657 38.219 75.25 53.528 96.775 Z"
                              >
                                  <animate
                                      attributeName="stroke-dashoffset"
                                      begin="-0.25s"
                                      from="300"
                                      to="0"
                                      dur="1.5s"
                                      repeatCount="indefinite"
                                  />
                              </path>

                              <circle class="moon">
                                  <animateMotion
                                      begin="0s"
                                      dur="1.5s"
                                      repeatCount="indefinite"
                                  >
                                      <mpath href="#orbit"></mpath>
                                  </animateMotion>
                              </circle>

                              <path
                                  id="mask"
                                  class="planet"
                                  d="M 130.176 80.041 C 130.176 41.552 88.321 17.697 55.544 36.652 C 40.081 45.594 30.865 62.428 30.47 80.094 L 130.176 80.041 Z"
                                  style="transform-box: fill-box; transform-origin: 49.8347% 100.62%;"
                                  transform="matrix(-0.350367, -0.936613, 0.936613, -0.350367, -0.148117, -0.20884)"
                              />
                          </svg>
                      `
                    : nothing}
                ${this.variant === 'small' || this.variant === 'large'
                    ? html`
                          <svg
                              viewBox=${this.variant == 'small'
                                  ? '0 0 30 30'
                                  : '0 0 52 52'}
                              aria-hidden="true"
                              style="--progress: ${this.percent}"
                              class="circular-progress ${this.indeterminate
                                  ? 'indeterminate'
                                  : ''}"
                          >
                              <circle class="bg"></circle>
                              <circle class="fg"></circle>
                          </svg>
                      `
                    : nothing}
            </div>
        `
    }
}
