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
    }

    @property({ reflect: true, attribute: 'collection-entry-id' })
    collectionEntryId?: string

    @state()
    limit = 100

    @state()
    page = 1

    #controller = new DataAccessController(this)

    #handleRangeChanged(event: RangeChangedEvent) {
        if (event.last >= this.page * this.limit - 1) {
            this.page++
        }
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
                              <div>File Name</div>
                              <div>Size (MB)</div>
                              <div>Start Time</div>
                              <div>End Time</div>
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
