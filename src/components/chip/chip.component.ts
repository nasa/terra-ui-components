import { property } from 'lit/decorators.js'
import { html } from 'lit'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import EduxElement from '../../internal/edux-element.js'
import styles from './chip.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://disc.gsfc.nasa.gov/components/chip
 * @status experimental
 * @since 1.0
 *
 * @dependency edux-example
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class EduxChip extends EduxElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** An example attribute. */
    @property() attr = 'example'

    @watch('example')
    hide() {
        var chip = document.getElementById('Chip1');
        chip.style.display = "none"
    }

    render() {
        return html` 
        <slot>
            <div id="Chip1" class="chip" >
                <div class="chip-content">Chip Content</div>
                <div class="chip-close" onclick="hide()">
                    <svg class="chip-svg" focusable="false" viewBox="0 0 500 500" aria-hidden="true">
                        <path d="M 227 56.036 H 265 V 227.037 H 436 V 265.036 H 265 V 436.036 H 227 V 265.036 H 56 V 227.037 H 227 Z" style="fill: #909090; paint-order: fill; fill-rule: nonzero; stroke-width: 0px; transform-origin: 246px 246.036px;" transform="matrix(0.707107007504, 0.707107007504, -0.707107007504, 0.707107007504, -9.98393e-7, -0.000026419743)"></path>
                    </svg>
                
                </div>
            </div>
        </slot> `
    }
}
