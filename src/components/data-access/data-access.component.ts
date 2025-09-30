import { property, state } from 'lit/decorators.js'
import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-access.styles.js'
import type { CSSResultGroup } from 'lit'
import { DataAccessController } from './data-access.controller.js'
import type { CmrGranule } from '../../metadata-catalog/types.js'
import '@lit-labs/virtualizer'
import type { RangeChangedEvent } from '@lit-labs/virtualizer'
import TerraLoader from '../loader/loader.component.js'
import { formatDate } from '../../utilities/date.js'
import {
    calculateGranuleSize,
    calculateMeanGranuleSize,
    formatGranuleSize,
} from '../../metadata-catalog/utilities.js'
import TerraIcon from '../icon/icon.component.js'

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://disc.gsfc.nasa.gov/components/data-access
 * @status experimental
 * @since 1.0
 *
 * @dependency terra-example
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class TerraDataAccess extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-loader': TerraLoader,
        'terra-icon': TerraIcon,
    }

    @property({ reflect: true, attribute: 'collection-entry-id' })
    collectionEntryId?: string

    @state()
    limit = 50

    @state()
    page = 1

    @state()
    sortBy = 'title'

    @state()
    sortDirection = 'asc'

    #controller = new DataAccessController(this)

    #handleRangeChanged(event: RangeChangedEvent) {
        if (event.last >= this.page * this.limit - 1) {
            this.page++
        }
    }

    #handleSortBy(field: string) {
        if (this.sortBy === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
        } else {
            this.sortBy = field
            this.sortDirection = 'asc'
        }
    }

    #renderSortBy(field: string) {
        if (this.sortBy !== field) {
            return nothing
        }

        return html`
            <terra-icon
                .name=${this.sortDirection === 'desc'
                    ? 'chevron-down-circle'
                    : 'chevron-up-circle'}
                font-size="24px"
            ></terra-icon>
        `
    }

    render() {
        return html`<h2>Data Access</h2>
            ${this.#controller.granules?.length
                ? html`
                      <div class="info-bar">
                          <strong>${this.#controller.totalGranules}</strong> files
                          selected
                          (~${formatGranuleSize(
                              calculateMeanGranuleSize(this.#controller.granules) *
                                  this.#controller.totalGranules
                          )}),
                          <strong>${this.#controller.granules.length}</strong>
                          displayed
                      </div>

                      <div class="grid-container">
                          <div class="grid-header">
                              <div @click=${() => this.#handleSortBy('title')}>
                                  File Name ${this.#renderSortBy('title')}
                              </div>
                              <div @click=${() => this.#handleSortBy('size')}>
                                  Size (MB) ${this.#renderSortBy('size')}
                              </div>
                              <div @click=${() => this.#handleSortBy('timeStart')}>
                                  Start Time ${this.#renderSortBy('timeStart')}
                              </div>
                              <div @click=${() => this.#handleSortBy('timeEnd')}>
                                  End Time ${this.#renderSortBy('timeEnd')}
                              </div>
                          </div>

                          <div class="grid-body">
                              <lit-virtualizer
                                  style="height: 300px;"
                                  scroller
                                  .items=${this.#controller.granules}
                                  .renderItem=${(granule: CmrGranule) => {
                                      const relatedUrl = granule.relatedUrls.find(
                                          url => url.type === 'GET DATA'
                                      )

                                      return html` <div class="grid-row">
                                          <div class="file-name">
                                              ${relatedUrl?.url
                                                  ? html`<a
                                                        href="${relatedUrl.url}"
                                                        target="_blank"
                                                        >${granule.title}</a
                                                    >`
                                                  : granule.title}
                                          </div>
                                          <div class="size">
                                              ${calculateGranuleSize(
                                                  granule,
                                                  'MB'
                                              ).toFixed(2)}
                                          </div>
                                          <div class="time">
                                              ${formatDate(
                                                  granule.timeStart,
                                                  'yyyy-MM-dd kk:mm:ss'
                                              )}
                                          </div>
                                          <div class="time">
                                              ${formatDate(
                                                  granule.timeEnd,
                                                  'yyyy-MM-dd kk:mm:ss'
                                              )}
                                          </div>
                                      </div>`
                                  }}
                                  @rangeChanged=${this.#handleRangeChanged}
                              ></lit-virtualizer>
                          </div>
                      </div>
                  `
                : nothing}
            ${this.#controller.render({
                initial: () => this.#renderLoader(),
                pending: () => nothing,
                complete: () => nothing,
                error: () => nothing,
            })} `
    }

    #renderLoader(more?: boolean) {
        return html`<div style="display: flex; align-items: center; gap: 10px;">
            <terra-loader indeterminate variant="small"></terra-loader>
            <span>${more ? 'Loading More Granules' : 'Loading Granules'}</span>
        </div>`
    }
}
