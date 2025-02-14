import componentStyles from '../../styles/component.styles.js'
import styles from './browse-variables.styles.js'
import TerraElement from '../../internal/terra-element.js'
import { BrowseVariablesController } from './browse-variables.controller.js'
import { html } from 'lit'
import { property, state } from 'lit/decorators.js'
import type { CSSResultGroup } from 'lit'
import type { FacetField, SelectedFacetField } from './browse-variables.types.js'

/**
 * @summary Browse through the Giovanni catalog.
 * @documentation https://disc.gsfc.nasa.gov/components/browse-variables
 * @status MVP
 * @since 1.0
 *
 * @csspart base - The component's base wrapper.
 */
export default class TerraBrowseVariables extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /**
     * Filters the catalog categories and facets by the given searchQuery
     * If not provided, all categories and facets will be available to browse
     */
    @property()
    searchQuery: string

    /**
     * Allows the user to switch the catalog between different providers
     * TODO: add support for CMR catalog and make it the default
     */
    @property()
    catalog: 'giovanni' = 'giovanni'

    @state()
    selectedFacetFields: SelectedFacetField[] = []

    #controller = new BrowseVariablesController(this)

    handleFacetSelect = (event: Event) => {
        const target = event.target as HTMLLIElement

        if (!target.dataset.facet) {
            // only select if we know what the facet is
            return
        }

        this.selectedFacetFields.push({
            facet: target.dataset.facet,
            field: target.innerText.trim(),
        })
    }

    #renderCategorySelect() {
        return html`<div class="initial-browse-container">
            <div class="column">
                <h2>Research Areas</h2>
                <ul role="list">
                    ${this.#controller.facetsByCategory?.disciplines?.map(
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
                    ${this.#controller.facetsByCategory?.measurements?.map(
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
                    ${this.#controller.facetsByCategory?.platformInstruments?.map(
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
                    this.#controller.facetsByCategory?.observations,
                    true
                )}
                ${this.#renderFacet(
                    'Disciplines',
                    this.#controller.facetsByCategory?.disciplines
                )}
                ${this.#renderFacet(
                    'Measurements',
                    this.#controller.facetsByCategory?.measurements
                )}
                ${this.#renderFacet(
                    'Platform / Instrument',
                    this.#controller.facetsByCategory?.platformInstruments
                )}
                ${this.#renderFacet(
                    'Spatial Resolutions',
                    this.#controller.facetsByCategory?.spatialResolutions
                )}
                ${this.#renderFacet(
                    'Temporal Resolutions',
                    this.#controller.facetsByCategory?.temporalResolutions
                )}
                ${this.#renderFacet(
                    'Wavelengths',
                    this.#controller.facetsByCategory?.wavelengths
                )}
                ${this.#renderFacet(
                    'Depths',
                    this.#controller.facetsByCategory?.depths
                )}
                ${this.#renderFacet(
                    'Special Features',
                    this.#controller.facetsByCategory?.specialFeatures
                )}
                ${this.#renderFacet(
                    'Portal',
                    this.#controller.facetsByCategory?.portals
                )}
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
        return this.selectedFacetFields.length
            ? this.#renderVariablesBrowse()
            : this.#renderCategorySelect()
    }
}
