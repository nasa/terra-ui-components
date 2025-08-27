import componentStyles from '../../styles/component.styles.js'
import styles from './browse-variables.styles.js'
import TerraButton from '../button/button.component.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import TerraLoader from '../loader/loader.component.js'
import TerraSkeleton from '../skeleton/skeleton.component.js'
import TerraVariableKeywordSearch from '../variable-keyword-search/variable-keyword-search.component.js'
import { BrowseVariablesController } from './browse-variables.controller.js'
import { getRandomIntInclusive } from '../../utilities/number.js'
import { html, nothing } from 'lit'
import { property, state } from 'lit/decorators.js'
import { TaskStatus } from '@lit/task'
import { watch } from '../../internal/watch.js'
import type { TerraVariableKeywordSearchChangeEvent } from '../../events/terra-variable-keyword-search-change.js'
import type { SlDrawer } from '@shoelace-style/shoelace'
import type { CSSResultGroup } from 'lit'
import type {
    FacetField,
    FacetsByCategory,
    SelectedFacets,
    Variable,
} from './browse-variables.types.js'

/**
 * @summary Browse through the NASA CMR or Giovanni catalogs.
 * @documentation https://disc.gsfc.nasa.gov/components/browse-variables
 * @status MVP
 * @since 1.0
 *
 * @emits terra-variables-change - emitted when the user selects or unselects variables
 *
 * @dependency terra-variable-keyword-search
 * @dependency terra-button
 * @dependency terra-skeleton
 * @dependency terra-icon
 * @dependency terra-loader
 */
export default class TerraBrowseVariables extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-variable-keyword-search': TerraVariableKeywordSearch,
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

    @property({ attribute: 'selected-variable-entry-ids', reflect: true })
    selectedVariableEntryIds?: string

    @state()
    searchQuery: string

    @state()
    selectedFacets: SelectedFacets = {}

    @state()
    selectedVariables: Variable[] = []

    @state()
    showVariablesBrowse: boolean = false

    #controller = new BrowseVariablesController(this)

    @watch('selectedVariables')
    handleSelectedVariablesChange() {
        this.emit('terra-variables-change', {
            detail: {
                selectedVariables: this.selectedVariables,
            },
        })
    }

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

    handleSearch(e: TerraVariableKeywordSearchChangeEvent) {
        // to mimic on-prem Giovanni behavior, we will reset all facets when the search keyword changes
        this.selectedFacets = {}

        this.searchQuery = e.detail
        this.showVariablesBrowse = true
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

    #handleVariableSelection(variable: Variable, checked: Boolean) {
        const variableIsSelected = this.selectedVariables.find(
            v => v.dataFieldLongName === variable.dataFieldLongName
        )

        if (checked && !variableIsSelected) {
            // need to add variable to list of selected variables
            this.selectedVariables = ([] as Variable[]).concat(
                this.selectedVariables,
                variable
            )
        } else if (!checked && variableIsSelected) {
            // need to remove variable from list of selected variables
            this.selectedVariables = this.selectedVariables.filter(
                v => v.dataFieldLongName !== variable.dataFieldLongName
            )
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
                                  ${field.name}
                                  <!-- TODO: add count back in once we aren't filtering by Cloud Giovanni Catalog (or Cloud Giovanni supports all variables)(${field.count})--></label
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

        // TODO: create "sort by" menu and "group by" menu
        // MVP sort TBD but must include alpha, reverse-alpha, start data and end date, based on Variable Long Name
        // MVP group TBD but must include 'Measurements' and 'Dataset'
        return html`<div class="scrollable variables-container">
            <header>
                <!-- TODO: add back in once we aren't filtering by Cloud Giovanni Catalog (or Cloud Giovanni supports all variables) 
                Showing ${this.#controller.total} variables
                ${this.searchQuery ? `associated with '${this.searchQuery}'` : ''}-->
                <!-- Sorting and Grouping feature still needs a UI / UX feature discussion.
                <menu>
                    <li>
                        <sl-dropdown class="list-menu-dropdown">
                            <sl-button slot="trigger" caret>Sort By</sl-button>
                            <sl-menu>
                                <sl-menu-item value="aToZ">A&hellip;Z</sl-menu-item>
                                <sl-menu-item value="zToA">Z&hellip;A</sl-menu-item>
                            </sl-menu>
                        </sl-dropdown>
                    </li>
                    <li>
                        <sl-dropdown class="list-menu-dropdown">
                            <sl-button slot="trigger" caret>Group By</sl-button>
                            <sl-menu>
                                <sl-menu-item value="depths">Depths</sl-menu-item>
                                <sl-menu-item value="disciplines"
                                    >Disciplines</sl-menu-item
                                >
                                <sl-menu-item value="measurements"
                                    >Measurements</sl-menu-item
                                >
                                <sl-menu-item value="observations"
                                    >Observations</sl-menu-item
                                >
                                <sl-menu-item value="platformInstruments"
                                    >Platform Instruments</sl-menu-item
                                >
                                <sl-menu-item value="portals">Portals</sl-menu-item>
                                <sl-menu-item value="spatialResolutions"
                                    >Spatial Resolutions</sl-menu-item
                                >
                                <sl-menu-item value="specialFeatures"
                                    >Special Features</sl-menu-item
                                >
                                <sl-menu-item value="temporalResolutions"
                                    >Temporal Resolutions</sl-menu-item
                                >
                                <sl-menu-item value="wavelengths"
                                    >Wavelengths</sl-menu-item
                                >
                            </sl-menu>
                        </sl-dropdown>
                    </li>
                </menu>
                -->
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
                        ${this.#controller.variables.map(variable => {
                            const metadata = [
                                variable.dataProductInstrumentShortName,
                                variable.dataProductTimeInterval,
                                variable.dataFieldUnits,
                            ]
                                .filter(Boolean)
                                .join(' • ')

                            return html`
                                <li
                                    aria-selected="false"
                                    class="variable-list-item"
                                    @click=${(event: Event) => {
                                        const target =
                                            event.currentTarget as HTMLLIElement
                                        const targetCheckbox = target.querySelector(
                                            'input[type="checkbox"]'
                                        ) as HTMLInputElement | null

                                        if (!targetCheckbox) {
                                            return
                                        }

                                        target?.setAttribute(
                                            'aria-selected',
                                            `${targetCheckbox.checked}`
                                        )
                                    }}
                                >
                                    <div class="variable">
                                        <label>
                                            <input
                                                data-variable=${variable}
                                                type="checkbox"
                                                @change=${(e: Event) => {
                                                    const input =
                                                        e.currentTarget as HTMLInputElement
                                                    this.#handleVariableSelection(
                                                        variable,
                                                        input.checked
                                                    )
                                                }}
                                                style="display: none;"
                                            />
                                            <strong
                                                >${variable.dataFieldLongName}</strong
                                            ><br />
                                            <span
                                                >${metadata} •
                                                <a
                                                    target="_blank"
                                                    href="${variable.dataProductDescriptionUrl}"
                                                    >[${variable.dataProductShortName}_${variable.dataProductVersion}]</a
                                                ></span
                                            >
                                        </label>

                                        <sl-drawer contained>
                                            <h4 slot="label">
                                                <strong>Science Name</strong><br />
                                                ${variable.dataFieldLongName}
                                            </h4>
                                            <p>
                                                <strong>Spatial Resolution</strong
                                                ><br />
                                                ${variable.dataProductSpatialResolution}
                                            </p>
                                            <p>
                                                <strong>Temporal Coverage</strong
                                                ><br />
                                                ${variable.dataProductBeginDateTime}&puncsp;&ndash;&puncsp;${variable.dataProductEndDateTime}
                                            </p>
                                            <p>
                                                <strong>Region Coverage</strong><br />
                                                ${variable.dataProductWest},${variable.dataProductSouth},${variable.dataProductEast},${variable.dataProductNorth}
                                            </p>
                                            <p>
                                                <strong>Dataset</strong><br />
                                                ${variable.dataProductShortName}_${variable.dataProductVersion}
                                            </p>
                                        </sl-drawer>

                                        <terra-button
                                            @click=${(event: Event) => {
                                                const button =
                                                    event.currentTarget as HTMLElement
                                                const drawer = button
                                                    .closest('.variable')
                                                    ?.querySelector(
                                                        'sl-drawer'
                                                    ) as SlDrawer

                                                drawer.show()
                                            }}
                                            aria-label="View variable details."
                                            circle
                                            class="variable-details-button"
                                            outline
                                            type="button"
                                        >
                                            <slot name="label">
                                                <terra-icon
                                                    font-size="1.5em"
                                                    library="heroicons"
                                                    name="outline-information-circle"
                                                ></terra-icon>
                                            </slot>
                                        </terra-button>
                                    </div>
                                </li>
                            `
                        })}
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

                    <terra-variable-keyword-search
                        @terra-search=${this.handleSearch}
                    ></terra-variable-keyword-search>
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
