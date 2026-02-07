import { property } from 'lit/decorators.js'
import { html } from 'lit'
import { HasSlotController } from '../../internal/slot.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import styles from './site-header.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Site headers provide a consistent navigation structure at the top of pages.
 * @documentation https://terra-ui.netlify.app/components/site-header
 * @status stable
 * @since 1.0
 *
 * @dependency terra-icon
 *
 * @slot title - The site title displayed next to the logo. Defaults to the `site-name` prop value.
 * @slot center - Content displayed in the center of the header (e.g., navigation).
 * @slot right - Content displayed on the right side of the header. Defaults to a search icon button.
 *
 * @csspart base - The component's base wrapper.
 * @csspart logo - The NASA logo container.
 * @csspart title - The site title container.
 * @csspart center - The center content container.
 * @csspart right - The right content container.
 */
export default class TerraSiteHeader extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = { 'terra-icon': TerraIcon }

    private readonly hasSlotController = new HasSlotController(
        this,
        'title',
        'center',
        'right'
    )

    /** The default site name displayed in the title slot if no content is provided. */
    @property({ attribute: 'site-name' }) siteName = ''

    render() {
        const hasTitleSlot = this.hasSlotController.test('title')
        const hasRightSlot = this.hasSlotController.test('right')

        return html`
            <header part="base" class="site-header">
                <div class="site-header__left">
                    <div part="logo" class="site-header__logo">
                        <terra-icon name="nasa-logo" font-size="4rem"></terra-icon>
                    </div>
                    <div part="title" class="site-header__title">
                        ${hasTitleSlot
                            ? html`<slot name="title"></slot>`
                            : html`<span>${this.siteName}</span>`}
                    </div>
                </div>
                <div part="center" class="site-header__center">
                    <slot name="center"></slot>
                </div>
                <div part="right" class="site-header__right">
                    ${hasRightSlot
                        ? html`<slot name="right"></slot>`
                        : html`
                              <button
                                  class="site-header__search"
                                  type="button"
                                  title="Search"
                                  aria-label="Search"
                              >
                                  <terra-icon
                                      name="magnifying-glass"
                                      library="heroicons"
                                  ></terra-icon>
                              </button>
                          `}
                </div>
            </header>
        `
    }
}
