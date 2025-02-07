import componentStyles from '../../styles/component.styles.js'
import styles from './giovanni-browse.styles.js'
import TerraElement from '../../internal/terra-element.js'
import { GiovanniBrowseController } from './giovanni-browse.controller.js'
import { html } from 'lit'
import { property, state } from 'lit/decorators.js'
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
    selectedFacet?: {
        facet: string
        field: string
    }

    #controller = new GiovanniBrowseController(this)

    handleFacetSelect = (event: Event) => {
        const target = event.target as HTMLLIElement

        if (!target.dataset.facet) {
            // only select if we know what the facet is
            return
        }

        this.selectedFacet = {
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

    #renderVariablesBrowse() {
        return html`<div class="variables-container">
            <!-- Sidebar with Accessible Filters -->
            <aside class="sidebar">
                <h2>Filter</h2>
                <details open>
                    <summary>Observations</summary>
                    <label><input type="checkbox" /> Reanalysis</label>
                </details>
                <details open>
                    <summary>Temporal Resolution</summary>
                    <label><input type="checkbox" /> Hourly (12)</label>
                    <label><input type="checkbox" /> Monthly (10)</label>
                </details>
            </aside>

            <!-- Main Content -->
            <main class="content">
                <!-- Group: Aerosol Index -->
                <section class="group">
                    <h3>Aerosol Index</h3>
                    <ul class="variable-list">
                        <li tabindex="0" aria-selected="false">
                            <input type="checkbox" />
                            <strong
                                >Total Column Mass Density - PM2.5, time
                                average</strong
                            >
                            <span class="meta">MERRA-2 • Monthly • kg-m2</span>
                            <div class="details-panel">
                                <h4>
                                    Science Name: Total Column Mass Density - PM2.5
                                </h4>
                                <p>
                                    <strong>Spatial Resolution:</strong> 0.5 x 0.625
                                    deg.
                                </p>
                                <p>
                                    <strong>Temporal Coverage:</strong> 1980-01-01 -
                                    2024-01-01
                                </p>
                                <p><strong>Region Coverage:</strong> Global</p>
                                <p><strong>Dataset:</strong> MERRA-2</p>
                            </div>
                        </li>
                        <li tabindex="0" aria-selected="false">
                            <input type="checkbox" /> Total Surface Mass Concentration
                            - PM2.5, time average
                            <div class="details-panel">
                                <h4>
                                    Science Name: Total Surface Mass Concentration -
                                    PM2.5
                                </h4>
                                <p>
                                    <strong>Spatial Resolution:</strong> 0.5 x 0.625
                                    deg.
                                </p>
                                <p>
                                    <strong>Temporal Coverage:</strong> 1990-01-01 -
                                    2024-01-01
                                </p>
                                <p><strong>Region Coverage:</strong> Global</p>
                            </div>
                        </li>
                    </ul>
                </section>
            </main>
        </div>`
    }

    render() {
        return this.selectedFacet
            ? this.#renderVariablesBrowse()
            : this.#renderCategorySelect()
    }
}
