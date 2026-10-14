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

    /** Number of page buttons shown on each side of the current page in the full variant. */
    @property({ attribute: 'sibling-count', type: Number }) siblingCount = 1

    @state() private _visiblePages: number[] = []

    @watch(['current', 'total', 'variant', 'siblingCount'])
    handlePropsChange() {
        this._updateVisiblePages()
    }

    connectedCallback() {
        super.connectedCallback()
        this._updateVisiblePages()
    }

    private _normalizeTotal() {
        if (!Number.isFinite(this.total)) {
            return 1
        }

        return Math.max(1, Math.trunc(this.total))
    }

    private _normalizeCurrent(total: number) {
        if (!Number.isFinite(this.current)) {
            return 1
        }

        return Math.max(1, Math.min(Math.trunc(this.current), total))
    }

    private _normalizeSiblingCount() {
        if (!Number.isFinite(this.siblingCount)) {
            return 1
        }

        return Math.max(0, Math.trunc(this.siblingCount))
    }

    private _createRange(start: number, end: number) {
        const pages: number[] = []

        for (let page = start; page <= end; page++) {
            pages.push(page)
        }

        return pages
    }

    private _buildVisiblePages(current: number, total: number, siblingCount: number) {
        const boundaryCount = 1
        const totalPageNumbers = siblingCount * 2 + boundaryCount * 2 + 3

        if (total <= totalPageNumbers) {
            return this._createRange(1, total)
        }

        const startPages = this._createRange(1, boundaryCount)
        const endPages = this._createRange(total - boundaryCount + 1, total)

        const siblingsStart = Math.max(
            Math.min(
                current - siblingCount,
                total - boundaryCount - siblingCount * 2 - 1
            ),
            boundaryCount + 2
        )

        const siblingsEnd = Math.min(
            Math.max(current + siblingCount, boundaryCount + siblingCount * 2 + 2),
            endPages[0] - 2
        )

        const pages: number[] = [...startPages]

        if (siblingsStart > boundaryCount + 2) {
            pages.push(-1)
        } else if (boundaryCount + 1 < total - boundaryCount + 1) {
            pages.push(boundaryCount + 1)
        }

        pages.push(...this._createRange(siblingsStart, siblingsEnd))

        if (siblingsEnd < total - boundaryCount - 1) {
            pages.push(-1)
        } else if (total - boundaryCount > boundaryCount) {
            pages.push(total - boundaryCount)
        }

        pages.push(...endPages)
        return pages
    }

    private _updateVisiblePages() {
        if (this.variant === 'simple') {
            // Prev/Next only - no page numbers
            this._visiblePages = []
            return
        }

        const total = this._normalizeTotal()
        const current = this._normalizeCurrent(total)
        const siblingCount = this._normalizeSiblingCount()
        this._visiblePages = this._buildVisiblePages(current, total, siblingCount)
    }

    private _handlePageClick(page: number) {
        const total = this._normalizeTotal()
        const current = this._normalizeCurrent(total)
        const nextPage = Math.max(1, Math.min(Math.trunc(page), total))

        if (nextPage === current) {
            return
        }

        this.current = nextPage
        this.emit('terra-page-change', { detail: { page: nextPage } })
    }

    private _handlePrevClick() {
        const total = this._normalizeTotal()
        const current = this._normalizeCurrent(total)

        if (current > 1) {
            this._handlePageClick(current - 1)
        }
    }

    private _handleNextClick() {
        const total = this._normalizeTotal()
        const current = this._normalizeCurrent(total)

        if (current < total) {
            this._handlePageClick(current + 1)
        }
    }

    private _handleVisiblePageClick(event: Event) {
        const target = event.currentTarget as HTMLButtonElement | null
        if (!target) {
            return
        }

        const page = Number(target.dataset.page)
        if (!Number.isFinite(page)) {
            return
        }

        this._handlePageClick(page)
    }

    render() {
        const total = this._normalizeTotal()
        const current = this._normalizeCurrent(total)
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
                                          data-page=${String(page)}
                                          ?disabled=${isCurrent}
                                          @click=${this._handleVisiblePageClick}
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
