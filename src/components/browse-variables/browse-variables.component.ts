import componentStyles from '../../styles/component.styles.js'
import styles from './browse-variables.styles.js'
import TerraButton from '../button/button.component.js'
import TerraElement from '../../internal/terra-element.js'
import TerraGiovanniSearch from '../giovanni-search/giovanni-search.component.js'
import TerraIcon from '../icon/icon.component.js'
import TerraLoader from '../loader/loader.component.js'
import TerraSkeleton from '../skeleton/skeleton.component.js'
import { BrowseVariablesController } from './browse-variables.controller.js'
import { getRandomIntInclusive } from '../../utilities/number.js'
import { html, nothing } from 'lit'
import { property, state } from 'lit/decorators.js'
import { TaskStatus } from '@lit/task'
import type { CSSResultGroup } from 'lit'
import type {
    FacetField,
    FacetsByCategory,
    SelectedFacets,
} from './browse-variables.types.js'
import type { TerraGiovanniSearchChangeEvent } from '../../events/terra-giovanni-search-change.js'

/**
 * @summary Browse through the NASA CMR or Giovanni catalogs.
 * @documentation https://disc.gsfc.nasa.gov/components/browse-variables
 * @status MVP
 * @since 1.0
 *
 * @dependency terra-giovanni-search
 * @dependency terra-button
 * @dependency terra-skeleton
 * @dependency terra-icon
 * @dependency terra-loader
 */
export default class TerraBrowseVariables extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-giovanni-search': TerraGiovanniSearch,
        'terra-button': TerraButton,
        'terra-skeleton': TerraSkeleton,
        'terra-icon': TerraIcon,
        'terra-loader': TerraLoader,
    }

    /**
     * Allows the user to switch the catalog between different providers
     * TODO: add support for CMR catalog and make it the default
     */
    @property()
    catalog: 'giovanni' = 'giovanni'

    @state()
    searchQuery: string

    @state()
    selectedFacets: SelectedFacets = {}

    @state()
    showVariablesBrowse: boolean = false

    #controller = new BrowseVariablesController(this)

    reset() {
        // reset state back to it's defaults
        this.searchQuery = ''
        this.selectedFacets = {}
        this.showVariablesBrowse = false
    }

    handleObservationChange() {
        const selectedObservation =
            this.shadowRoot?.querySelector<HTMLInputElement>(
                'input[name="observation"]:checked'
            )?.value ?? 'All'

        if (selectedObservation === 'All') {
            this.#clearFacet('observations')
        } else {
            this.#selectFacetField('observations', selectedObservation, true)
        }
    }

    toggleFacetSelect(event: Event) {
        const target = event.target as HTMLLIElement

        if (!target.dataset.facet) {
            // only select if we know what the facet is
            return
        }

        this.#selectFacetField(target.dataset.facet, target.innerText.trim())
        this.showVariablesBrowse = true
    }

    handleSearchChange(e: TerraGiovanniSearchChangeEvent) {
        // to mimic on-prem Giovanni behavior, we will reset all facets when the search keyword changes
        this.selectedFacets = {}

        this.searchQuery = e.detail
    }

    /**
     * given a field, ex: "observations": "Model", will add the field to any existing selected facets
     * if "selectedOneFieldAtATime" is true, then we will only select that one field
     */
    #selectFacetField(
        facet: string,
        field: string,
        selectOneFieldAtATime: boolean = false
    ) {
        const existingFields = this.selectedFacets[facet] || []

        if (existingFields.includes(field)) {
            // already selected, unselect it
            this.#unselectFacetField(facet, field)
            return
        }

        this.selectedFacets = {
            ...this.selectedFacets,
            [facet]: selectOneFieldAtATime ? [field] : [...existingFields, field],
        }
    }

    #clearFacet(facet: string) {
        const { [facet]: _, ...remainingFacets } = this.selectedFacets

        this.selectedFacets = remainingFacets
    }

    #unselectFacetField(facet: string, field: string) {
        if (!this.selectedFacets[facet]) {
            return // facet has no fields that have been selected
        }

        const filteredFields = this.selectedFacets[facet].filter(f => f !== field) // remove the given field

        if (!filteredFields.length) {
            // no fields left, just clear the facet
            this.#clearFacet(facet)
            return
        }

        this.selectedFacets = {
            ...this.selectedFacets,
            [facet]: filteredFields,
        }
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

        return html`
            <div class="scrollable browse-by-category">
                <aside>
                    <h3>Observations</h3>

                    ${this.#controller.facetsByCategory?.observations.length
                        ? html`
                              <label>
                                  <input
                                      type="radio"
                                      name="observation"
                                      value="All"
                                      @change=${this.handleObservationChange}
                                      checked
                                  />
                                  All</label
                              >

                              ${this.#controller.facetsByCategory?.observations.map(
                                  field =>
                                      html`<label>
                                          <input
                                              type="radio"
                                              name="observation"
                                              value=${field.name}
                                              @change=${this.handleObservationChange}
                                          />
                                          ${field.name}
                                      </label>`
                              )}
                          `
                        : html`<terra-skeleton
                              rows="4"
                              variableWidths
                          ></terra-skeleton>`}

                    <terra-button
                        variant="text"
                        size
                        @click=${() => (this.showVariablesBrowse = true)}
                        >View All Now</terra-button
                    >
                </aside>

                <main>
                    ${columns.map(
                        column => html`
                            <div class="column">
                                <h3>${column.title}</h3>
                                <ul role="list">
                                    ${this.#controller.facetsByCategory?.[
                                        column.facetKey
                                    ]
                                        ?.filter(field => field.count > 0)
                                        .map(
                                            field =>
                                                html`<li
                                                    role="button"
                                                    tabindex="0"
                                                    aria-selected="false"
                                                    data-facet="disciplines"
                                                    @click=${this.toggleFacetSelect}
                                                >
                                                    ${field.name}
                                                </li>`
                                        ) ??
                                    html`<terra-skeleton
                                        rows=${getRandomIntInclusive(8, 12)}
                                        variableWidths
                                    ></terra-skeleton>`}
                                </ul>
                            </div>
                        `
                    )}
                </main>
            </div>
        `
    }

    #renderFacet(
        facetKey: string,
        title: string,
        fields?: FacetField[],
        open?: boolean
    ) {
        return html`<details ?open=${open}>
            <summary>${title}</summary>

            ${(fields ?? []).map(field =>
                field.count > 0
                    ? html`
                          <div class="facet">
                              <label
                                  ><input
                                      type="checkbox"
                                      @change=${() =>
                                          this.#selectFacetField(
                                              facetKey,
                                              field.name
                                          )}
                                      ?checked=${this.selectedFacets[
                                          facetKey
                                      ]?.includes(field.name)}
                                  />
                                  ${field.name} (${field.count})</label
                              >
                          </div>
                      `
                    : nothing
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

        return html`<div class="scrollable variables-container">
            <header>
                Showing ${this.#controller.total}
                variables${this.searchQuery
                    ? ` associated with '${this.searchQuery}'`
                    : ''}
            </header>

            <aside>
                <h3>Filter</h3>

                ${facets.map(facet =>
                    this.#renderFacet(
                        facet.facetKey,
                        facet.title,
                        this.#controller.facetsByCategory?.[facet.facetKey],
                        facet.open
                    )
                )}
            </aside>

            <main>
                <section class="group">
                    <ul class="variable-list">
                        ${this.#controller.variables.map(
                            variable => html`
                                <!-- Just dumping some data here that may be useful in the details popup -->
                                <li tabindex="0" aria-selected="false">
                                    <strong>${variable.dataFieldLongName}</strong>
                                    <span
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
        </div>`
    }

    render() {
        const showLoader =
            this.#controller.task.status === TaskStatus.PENDING && // only show the loader when doing a fetch
            this.#controller.facetsByCategory // we won't show the loader initially, we'll show skeleton loading instead

        return html`
            <div class="container">
                <header class="search">
                    ${this.showVariablesBrowse
                        ? html`
                              <terra-button @click=${this.reset}>
                                  <terra-icon
                                      name="solid-chevron-left"
                                      library="heroicons"
                                      font-size="1.5em"
                                  ></terra-icon>
                              </terra-button>
                          `
                        : nothing}

                    <terra-giovanni-search
                        @terra-giovanni-search-change=${this.handleSearchChange}
                    />
                </header>

                ${this.showVariablesBrowse
                    ? this.#renderVariablesBrowse()
                    : this.#renderCategorySelect()}

                <dialog ?open=${showLoader}>
                    <terra-loader indeterminate></terra-loader>
                </dialog>
            </div>
        `
    }
}
