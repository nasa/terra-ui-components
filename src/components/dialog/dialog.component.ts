import componentStyles from '../../styles/component.styles.js'
import styles from './dialog.styles.js'
import TerraElement from '../../internal/terra-element.js'
import { html } from 'lit'
import { property, query } from 'lit/decorators.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Used to create both modal and non-modal dialog boxes.
 * @documentation https://disc.gsfc.nasa.gov/components/dialog
 * @status stable
 * @since 1.0
 *
 * @slot - The dialog's main content
 *
 * @event terra-dialog-show - Emitted when the dialog opens.
 * @event terra-dialog-hide - Emitted when the dialog closes.
 */
export default class TerraDialog extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @query('[part="dialog"]')
    dialogEl: HTMLDialogElement

    /** the ID to be used for accessibility associations */
    @property()
    id: string

    /** the width of the dialog */
    @property({ reflect: true })
    width: string = 'fit-content'

    /** allow closing the dialog when clicking outside of it */
    @property({ attribute: 'click-outside-to-close', type: Boolean, reflect: true })
    clickOutsideToClose: boolean = true

    /** Show a backdrop behind the dialog */
    @property({ attribute: 'show-backdrop', type: Boolean, reflect: true })
    showBackdrop: boolean = true

    toggle() {
        this.dialogEl.open ? this.hide('toggle') : this.show()
    }

    show() {
        this.dialogEl.showModal()
        this.emit('terra-dialog-show')
    }

    hide(reason?: string) {
        this.dialogEl.close(reason)
        this.emit('terra-dialog-hide')
    }

    #handleBackdropClick(event: Event) {
        if (this.clickOutsideToClose) {
            const target = event.target as HTMLElement

            if (target.nodeName === 'DIALOG') {
                this.hide('backdrop')
            }
        }
    }

    render() {
        return html`
            <dialog
                @click=${this.#handleBackdropClick}
                aria-modal="true"
                id=${this.id}
                part="dialog"
                role="dialog"
                style="width: ${this.width}"
            >
                <div class="dialog-content">
                    <slot></slot>
                </div>
            </dialog>
        `
    }
}
