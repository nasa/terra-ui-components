import { animateTo, stopAnimations } from '../../internal/animate.js'
import { blurActiveElement } from '../../internal/close-active-element.js'
import { classMap } from 'lit/directives/class-map.js'
import {
    getAnimation,
    setDefaultAnimation,
} from '../../utilities/animation-registry.js'
import { HasSlotController } from '../../internal/slot.js'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { lockBodyScrolling, unlockBodyScrolling } from '../../internal/scroll.js'
import { property, query } from 'lit/decorators.js'
import { waitForEvent } from '../../internal/event.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import Modal from '../../internal/modal.js'
import TerraElement from '../../internal/terra-element.js'
import TerraButton from '../button/button.component.js'
import TerraIcon from '../icon/icon.component.js'
import styles from './dialog.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Dialogs, sometimes called "modals", appear above the page and require the user's immediate attention.
 * @documentation https://terra-ui.netlify.app/components/dialog
 * @status stable
 * @since 1.0
 *
 * @dependency terra-button
 * @dependency terra-icon
 *
 * @slot - The dialog's main content.
 * @slot label - The dialog's label. Alternatively, you can use the `label` attribute.
 * @slot header-actions - Optional actions to add to the header. Works best with `<terra-button>`.
 * @slot footer - The dialog's footer, usually one or more buttons representing various options.
 *
 * @event terra-dialog-show - Emitted when the dialog opens.
 * @event terra-dialog-after-show - Emitted after the dialog opens and all animations are complete.
 * @event terra-dialog-hide - Emitted when the dialog closes.
 * @event terra-dialog-after-hide - Emitted after the dialog closes and all animations are complete.
 * @event terra-dialog-initial-focus - Emitted when the dialog opens and is ready to receive focus. Calling
 *   `event.preventDefault()` will prevent focusing and allow you to set it on a different element, such as an input.
 * @event {{ source: 'close-button' | 'keyboard' | 'overlay' }} terra-dialog-request-close - Emitted when the user attempts to
 *   close the dialog by clicking the close button, clicking the overlay, or pressing escape. Calling
 *   `event.preventDefault()` will keep the dialog open. Avoid using this unless closing the dialog will result in
 *   destructive behavior such as data loss.
 *
 * @csspart base - The component's base wrapper.
 * @csspart overlay - The overlay that covers the screen behind the dialog.
 * @csspart panel - The dialog's panel (where the dialog and its content are rendered).
 * @csspart header - The dialog's header. This element wraps the title and header actions.
 * @csspart header-actions - Optional actions to add to the header. Works best with `<terra-button>`.
 * @csspart title - The dialog's title.
 * @csspart close-button - The close button, an `<terra-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 * @csspart body - The dialog's body.
 * @csspart footer - The dialog's footer.
 *
 * @cssproperty --width - The preferred width of the dialog. Defaults to `fit-content` to size based on content. Can be set to a fixed value like `31rem` if needed. Note that the dialog will shrink to accommodate smaller screens.
 * @cssproperty --header-spacing - The amount of padding to use for the header.
 * @cssproperty --body-spacing - The amount of padding to use for the body.
 * @cssproperty --footer-spacing - The amount of padding to use for the footer.
 *
 * @animation dialog.show - The animation to use when showing the dialog.
 * @animation dialog.hide - The animation to use when hiding the dialog.
 * @animation dialog.denyClose - The animation to use when a request to close the dialog is denied.
 * @animation dialog.overlay.show - The animation to use when showing the dialog's overlay.
 * @animation dialog.overlay.hide - The animation to use when hiding the dialog's overlay.
 *
 * @property modal - Exposes the internal modal utility that controls focus trapping. To temporarily disable focus
 *   trapping and allow third-party modals spawned from an active Terra modal, call `modal.activateExternal()` when
 *   the third-party modal opens. Upon closing, call `modal.deactivateExternal()` to restore Terra's focus trapping.
 */
export default class TerraDialog extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-button': TerraButton,
        'terra-icon': TerraIcon,
    }

    private readonly hasSlotController = new HasSlotController(this, 'footer')
    private originalTrigger: HTMLElement | null
    public modal = new Modal(this)
    private closeWatcher: CloseWatcher | null

    @query('.dialog') dialog: HTMLElement
    @query('.dialog__panel') panel: HTMLElement
    @query('.dialog__overlay') overlay: HTMLElement

    /**
     * Indicates whether or not the dialog is open. You can toggle this attribute to show and hide the dialog, or you can
     * use the `show()` and `hide()` methods and this attribute will reflect the dialog's open state.
     */
    @property({ type: Boolean, reflect: true }) open = false

    /**
     * The dialog's label as displayed in the header. You should always include a relevant label even when using
     * `no-header`, as it is required for proper accessibility. If you need to display HTML, use the `label` slot instead.
     */
    @property({ reflect: true }) label = ''

    /**
     * Disables the header. This will also remove the default close button, so please ensure you provide an easy,
     * accessible way for users to dismiss the dialog.
     */
    @property({ attribute: 'no-header', type: Boolean, reflect: true }) noHeader =
        false

    firstUpdated() {
        this.dialog.hidden = !this.open

        if (this.open) {
            this.addOpenListeners()
            this.modal.activate()
            lockBodyScrolling(this)
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.modal.deactivate()
        unlockBodyScrolling(this)
        this.removeOpenListeners()
    }

    private requestClose(source: 'close-button' | 'keyboard' | 'overlay') {
        const terraRequestClose = this.emit('terra-dialog-request-close', {
            cancelable: true,
            detail: { source },
        })

        if (terraRequestClose.defaultPrevented) {
            const animation = getAnimation(this, 'dialog.denyClose', {
                dir: getComputedStyle(this).direction,
            })
            animateTo(this.panel, animation.keyframes, animation.options)
            return
        }

        this.hide()
    }

    private addOpenListeners() {
        if ('CloseWatcher' in window) {
            this.closeWatcher?.destroy()
            this.closeWatcher = new CloseWatcher()
            this.closeWatcher.onclose = () => this.requestClose('keyboard')
        } else {
            document.addEventListener('keydown', this.handleDocumentKeyDown)
        }
    }

    private removeOpenListeners() {
        this.closeWatcher?.destroy()
        document.removeEventListener('keydown', this.handleDocumentKeyDown)
    }

    private handleDocumentKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.modal.isActive() && this.open) {
            event.stopPropagation()
            this.requestClose('keyboard')
        }
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open) {
            // Show
            this.emit('terra-dialog-show')
            this.addOpenListeners()
            this.originalTrigger = document.activeElement as HTMLElement
            this.modal.activate()

            lockBodyScrolling(this)

            // When the dialog is shown, Safari will attempt to set focus on whatever element has autofocus. This can cause
            // the dialogs's animation to jitter (if it starts offscreen), so we'll temporarily remove the attribute, call
            // `focus({ preventScroll: true })` ourselves, and add the attribute back afterwards.
            const autoFocusTarget = this.querySelector('[autofocus]')
            if (autoFocusTarget) {
                autoFocusTarget.removeAttribute('autofocus')
            }

            await Promise.all([
                stopAnimations(this.dialog),
                stopAnimations(this.overlay),
            ])
            this.dialog.hidden = false

            // Set initial focus
            requestAnimationFrame(() => {
                const terraInitialFocus = this.emit('terra-dialog-initial-focus', {
                    cancelable: true,
                })

                if (!terraInitialFocus.defaultPrevented) {
                    // Set focus to the autofocus target and restore the attribute
                    if (autoFocusTarget) {
                        ;(autoFocusTarget as HTMLInputElement).focus({
                            preventScroll: true,
                        })
                    } else {
                        this.panel.focus({ preventScroll: true })
                    }
                }

                // Restore the autofocus attribute
                if (autoFocusTarget) {
                    autoFocusTarget.setAttribute('autofocus', '')
                }
            })

            const panelAnimation = getAnimation(this, 'dialog.show', {
                dir: getComputedStyle(this).direction,
            })
            const overlayAnimation = getAnimation(this, 'dialog.overlay.show', {
                dir: getComputedStyle(this).direction,
            })
            await Promise.all([
                animateTo(
                    this.panel,
                    panelAnimation.keyframes,
                    panelAnimation.options
                ),
                animateTo(
                    this.overlay,
                    overlayAnimation.keyframes,
                    overlayAnimation.options
                ),
            ])

            this.emit('terra-dialog-after-show')
        } else {
            // Hide
            blurActiveElement(this)
            this.emit('terra-dialog-hide')
            this.removeOpenListeners()
            this.modal.deactivate()

            await Promise.all([
                stopAnimations(this.dialog),
                stopAnimations(this.overlay),
            ])
            const panelAnimation = getAnimation(this, 'dialog.hide', {
                dir: getComputedStyle(this).direction,
            })
            const overlayAnimation = getAnimation(this, 'dialog.overlay.hide', {
                dir: getComputedStyle(this).direction,
            })

            // Animate the overlay and the panel at the same time. Because animation durations might be different, we need to
            // hide each one individually when the animation finishes, otherwise the first one that finishes will reappear
            // unexpectedly. We'll unhide them after all animations have completed.
            await Promise.all([
                animateTo(
                    this.overlay,
                    overlayAnimation.keyframes,
                    overlayAnimation.options
                ).then(() => {
                    this.overlay.hidden = true
                }),
                animateTo(
                    this.panel,
                    panelAnimation.keyframes,
                    panelAnimation.options
                ).then(() => {
                    this.panel.hidden = true
                }),
            ])

            this.dialog.hidden = true

            // Now that the dialog is hidden, restore the overlay and panel for next time
            this.overlay.hidden = false
            this.panel.hidden = false

            unlockBodyScrolling(this)

            // Restore focus to the original trigger
            const trigger = this.originalTrigger
            if (typeof trigger?.focus === 'function') {
                setTimeout(() => trigger.focus())
            }

            this.emit('terra-dialog-after-hide')
        }
    }

    /** Shows the dialog. */
    async show() {
        if (this.open) {
            return undefined
        }

        this.open = true
        return waitForEvent(this, 'terra-dialog-after-show')
    }

    /** Hides the dialog */
    async hide() {
        if (!this.open) {
            return undefined
        }

        this.open = false
        return waitForEvent(this, 'terra-dialog-after-hide')
    }

    render() {
        return html`
            <div
                part="base"
                class=${classMap({
                    dialog: true,
                    'dialog--open': this.open,
                    'dialog--has-footer': this.hasSlotController.test('footer'),
                })}
            >
                <div
                    part="overlay"
                    class="dialog__overlay"
                    @click=${() => this.requestClose('overlay')}
                    tabindex="-1"
                ></div>

                <div
                    part="panel"
                    class="dialog__panel"
                    role="dialog"
                    aria-modal="true"
                    aria-hidden=${this.open ? 'false' : 'true'}
                    aria-label=${ifDefined(this.noHeader ? this.label : undefined)}
                    aria-labelledby=${ifDefined(!this.noHeader ? 'title' : undefined)}
                    tabindex="-1"
                >
                    ${!this.noHeader
                        ? html`
                              <header part="header" class="dialog__header">
                                  <h2 part="title" class="dialog__title" id="title">
                                      <slot name="label">
                                          ${this.label.length > 0
                                              ? this.label
                                              : String.fromCharCode(65279)}
                                      </slot>
                                  </h2>
                                  <div
                                      part="header-actions"
                                      class="dialog__header-actions"
                                  >
                                      <slot name="header-actions"></slot>
                                      <terra-button
                                          part="close-button"
                                          exportparts="base:close-button__base"
                                          class="dialog__close"
                                          circle
                                          variant="text"
                                          @click="${() =>
                                              this.requestClose('close-button')}"
                                          aria-label="Close"
                                      >
                                          <terra-icon
                                              name="x-lg"
                                              library="system"
                                          ></terra-icon>
                                      </terra-button>
                                  </div>
                              </header>
                          `
                        : ''}
                    <div part="body" class="dialog__body" tabindex="-1">
                        <slot></slot>
                    </div>

                    <footer part="footer" class="dialog__footer">
                        <slot name="footer"></slot>
                    </footer>
                </div>
            </div>
        `
    }
}

setDefaultAnimation('dialog.show', {
    keyframes: [
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1 },
    ],
    options: { duration: 250, easing: 'ease' },
})

setDefaultAnimation('dialog.hide', {
    keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.8 },
    ],
    options: { duration: 250, easing: 'ease' },
})

setDefaultAnimation('dialog.denyClose', {
    keyframes: [{ scale: 1 }, { scale: 1.02 }, { scale: 1 }],
    options: { duration: 250 },
})

setDefaultAnimation('dialog.overlay.show', {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: 250 },
})

setDefaultAnimation('dialog.overlay.hide', {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    options: { duration: 250 },
})
