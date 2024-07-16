import { property, query, state } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import EduxElement from '../../internal/edux-element.js'
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
export default class EduxLoader extends EduxElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    @query('#progress') progressEl: HTMLElement
    @query('#fg') foregroundEl: HTMLElement

    /** The loader's size */
    @property({ reflect: true }) size:
        | 'small'
        | 'large' = 'large'

    /** The percent complete for the loader to display */
    @property({type: String}) 
    percent: string = '0'

    @state() _currentPercent = 0

    formatPercent (percent: string) {
        if(parseInt(percent) > 100) {
            percent = '100'
        }
        return percent > '0' ? percent + '%' : ''
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
                    'loader--small': this.size === 'small',
                    'loader--large': this.size === 'large',
                })}
            >
                ${this.size === 'large'? 
                    html `
                        <div class="percent number-11">
                            ${this.formatPercent(this.percent)}
                        </div>
                    `
                    : ``
                }

                <svg 
                    viewBox=${this.size == 'small' ? '0 0 30 30' : '0 0 52 52'} 
                    style="--progress: ${this.percent}" class="circular-progress">
                    <circle class="bg"></circle>
                    <circle class="fg"></circle>
                </svg>
        </div>
    `
    }
}
