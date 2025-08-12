import { classMap } from 'lit/directives/class-map.js'
import { HasSlotController } from '../../internal/slot.js'
import { html } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { waitForEvent } from '../../internal/event.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './alert.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Alerts are used to display important messages inline or as toast notifications.
 * @documentation https://shoelace.style/components/alert
 * @status stable
 * @since 2.0
 *
 * @slot - The alert's main content.
 *
 * @event terra-show - Emitted when the alert opens.
 * @event terra-after-show - Emitted after the alert opens and all animations are complete.
 * @event terra-hide - Emitted when the alert closes.
 * @event terra-after-hide - Emitted after the alert closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the optional icon.
 * @csspart message - The container that wraps the alert's main content.
 *
 * @animation alert.show - The animation to use when showing the alert.
 * @animation alert.hide - The animation to use when hiding the alert.
 */
export default class TerraAlert extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    private autoHideTimeout: number
    private remainingTimeInterval: number
    private countdownAnimation?: Animation
    private readonly hasSlotController = new HasSlotController(this, 'icon', 'suffix')
    //private readonly localize = new LocalizeController(this);

    private static currentToastStack: HTMLDivElement

    private static get toastStack() {
        if (!this.currentToastStack) {
            this.currentToastStack = Object.assign(document.createElement('div'), {
                className: 'terra-toast-stack',
            })
        }
        return this.currentToastStack
    }

    @query('[part~="base"]') base: HTMLElement

    @query('.alert__countdown-elapsed') countdownElement: HTMLElement

    /**
     * Indicates whether or not the alert is open. You can toggle this attribute to show and hide the alert, or you can
     * use the `show()` and `hide()` methods and this attribute will reflect the alert's open state.
     */
    @property({ type: Boolean, reflect: true }) open = false

    /** Enables a close button that allows the user to dismiss the alert. */
    @property({ type: Boolean, reflect: true }) closable = false

    /** The alert's theme variant. */
    @property({ reflect: true }) variant:
        | 'primary'
        | 'success'
        | 'neutral'
        | 'warning'
        | 'danger' = 'primary'

    /**
     * The length of time, in milliseconds, the alert will show before closing itself. If the user interacts with
     * the alert before it closes (e.g. moves the mouse over it), the timer will restart. Defaults to `Infinity`, meaning
     * the alert will not close on its own.
     */
    @property({ type: Number }) duration = Infinity

    /**
     * Enables a countdown that indicates the remaining time the alert will be displayed.
     * Typically used to indicate the remaining time before a whole app refresh.
     */
    @property({ type: String, reflect: true }) countdown?: 'rtl' | 'ltr'

    @state() private remainingTime = this.duration

    firstUpdated() {
        this.base.hidden = !this.open
    }

    private restartAutoHide() {
        this.handleCountdownChange()
        clearTimeout(this.autoHideTimeout)
        clearInterval(this.remainingTimeInterval)
        if (this.open && this.duration < Infinity) {
            this.autoHideTimeout = window.setTimeout(() => this.hide(), this.duration)
            this.remainingTime = this.duration
            this.remainingTimeInterval = window.setInterval(() => {
                this.remainingTime -= 100
            }, 100)
        }
    }

    private pauseAutoHide() {
        this.countdownAnimation?.pause()
        clearTimeout(this.autoHideTimeout)
        clearInterval(this.remainingTimeInterval)
    }

    private resumeAutoHide() {
        if (this.duration < Infinity) {
            this.autoHideTimeout = window.setTimeout(
                () => this.hide(),
                this.remainingTime
            )
            this.remainingTimeInterval = window.setInterval(() => {
                this.remainingTime -= 100
            }, 100)
            this.countdownAnimation?.play()
        }
    }

    private handleCountdownChange() {
        if (this.open && this.duration < Infinity && this.countdown) {
            const { countdownElement } = this
            const start = '100%'
            const end = '0'
            this.countdownAnimation = countdownElement.animate(
                [{ width: start }, { width: end }],
                {
                    duration: this.duration,
                    easing: 'linear',
                }
            )
        }
    }

    private handleCloseClick() {
        this.hide()
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        this.base.hidden = !this.open

        if (this.open) {
            // Show
            this.emit('terra-show')

            if (this.duration < Infinity) {
                this.restartAutoHide()
            }

            this.emit('terra-after-show')
        } else {
            // Hide
            this.emit('terra-hide')

            clearTimeout(this.autoHideTimeout)
            clearInterval(this.remainingTimeInterval)

            this.emit('terra-after-hide')
        }
    }

    @watch('duration')
    handleDurationChange() {
        this.restartAutoHide()
    }

    /** Shows the alert. */
    async show() {
        if (this.open) {
            return undefined
        }

        this.open = true
        return waitForEvent(this, 'terra-after-show')
    }

    /** Hides the alert */
    async hide() {
        if (!this.open) {
            return undefined
        }

        this.open = false
        return waitForEvent(this, 'terra-after-hide')
    }

    /**
     * Displays the alert as a toast notification. This will move the alert out of its position in the DOM and, when
     * dismissed, it will be removed from the DOM completely. By storing a reference to the alert, you can reuse it by
     * calling this method again. The returned promise will resolve after the alert is hidden.
     */
    async toast() {
        return new Promise<void>(resolve => {
            this.handleCountdownChange()
            if (TerraAlert.toastStack.parentElement === null) {
                document.body.append(TerraAlert.toastStack)
            }

            TerraAlert.toastStack.appendChild(this)

            // Wait for the toast stack to render
            requestAnimationFrame(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- force a reflow for the initial transition
                this.clientWidth
                this.show()
            })

            this.addEventListener(
                'terra-after-hide',
                () => {
                    TerraAlert.toastStack.removeChild(this)
                    resolve()

                    // Remove the toast stack from the DOM when there are no more alerts
                    if (TerraAlert.toastStack.querySelector('terra-alert') === null) {
                        TerraAlert.toastStack.remove()
                    }
                },
                { once: true }
            )
        })
    }

    render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    alert: true,
                    'alert--open': this.open,
                    'alert--closable': this.closable,
                    'alert--has-countdown': !!this.countdown,
                    'alert--has-icon': this.hasSlotController.test('icon'),
                    'alert--primary': this.variant === 'primary',
                    'alert--success': this.variant === 'success',
                    'alert--neutral': this.variant === 'neutral',
                    'alert--warning': this.variant === 'warning',
                    'alert--danger': this.variant === 'danger',
                })}
                role="alert"
                aria-hidden=${this.open ? 'false' : 'true'}
                @mouseenter=${this.pauseAutoHide}
                @mouseleave=${this.resumeAutoHide}
            >
                <div part="icon" class="alert__icon">
                    <slot name="icon"></slot>
                </div>

                <div part="message" class="alert__message" aria-live="polite">
                    <slot></slot>
                </div>

                ${this.closable
                    ? html`
                          <terra-icon
                              class="alert__close-button"
                              name="solid-x-mark"
                              library="heroicons"
                              @click=${this.handleCloseClick}
                          ></terra-icon>
                      `
                    : ''}

                <div role="timer" class="alert__timer">${this.remainingTime}</div>

                ${this.countdown
                    ? html`
                          <div
                              class=${classMap({
                                  alert__countdown: true,
                                  'alert__countdown--ltr': this.countdown === 'ltr',
                              })}
                          >
                              <div class="alert__countdown-elapsed"></div>
                          </div>
                      `
                    : ''}
            </div>
        `
    }
}
