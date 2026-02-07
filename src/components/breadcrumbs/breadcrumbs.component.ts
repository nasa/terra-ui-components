import { property } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './breadcrumbs.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary A collection of breadcrumb items that shows the current page's location in the site hierarchy.
 * @documentation https://terra-ui.netlify.app/components/breadcrumbs
 * @status stable
 * @since 1.0
 *
 * @slot - The breadcrumb items. Typically `<terra-breadcrumb>` elements.
 *
 * @csspart base - The component's base wrapper.
 * @csspart nav - The navigation container.
 *
 * @cssproperty --terra-breadcrumbs-gap - The space between breadcrumbs.
 */
export default class TerraBreadcrumbs extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** Accessible label for the breadcrumb navigation. */
    @property({ attribute: 'aria-label' }) ariaLabel = 'Breadcrumb'

    /** Color theme of the breadcrumbs, matching the Horizon Design System. */
    @property({ reflect: true }) theme: 'light' | 'dark' = 'light'

    render() {
        return html`
            <nav part="base nav" class="breadcrumbs" aria-label=${this.ariaLabel}>
                <slot></slot>
            </nav>
        `
    }
}
