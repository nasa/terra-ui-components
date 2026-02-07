import { property, state } from 'lit/decorators.js'
import { html } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import styles from './pagination.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Pagination is a navigational element that allows users to navigate between content or pages.
 * @documentation https://terra-ui.netlify.app/components/pagination
 * @status stable
 * @since 1.0
 *
 * @dependency terra-icon
 *
 * @slot - Content to display on the right side (e.g., rows per page dropdown). Only visible when variant is "left".
 *
 * @event terra-page-change - Emitted when the page changes.
 * @eventDetail { page: number } - The new page number.
 *
 * @csspart base - The component's base wrapper.
 * @csspart nav - The navigation container.
 * @csspart button - The page button elements.
 * @csspart button-current - The current page button.
 * @csspart ellipsis - The ellipsis element.
 * @csspart prev - The previous button.
 * @csspart next - The next button.
 * @csspart slot - The right-side slot container.
 *
 * @cssproperty --terra-pagination-button-color - The text color of page buttons.
 * @cssproperty --terra-pagination-button-background-color - The background color of page buttons.
 * @cssproperty --terra-pagination-button-color-hover - The text color of page buttons on hover.
 * @cssproperty --terra-pagination-button-background-color-hover - The background color of page buttons on hover.
 * @cssproperty --terra-pagination-button-color-current - The text color of the current page button.
 * @cssproperty --terra-pagination-button-background-color-current - The background color of the current page button.
 */
export default class TerraPagination extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-icon': TerraIcon,
    }

    /** The current page number (1-indexed). */
    @property({ type: Number }) current = 1

    /** The total number of pages. */
    @property({ type: Number }) total = 1

    /** The pagination variant. */
    @property({ reflect: true }) variant: 'full' | 'simple' = 'full'

    /** Whether the pagination is centered. */
    @property({ type: Boolean }) centered = false

    @state() private _visiblePages: number[] = []

    @watch(['current', 'total', 'variant'])
    handlePropsChange() {
        this._updateVisiblePages()
    }

    connectedCallback() {
        super.connectedCallback()
        this._updateVisiblePages()
    }

    private _updateVisiblePages() {
        const pages: number[] = []
        const total = Math.max(1, this.total)
        const current = Math.max(1, Math.min(this.current, total))

        if (this.variant === 'simple') {
            // Prev/Next only - no page numbers
            this._visiblePages = []
            return
        }

        if (total <= 7) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= total; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            if (current <= 4) {
                // Near the beginning
                for (let i = 2; i <= 5; i++) {
                    pages.push(i)
                }
                pages.push(-1) // Ellipsis
                pages.push(total)
            } else if (current >= total - 3) {
                // Near the end
                pages.push(-1) // Ellipsis
                for (let i = total - 4; i <= total; i++) {
                    pages.push(i)
                }
            } else {
                // In the middle
                pages.push(-1) // Ellipsis
                for (let i = current - 1; i <= current + 1; i++) {
                    pages.push(i)
                }
                pages.push(-1) // Ellipsis
                pages.push(total)
            }
        }

        this._visiblePages = pages
    }

    private _handlePageClick(page: number) {
        if (page === this.current || page < 1 || page > this.total) {
            return
        }

        this.current = page
        this._updateVisiblePages()
        this.emit('terra-page-change', { detail: { page } })
    }

    private _handlePrevClick() {
        if (this.current > 1) {
            this._handlePageClick(this.current - 1)
        }
    }

    private _handleNextClick() {
        if (this.current < this.total) {
            this._handlePageClick(this.current + 1)
        }
    }

    render() {
        const total = Math.max(1, this.total)
        const current = Math.max(1, Math.min(this.current, total))
        const isPrevDisabled = current === 1
        const isNextDisabled = current === total
        const showNumbers = this.variant === 'full'

        return html`
            <div
                part="base"
                class=${classMap({
                    pagination: true,
                    'pagination--centered': this.centered,
                    'pagination--left': this.variant === 'full' && !this.centered,
                    'pagination--simple': this.variant === 'simple',
                })}
            >
                <nav part="nav" class="pagination__nav">
                    <button
                        part="prev"
                        class="pagination__button pagination__button--prev"
                        ?disabled=${isPrevDisabled}
                        @click=${this._handlePrevClick}
                        aria-label="Previous page"
                    >
                        ${this.variant === 'simple'
                            ? html`
                                  <terra-icon
                                      name="chevron-left"
                                      library="default"
                                  ></terra-icon>
                                  <span class="pagination__button-text"
                                      >Previous</span
                                  >
                              `
                            : html`
                                  <terra-icon
                                      name="chevron-left"
                                      library="default"
                                  ></terra-icon>
                              `}
                    </button>

                    ${showNumbers
                        ? html`
                              ${this._visiblePages.map(page => {
                                  if (page === -1) {
                                      return html`
                                          <span
                                              part="ellipsis"
                                              class="pagination__ellipsis"
                                              aria-hidden="true"
                                              >…</span
                                          >
                                      `
                                  }

                                  const isCurrent = page === current
                                  return html`
                                      <button
                                          part=${isCurrent
                                              ? 'button-current button'
                                              : 'button'}
                                          class=${classMap({
                                              pagination__button: true,
                                              'pagination__button--page': true,
                                              'pagination__button--current':
                                                  isCurrent,
                                          })}
                                          ?disabled=${isCurrent}
                                          @click=${() => this._handlePageClick(page)}
                                          aria-label=${`Page ${page}`}
                                          aria-current=${isCurrent
                                              ? 'page'
                                              : undefined}
                                      >
                                          ${page}
                                      </button>
                                  `
                              })}
                          `
                        : ''}

                    <button
                        part="next"
                        class="pagination__button pagination__button--next"
                        ?disabled=${isNextDisabled}
                        @click=${this._handleNextClick}
                        aria-label="Next page"
                    >
                        ${this.variant === 'simple'
                            ? html`
                                  <span class="pagination__button-text">Next</span>
                                  <terra-icon
                                      name="chevron-right"
                                      library="default"
                                  ></terra-icon>
                              `
                            : html`
                                  <terra-icon
                                      name="chevron-right"
                                      library="default"
                                  ></terra-icon>
                              `}
                    </button>
                </nav>

                ${this.variant === 'full' && !this.centered
                    ? html`
                          <div part="slot" class="pagination__slot">
                              <slot></slot>
                          </div>
                      `
                    : ''}
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'terra-pagination': TerraPagination
    }
}
