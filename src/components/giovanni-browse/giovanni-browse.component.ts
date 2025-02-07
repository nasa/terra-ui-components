import componentStyles from '../../styles/component.styles.js'
import styles from './giovanni-browse.styles.js'
import TerraElement from '../../internal/terra-element.js'
import { html } from 'lit'
import { property, state } from 'lit/decorators.js'
import {
    GiovanniBrowseController,
    type FacetField,
    type SelectedFacetField,
} from './giovanni-browse.controller.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Browse through the Giovanni catalog.
 * @documentation https://disc.gsfc.nasa.gov/components/giovanni-browse
 * @status MVP
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 */
export default class TerraGiovanniBrowse extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /**
     * Filters the catalog categories and facets by the given searchQuery
     * If not provided, all categories and facets will be available to browse
     */
    @property()
    searchQuery: string

    @state()
    selectedFacetField?: SelectedFacetField

    #controller = new GiovanniBrowseController(this)

    handleFacetSelect = (event: Event) => {
        const target = event.target as HTMLLIElement

        if (!target.dataset.facet) {
            // only select if we know what the facet is
            return
        }

        this.selectedFacetField = {
            facet: target.dataset.facet,
            field: target.innerText.trim(),
        }
    }

    #renderCategorySelect() {
        return html`<div class="initial-browse-container">
            <div class="column">
                <h2>Research Areas</h2>
                <ul role="list">
                    ${this.#controller.facets?.disciplines?.map(
                        field =>
                            html`<li
                                role="button"
                                tabindex="0"
                                aria-selected="false"
                                data-facet="disciplines"
                                @click=${this.handleFacetSelect}
                            >
                                ${field.name}
                            </li>`
                    )}
                </ul>
            </div>

            <div class="column">
                <h2>Measurements</h2>
                <ul role="list">
                    ${this.#controller.facets?.measurements?.map(
                        field =>
                            html`<li
                                role="button"
                                tabindex="0"
                                aria-selected="false"
                                data-facet="measurements"
                                @click=${this.handleFacetSelect}
                            >
                                ${field.name}
                            </li>`
                    )}
                </ul>
            </div>

            <div class="column">
                <h2>Sources</h2>
                <ul role="list">
                    ${this.#controller.facets?.platformInstruments?.map(
                        field =>
                            html`<li
                                role="button"
                                tabindex="0"
                                aria-selected="false"
                                data-facet="platformInstruments"
                                @click=${this.handleFacetSelect}
                            >
                                ${field.name}
                            </li>`
                    )}
                </ul>
            </div>
        </div>`
    }

    #renderFacet(title: string, fields?: FacetField[], open?: boolean) {
        return html`<details ?open=${open}>
            <summary>${title}</summary>

            ${(fields ?? []).map(
                field => html`
                    <div>
                        <label
                            ><input type="checkbox" /> ${field.name}
                            (${field.count})</label
                        >
                    </div>
                `
            )}
        </details>`
    }

    #renderVariablesBrowse() {
        return html`<div class="variables-container">
            <aside class="sidebar">
                <h2>Filter</h2>

                ${this.#renderFacet(
                    'Observations',
                    this.#controller.facets?.observations,
                    true
                )}
                ${this.#renderFacet(
                    'Disciplines',
                    this.#controller.facets?.disciplines
                )}
                ${this.#renderFacet(
                    'Measurements',
                    this.#controller.facets?.measurements
                )}
                ${this.#renderFacet(
                    'Platform / Instrument',
                    this.#controller.facets?.platformInstruments
                )}
                ${this.#renderFacet(
                    'Spatial Resolutions',
                    this.#controller.facets?.spatialResolutions
                )}
                ${this.#renderFacet(
                    'Temporal Resolutions',
                    this.#controller.facets?.temporalResolutions
                )}
                ${this.#renderFacet(
                    'Wavelengths',
                    this.#controller.facets?.wavelengths
                )}
                ${this.#renderFacet('Depths', this.#controller.facets?.depths)}
                ${this.#renderFacet(
                    'Special Features',
                    this.#controller.facets?.specialFeatures
                )}
                ${this.#renderFacet('Portal', this.#controller.facets?.portals)}
            </aside>

            <main class="content">
                <section class="group">
                    <h3>Category</h3>

                    <ul class="variable-list">
                        ${this.#controller.variables?.map(
                            variable => html`
                                <li tabindex="0" aria-selected="false">
                                    <input type="checkbox" />
                                    <strong>${variable.dataFieldLongName}</strong>
                                    <span class="meta"
                                        >MERRA-2 • ${variable.dataProductTimeInterval}
                                        • kg-m2</span
                                    >
                                    <div class="details-panel">
                                        <h4>
                                            Science Name:
                                            ${variable.dataFieldLongName}
                                        </h4>
                                        <p>
                                            <strong>Spatial Resolution:</strong>
                                            ${variable.dataProductSpatialResolution}
                                        </p>
                                        <p>
                                            <strong>Temporal Coverage:</strong>
                                            ${variable.dataProductBeginDateTime} -
                                            ${variable.dataProductEndDateTime}
                                        </p>
                                        <p>
                                            <strong>Region Coverage:</strong> Global
                                        </p>
                                        <p><strong>Dataset:</strong> MERRA-2</p>
                                    </div>
                                </li>
                            `
                        )}
                    </ul>
                </section>
            </main>
        </div>`
    }

    render() {
        return this.selectedFacetField
            ? this.#renderVariablesBrowse()
            : this.#renderCategorySelect()
    }
}
