import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { property } from 'lit/decorators.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './tab-panel.styles.js'
import type { CSSResultGroup } from 'lit'

let id = 0

/**
 * @summary Tab panels are used inside [tabs](/components/tabs) to display tabbed content.
 * @documentation https://terra-ui.netlify.app/components/tab-panel
 * @status stable
 * @since 1.0
 *
 * @slot - The tab panel's content.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --padding - The tab panel's padding.
 */
export default class TerraTabPanel extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    private readonly attrId = ++id
    private readonly componentId = `terra-tab-panel-${this.attrId}`

    /** The tab panel's name. */
    @property({ reflect: true }) name = ''

    /** When true, the tab panel will be shown. */
    @property({ type: Boolean, reflect: true }) active = false

    connectedCallback() {
        super.connectedCallback()
        this.id = this.id.length > 0 ? this.id : this.componentId
        this.setAttribute('role', 'tabpanel')
    }

    @watch('active')
    handleActiveChange() {
        this.setAttribute('aria-hidden', this.active ? 'false' : 'true')
    }

    render() {
        return html`
            <slot
                part="base"
                class=${classMap({
                    'tab-panel': true,
                    'tab-panel--active': this.active,
                })}
            ></slot>
        `
    }
}
