import componentStyles from '../../styles/component.styles.js'
import styles from './browse-variables.styles.js'
import TerraElement from '../../internal/terra-element.js'
import { BrowseVariablesController } from './browse-variables.controller.js'
import { html } from 'lit'
import { property, state } from 'lit/decorators.js'
import type { CSSResultGroup } from 'lit'
import type {
    FacetField,
    FacetsByCategory,
    SelectedFacetField,
} from './browse-variables.types.js'

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

        // currently in the design it appears you can only select one facet field at a time
        this.selectedFacetFields = [
            {
                facet: target.dataset.facet,
                field: target.innerText.trim(),
            },
        ]
    }

    #renderCategorySelect() {
        const columns: {
            title: string
            facetKey: keyof FacetsByCategory
        }[] = [
            { title: 'Research Areas', facetKey: 'disciplines' },
            { title: 'Measurements', facetKey: 'measurements' },
            { title: 'Sources', facetKey: 'platformInstruments' },
        ]

        return html`<div class="initial-browse-container">
            <div class="scroll-container">
                ${columns.map(
                    column => html`
                        <div class="column">
                            <h2>${column.title}</h2>
                            <ul role="list">
                                ${this.#controller.facetsByCategory?.[
                                    column.facetKey
                                ]?.map(
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
                    `
                )}
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
        const facets: {
            title: string
            facetKey: keyof FacetsByCategory
            open?: boolean
        }[] = [
            { title: 'Observations', facetKey: 'observations', open: true },
            { title: 'Disciplines', facetKey: 'disciplines' },
            { title: 'Measurements', facetKey: 'measurements' },
            { title: 'Platform / Instrument', facetKey: 'platformInstruments' },
            { title: 'Spatial Resolutions', facetKey: 'spatialResolutions' },
            { title: 'Temporal Resolutions', facetKey: 'temporalResolutions' },
            { title: 'Wavelengths', facetKey: 'wavelengths' },
            { title: 'Depths', facetKey: 'depths' },
            { title: 'Special Features', facetKey: 'specialFeatures' },
            { title: 'Portal', facetKey: 'portals' },
        ]

        return html`<div class="variables-container">
            <div class="scroll-container">
                <aside class="sidebar">
                    <h2>Filter</h2>

                    ${facets.map(facet =>
                        this.#renderFacet(
                            facet.title,
                            this.#controller.facetsByCategory?.[facet.facetKey],
                            facet.open
                        )
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
                                            >MERRA-2 •
                                            ${variable.dataProductTimeInterval} •
                                            kg-m2</span
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
                                                <strong>Region Coverage:</strong>
                                                Global
                                            </p>
                                            <p><strong>Dataset:</strong> MERRA-2</p>
                                        </div>
                                    </li>
                                `
                            )}
                        </ul>
                    </section>
                </main>
            </div>
        </div>`
    }

    render() {
        return this.selectedFacetFields.length
            ? this.#renderVariablesBrowse()
            : this.#renderCategorySelect()
    }
}
