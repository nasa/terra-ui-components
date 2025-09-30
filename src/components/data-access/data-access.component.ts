import { property, state } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './data-access.styles.js'
import type { CSSResultGroup } from 'lit'
import { DataAccessController } from './data-access.controller.js'
import type { CmrGranule } from '../../metadata-catalog/types.js'
import '@lit-labs/virtualizer'
import type { RangeChangedEvent } from '@lit-labs/virtualizer'

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
            <lit-virtualizer
                style="height: 300px;"
                scroller
                .items=${this.#controller.granules}
                .renderItem=${(granule: CmrGranule) =>
                    html`<div>${granule.title}</div>`}
                @rangeChanged=${this.#handleRangeChanged}
            ></lit-virtualizer>`
    }
}
