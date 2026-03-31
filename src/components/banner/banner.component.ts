import { classMap } from 'lit/directives/class-map.js'
import { HasSlotController } from '../../internal/slot.js'
import { html } from 'lit'
import { property, query} from 'lit/decorators.js'
import { waitForEvent } from '../../internal/event.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './banner.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Banners are used to display important messages on top of the header.
 * @documentation https://terra-ui.netlify.app/components/banner
 * @status stable
 * @since 1.0
 *
 * @slot - The banner's main content.
 *
 * @event terra-show - Emitted when the banner opens.
 * @event terra-after-show - Emitted after the banner opens and all animations are complete.
 * @event terra-hide - Emitted when the banner closes.
 * @event terra-after-hide - Emitted after the banner closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the optional icon.
 * @csspart message - The container that wraps the banner's main content.
 *
 * @animation banner.show - The animation to use when showing the banner.
 * @animation banner.hide - The animation to use when hiding the banner.
 */

export default class TerraBanner extends TerraElement {
  static styles: CSSResultGroup = [componentStyles, styles]

  private hasSlotController = new HasSlotController(this, 'icon', 'suffix')

  @query('[part="base"]') base: HTMLElement
 
  /**
     * Indicates whether or not the banner is open. You can toggle this attribute to show and hide the banner, or you can
     * use the `show()` and `hide()` methods and this attribute will reflect the banner's open state.
     */
  @property({ type: Boolean, reflect: true }) open = false

  /** Enables a close button that allows the user to dismiss the banner. */
  @property({ type: Boolean, reflect: true }) closable = false

  /** The banner's theme variant. */
  @property({ reflect: true }) variant: 'primary' | 'danger' = 'primary'

  @property({ type: Boolean, reflect: true }) sticky = true

  firstUpdated() {
        this.base.hidden = !this.open
    }

  private handleClose = () => {
     this.hide()
  }

  @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        this.base.hidden = !this.open

        if (this.open) {
            // Show
            this.emit('terra-show')

            this.emit('terra-after-show')
        } else {
            // Hide
            this.emit('terra-hide')

            this.emit('terra-after-hide')
        }
    }

 /** Shows the banner. */
    async show() {
        if (this.open) {
            return undefined
        }

        this.open = true
        return waitForEvent(this, 'terra-after-show')
    }

    /** Hides the banner */
    async hide() {
        if (!this.open) {
            return undefined
        }

        this.open = false
        return waitForEvent(this, 'terra-after-hide')
    }

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          banner: true,
          'banner--open': this.open,
          'banner--closable': this.closable,
          'banner--sticky': this.sticky,
          'banner--has-icon': this.hasSlotController.test('icon'),
          'banner--primary': this.variant === 'primary',
          'banner--danger': this.variant === 'danger',
        })}
        role="banner"
        aria-hidden=${this.open ? 'false' : 'true'}
      >
        ${this.hasSlotController.test('icon')
          ? html`
              <div part="icon" class="banner__icon">
                <slot name="icon"></slot>
              </div>
            `
          : ''}

        <div part="message" class="banner__message" aria-live="polite">
          <slot></slot>
        </div>

        ${this.closable
          ? html`
              <terra-icon
                class="banner__close"
                name="solid-x-mark"
                library="heroicons"
                @click=${this.handleClose}
              ></terra-icon>
            `
          : ''}
      </div>
    `
  }
}
