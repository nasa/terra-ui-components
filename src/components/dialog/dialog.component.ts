import componentStyles from '../../styles/component.styles.js'
import styles from './dialog.styles.js'
import TerraElement from '../../internal/terra-element.js'
import { html } from 'lit'
import { property } from 'lit/decorators.js'
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

    /** the ID to be used for accessibility associations */
    @property()
    id: string

    /** used to set the dialog's open state */
    @property({ type: Boolean, reflect: true })
    open: boolean = false

    toggle() {
        this.open ? this.hide() : this.show()
    }

    show() {
        this.open = true
        this.emit('terra-dialog-show')
    }

    hide() {
        this.open = false
        this.emit('terra-dialog-hide')
    }

    render() {
        return html`
            <dialog
                part="dialog"
                ?open=${this.open}
                id=${this.id}
                role="dialog"
                aria-modal="true"
            >
                <slot></slot>
            </dialog>
        `
    }
}
