import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { property, query } from 'lit/decorators.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import styles from './tab.styles.js'
import type { CSSResultGroup } from 'lit'

let id = 0

/**
 * @summary Tabs are used inside [tabs](/components/tabs) to represent and activate [tab panels](/components/tab-panel).
 * @documentation https://terra-ui.netlify.app/components/tab
 * @status stable
 * @since 1.0
 *
 * @dependency terra-icon
 *
 * @slot - The tab's label. For icon-only tabs, place a `<terra-icon>` here.
 *
 * @event terra-close - Emitted when the tab is closable and the close button is activated.
 *
 * @csspart base - The component's base wrapper.
 * @csspart close-button - The close button icon.
 *
 * @cssproperty --terra-tab-* - All tab design tokens from horizon.css are supported.
 */
export default class TerraTab extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = { 'terra-icon': TerraIcon }

    private readonly attrId = ++id
    private readonly componentId = `terra-tab-${this.attrId}`

    @query('.tab') tab: HTMLElement

    /** The name of the tab panel this tab is associated with. The panel must be located in the same tabs component. */
    @property({ reflect: true }) panel = ''

    /** Draws the tab in an active state. */
    @property({ type: Boolean, reflect: true }) active = false

    /** Makes the tab closable and shows a close button. */
    @property({ type: Boolean, reflect: true }) closable = false

    /** Disables the tab and prevents selection. */
    @property({ type: Boolean, reflect: true }) disabled = false

    /** The tab's size. Inherits from the parent tabs component if not specified. */
    @property({ reflect: true }) size: 'large' | 'small' = 'large'

    /**
     * @internal
     * Need to wrap in a `@property()` otherwise CustomElement throws a "The result must not have attributes" runtime error.
     */
    @property({ type: Number, reflect: true }) tabIndex = 0

    connectedCallback() {
        super.connectedCallback()
        this.setAttribute('role', 'tab')
    }

    private handleCloseClick(event: Event) {
        event.stopPropagation()
        this.emit('terra-close')
    }

    @watch('active')
    handleActiveChange() {
        this.setAttribute('aria-selected', this.active ? 'true' : 'false')
    }

    @watch('disabled')
    handleDisabledChange() {
        this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false')

        if (this.disabled && !this.active) {
            this.tabIndex = -1
        } else {
            this.tabIndex = 0
        }
    }

    render() {
        // If the user didn't provide an ID, we'll set one so we can link tabs and tab panels with aria labels
        this.id = this.id.length > 0 ? this.id : this.componentId

        return html`
            <div
                part="base"
                class=${classMap({
                    tab: true,
                    'tab--active': this.active,
                    'tab--closable': this.closable,
                    'tab--disabled': this.disabled,
                    'tab--large': this.size === 'large',
                    'tab--small': this.size === 'small',
                })}
            >
                <slot></slot>
                ${this.closable
                    ? html`
                          <button
                              part="close-button"
                              class="tab__close-button"
                              @click=${this.handleCloseClick}
                              tabindex="-1"
                              aria-label="Close tab"
                              type="button"
                          >
                              <terra-icon
                                  name="x-mark"
                                  library="heroicons"
                                  font-size="1rem"
                              ></terra-icon>
                          </button>
                      `
                    : ''}
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'terra-tab': TerraTab
    }
}
