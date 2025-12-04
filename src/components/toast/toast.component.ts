import { html } from 'lit'
import { property } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import TerraAlert from '../alert/alert.component.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './toast.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Toasts are used to display brief, non-intrusive notifications that appear temporarily.
 * @documentation https://terra-ui.netlify.app/components/toast
 * @status stable
 * @since 1.0
 *
 * @dependency terra-alert
 *
 * @slot - The toast's main content.
 * @slot icon - An icon to show in the toast. Works best with `<terra-icon>`.
 *
 * @event terra-show - Emitted when the toast opens.
 * @event terra-after-show - Emitted after the toast opens and all animations are complete.
 * @event terra-hide - Emitted when the toast closes.
 * @event terra-after-hide - Emitted after the toast closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper, an `<terra-alert>` element.
 * @csspart base__base - The alert's exported `base` part.
 * @csspart base__icon - The alert's exported `icon` part.
 * @csspart base__message - The alert's exported `message` part.
 *
 * @animation toast.show - The animation to use when showing the toast.
 * @animation toast.hide - The animation to use when hiding the toast.
 */
export default class TerraToast extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = { 'terra-alert': TerraAlert }

    get alert(): TerraAlert | null {
        // Query the alert from the shadow root (Lit still creates a shadow root even with display: contents)
        if (!this.shadowRoot) {
            return null
        }
        return this.shadowRoot.querySelector('terra-alert') as TerraAlert | null
    }

    /** The toast's theme variant. */
    @property({ reflect: true }) variant:
        | 'primary'
        | 'success'
        | 'neutral'
        | 'warning'
        | 'danger' = 'primary'

    /**
     * The length of time, in milliseconds, the toast will show before closing itself. If the user interacts with
     * the toast before it closes (e.g. moves the mouse over it), the timer will restart. Defaults to `3000` (3 seconds).
     */
    @property({ type: Number }) duration = 3000

    /** Enables a close button that allows the user to dismiss the toast. */
    @property({ type: Boolean, reflect: true }) closable = true

    /**
     * Enables a countdown that indicates the remaining time the toast will be displayed.
     * Typically used for toasts with relatively long duration.
     */
    @property({ type: String, reflect: true }) countdown?: 'rtl' | 'ltr'

    firstUpdated() {
        // Forward events from the alert to the toast
        const alert = this.alert
        if (alert) {
            alert.addEventListener('terra-show', () => this.emit('terra-show'))
            alert.addEventListener('terra-after-show', () =>
                this.emit('terra-after-show')
            )
            alert.addEventListener('terra-hide', () => this.emit('terra-hide'))
            alert.addEventListener('terra-after-hide', () =>
                this.emit('terra-after-hide')
            )
        }
    }

    /**
     * Displays the toast as a notification. This will move the toast out of its position in the DOM and, when
     * dismissed, it will be removed from the DOM completely. By storing a reference to the toast, you can reuse it by
     * calling this method again. The returned promise will resolve after the toast is hidden.
     */
    async toast() {
        return new Promise<void>(async resolve => {
            // Ensure the toast and alert are fully initialized
            await this.updateComplete

            // Wait for shadow root and alert to be ready
            if (!this.shadowRoot) {
                await this.updateComplete
            }

            let alert = this.alert
            if (!alert) {
                // Wait for terra-alert to be defined and try again
                await customElements.whenDefined('terra-alert')
                await this.updateComplete
                alert = this.alert
            }

            if (!alert) {
                // Silently fail if alert is not found
                resolve()
                return
            }

            await alert.updateComplete

            // Use the alert's toast stack (shared between alerts and toasts)
            const toastStack = (TerraAlert as any).toastStack as HTMLDivElement

            if (toastStack.parentElement === null) {
                document.body.append(toastStack)
            }

            // Move the toast to the toast stack
            toastStack.appendChild(this)

            // Wait for the toast stack to render and show the alert
            requestAnimationFrame(async () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- force a reflow for the initial transition
                this.clientWidth
                await this.updateComplete
                await alert.updateComplete

                // Show the alert (this sets open=true and makes it visible)
                if (!alert.open) {
                    await alert.show()
                }
            })

            // Listen for when the toast is hidden to clean up
            this.addEventListener(
                'terra-after-hide',
                () => {
                    if (toastStack.contains(this)) {
                        toastStack.removeChild(this)
                    }
                    resolve()

                    // Remove the toast stack from the DOM when there are no more toasts or alerts
                    if (
                        toastStack.querySelector('terra-toast') === null &&
                        toastStack.querySelector('terra-alert') === null
                    ) {
                        toastStack.remove()
                    }
                },
                { once: true }
            )
        })
    }

    /** Shows the toast. */
    async show() {
        await this.updateComplete
        const alert = this.alert
        if (!alert) {
            throw new Error('TerraToast: Alert element not found')
        }
        await alert.updateComplete
        return alert.show()
    }

    /** Hides the toast. */
    async hide() {
        await this.updateComplete
        const alert = this.alert
        if (!alert) {
            throw new Error('TerraToast: Alert element not found')
        }
        await alert.updateComplete
        return alert.hide()
    }

    /**
     * Creates a toast notification imperatively. This is a convenience method that creates a toast, appends it to the
     * body, and displays it as a notification.
     *
     * @param message - The message to display in the toast.
     * @param variant - The toast variant. Defaults to 'primary'.
     * @param icon - Optional icon name to display. Defaults to undefined.
     * @param duration - The duration in milliseconds. Defaults to 3000.
     * @returns A promise that resolves after the toast is hidden.
     */
    static async notify(
        message: string,
        variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' = 'primary',
        icon?: string,
        duration = 3000
    ): Promise<void> {
        // Escape HTML for text arguments
        const escapeHtml = (html: string) => {
            const div = document.createElement('div')
            div.textContent = html
            return div.innerHTML
        }

        const toast = Object.assign(document.createElement('terra-toast'), {
            variant,
            duration,
            closable: true,
            innerHTML: icon
                ? `
                    <terra-icon name="${icon}" slot="icon" library="heroicons"></terra-icon>
                    ${escapeHtml(message)}
                `
                : escapeHtml(message),
        })

        document.body.append(toast)
        // Wait for the toast to be defined and initialized
        await customElements.whenDefined('terra-toast')
        await toast.updateComplete
        return toast.toast()
    }

    render() {
        return html`
            <terra-alert
                part="base"
                exportparts="base:base__base, icon:base__icon, message:base__message"
                variant=${this.variant}
                duration=${this.duration}
                closable=${this.closable}
                countdown=${this.countdown || ''}
                appearance="filled"
            >
                <slot name="icon" slot="icon"></slot>
                <slot></slot>
            </terra-alert>
        `
    }
}
