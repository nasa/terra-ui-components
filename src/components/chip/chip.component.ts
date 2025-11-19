import { property } from 'lit/decorators.js'
import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './chip.styles.js'
import type { CSSResultGroup } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

/**
 * @summary Used for contacts and tags
 * @documentation https://terra-ui.netlify.app/components/chip
 * @status stable
 * @since 1.0
 *
 * @slot - The chip's label.
 *
 * @cssproperty --terra-chip-background-color - The background color of the chip.
 * @cssproperty --terra-chip-color - The text color of the chip.
 */
export default class TerraChip extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** The size of the chip. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium'

    /** When true, the chip will have a close button that can be used to remove the chip. */
    @property({ type: Boolean, reflect: true }) closeable = false

    /** When true, chips will stack vertically instead of sitting side by side. */
    @property({ type: Boolean, reflect: true }) stack = false

    #handleRemoveClick = () => {
        this.emit('terra-remove')
        this.remove()
    }

    render() {
        return html`
            <div
                class="${classMap({
                    'chip--small': this.size === 'small',
                    'chip--medium': this.size === 'medium',
                    'chip--large': this.size === 'large',
                })}
                chip"
            >
                <div
                    class="${classMap({
                        'chip-content--small': this.size === 'small',
                        'chip-content--medium': this.size === 'medium',
                        'chip-content--large': this.size === 'large',
                    })}
                    chip-content"
                >
                    <slot part="content" class="tag__content"></slot>
                </div>
                ${this.closeable
                    ? html`
                          <button
                              class="chip-close"
                              @click="${this.#handleRemoveClick}"
                          >
                              <svg
                                  class="${classMap({
                                      // Sizes
                                      'chip-svg--small': this.size === 'small',
                                      'chip-svg--medium': this.size === 'medium',
                                      'chip-svg--large': this.size === 'large',
                                  })}
                        chip-svg"
                                  focusable="false"
                                  viewBox="0 0 500 500"
                                  aria-hidden="true"
                              >
                                  <path
                                      d="M 227 56.036 H 265 V 227.037 H 436 V 265.036 H 265 V 436.036 H 227 V 265.036 H 56 V 227.037 H 227 Z"
                                      style="paint-order: fill; fill-rule: nonzero; stroke-width: 0px; transform-origin: 246px 246.036px;"
                                      transform="matrix(0.707107007504, 0.707107007504, -0.707107007504, 0.707107007504, -9.98393e-7, -0.000026419743)"
                                  ></path>
                              </svg>
                          </button>
                      `
                    : nothing}
            </div>
        `
    }
}
