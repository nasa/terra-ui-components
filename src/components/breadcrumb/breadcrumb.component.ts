import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { property } from 'lit/decorators.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './breadcrumb.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary A single breadcrumb item used inside `terra-breadcrumbs`.
 * @documentation https://terra-ui.netlify.app/components/breadcrumb
 * @status stable
 * @since 1.0
 *
 * @slot - The default slot.
 *
 * @csspart base - The component's base wrapper.
 * @csspart link - The breadcrumb link element.
 * @csspart label - The breadcrumb label element when not a link.
 *
 * @cssproperty --terra-breadcrumb-color - The text color of inactive breadcrumbs.
 * @cssproperty --terra-breadcrumb-color-current - The text color of the current (last) breadcrumb.
 * @cssproperty --terra-breadcrumb-color-visited - The text color of visited breadcrumb links.
 */
export default class TerraBreadcrumb extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** The URL the breadcrumb points to. When omitted, the breadcrumb is rendered as plain text. */
    @property() href?: string

    /**
     * Indicates that this breadcrumb represents the current page.
     * When set, `aria-current="page"` will be applied to the underlying element.
     */
    @property({ type: Boolean, reflect: true }) current = false

    render() {
        const isLink = !!this.href

        return html`
            <span
                part="base"
                class=${classMap({
                    breadcrumb: true,
                    'breadcrumb--current': this.current,
                    'breadcrumb--link': isLink,
                })}
            >
                ${isLink
                    ? html`
                          <a
                              part="link"
                              class="breadcrumb__link"
                              href=${this.href!}
                              aria-current=${this.current ? 'page' : undefined}
                          >
                              <slot></slot>
                          </a>
                      `
                    : html`
                          <span
                              part="label"
                              class="breadcrumb__label"
                              aria-current=${this.current ? 'page' : undefined}
                          >
                              <slot></slot>
                          </span>
                      `}
            </span>
        `
    }
}
