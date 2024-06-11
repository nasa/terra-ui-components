import { property } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import EduxElement from '../../internal/edux-element.js'
import styles from './chip.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Used for contacts and tags
 * @documentation https://disc.gsfc.nasa.gov/components/chip
 * @status stable
 * @since 1.0
 */
export default class EduxChip extends EduxElement {
    static styles: CSSResultGroup = [componentStyles, styles]


    //@property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium'

    #handleRemoveClick = () => {
        this.emit('edux-remove');
        this.remove();
    }
    render() {
        return html` 
            <div id="chip" class="chip" >
                <div class="chip-content">
                    <slot part="content" class="tag__content"></slot>
                </div>
                <div class="chip-close" @click="${this.#handleRemoveClick}">
                    <svg class="chip-svg" focusable="false" viewBox="0 0 500 500" aria-hidden="true">
                        <path d="M 227 56.036 H 265 V 227.037 H 436 V 265.036 H 265 V 436.036 H 227 V 265.036 H 56 V 227.037 H 227 Z" style="fill: #909090; paint-order: fill; fill-rule: nonzero; stroke-width: 0px; transform-origin: 246px 246.036px;" transform="matrix(0.707107007504, 0.707107007504, -0.707107007504, 0.707107007504, -9.98393e-7, -0.000026419743)"></path>
                    </svg>
                
                </div>
            </div>
        `
    }
}
