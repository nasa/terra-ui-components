import componentStyles from '../../styles/component.styles.js'
import styles from './browse-variables.styles.js'
import TerraAccordion from '../accordion/accordion.component.js'
import TerraDivider from '../divider/divider.component.js'
import TerraButton from '../button/button.component.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import TerraLoader from '../loader/loader.component.js'
import TerraSkeleton from '../skeleton/skeleton.component.js'
import TerraVariableKeywordSearch from '../variable-keyword-search/variable-keyword-search.component.js'
import TerraAlert from '../alert/alert.component.js'
import { BrowseVariablesController } from './browse-variables.controller.js'
import { getRandomIntInclusive } from '../../utilities/number.js'
import { html, nothing } from 'lit'
import { property, state } from 'lit/decorators.js'
import { watch } from '../../internal/watch.js'
import { QueryClientMixin } from '../../mixins/query-client.mixin.js'
import type { TerraVariableKeywordSearchChangeEvent } from '../../events/terra-variable-keyword-search-change.js'
import type { TerraSelectEvent } from '../../events/terra-select.js'
import type { CSSResultGroup } from 'lit'
import type {
    FacetField,
    FacetsByCategory,
    SelectedFacets,
    Variable,
} from './browse-variables.types.js'
import { getSortLabel, SortOrder } from '../../utilities/sort.js'

/**
 * @summary Browse through the NASA CMR or Giovanni catalogs.
 * @documentation https://terra-ui.netlify.app/components/browse-variables
 * @status stable
 * @since 1.0
 *
 * @emits terra-variables-change - emitted when the user selects or unselects variables
 *
 * @dependency terra-variable-keyword-search
 * @dependency terra-button
 * @dependency terra-skeleton
 * @dependency terra-icon
 * @dependency terra-loader
 * @dependency terra-divider
 * @dependency terra-accordion
 */
export default class TerraBrowseVariables extends QueryClientMixin(
    TerraElement,
) {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-variable-keyword-search': TerraVariableKeywordSearch,
        'terra-button': TerraButton,
        'terra-skeleton': TerraSkeleton,
        'terra-icon': TerraIcon,
        'terra-loader': TerraLoader,
        'terra-alert': TerraAlert,
        'terra-accordion': TerraAccordion,
        'terra-divider': TerraDivider,
    }

    /** Screen size detection use to determine layout for mobile devices */

    @state() 
    isMobile = false

    private mediaQuery = window.matchMedia('(max-width: 600px)');
    
    connectedCallback() {
        super.connectedCallback();

        this.isMobile = this.mediaQuery.matches;
        this.mediaQuery.addEventListener('change', this.handleMediaChange);
    }

    disconnectedCallback() {
        this.mediaQuery.removeEventListener('change', this.handleMediaChange);

        super.disconnectedCallback();
    }

    private handleMediaChange = (event: MediaQueryListEvent) => {
        this.isMobile = event.matches;
    };


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

    @state()
    private activeIndex: number | undefined = undefined

    @state()
    private mobileDetailsIndex: number | undefined = undefined

    @state()
    private sortOrder: SortOrder | string = SortOrder.AtoZ

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
                'input[name="observation"]:checked',
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
        selectOneFieldAtATime: boolean = false,
    ) {
        const existingFields = this.selectedFacets[facet] || []

        if (existingFields.includes(field)) {
            // already selected, unselect it
            this.#unselectFacetField(facet, field)
            return
        }

        this.selectedFacets = {
            ...this.selectedFacets,
            [facet]: selectOneFieldAtATime
                ? [field]
                : [...existingFields, field],
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

        const filteredFields = this.selectedFacets[facet].filter(
            (f) => f !== field,
        ) // remove the given field

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
            (v) => v.dataFieldLongName === variable.dataFieldLongName,
        )

        if (checked && !variableIsSelected) {
            // need to add variable to list of selected variables
            this.selectedVariables = ([] as Variable[]).concat(
                this.selectedVariables,
                variable,
            )
        } else if (!checked && variableIsSelected) {
            // need to remove variable from list of selected variables
            this.selectedVariables = this.selectedVariables.filter(
                (v) => v.dataFieldLongName !== variable.dataFieldLongName,
            )
        }
    }

    private handleMobileVariableClick(index: number) {
        if (this.mobileDetailsIndex === index) {    // Close the details panel if it's already open for this variable
            this.mobileDetailsIndex = undefined
            return
        }
        this.mobileDetailsIndex = index             // Open the details panel for this variable
    }

    private handleDetailClose() {
        const index = this.mobileDetailsIndex
        this.mobileDetailsIndex = undefined

        if (index === undefined) {
            return
        }
    }

    #handleSortChange(event: TerraSelectEvent) {
        const selectedItem = event.detail.item
        const value = selectedItem.value
        if (value === SortOrder.AtoZ || value === SortOrder.ZtoA) {
            this.sortOrder = value
            // Ensure only the selected item is checked (radio button behavior)
            // Wait for the next frame to ensure the menu's toggle has completed
            requestAnimationFrame(() => {
                const menu = event.target as HTMLElement
                const allItems = menu.querySelectorAll('terra-menu-item')
                allItems.forEach((item) => {
                    const itemValue = item.value
                    if (itemValue === this.sortOrder) {
                        item.checked = true
                    } else {
                        item.checked = false
                    }
                })
            })
        }
    }

    #getSortedVariables(): Variable[] {
        const variables = this.#controller.variables
        const sorted = [...variables].sort((a, b) => {
            const nameA = a.dataFieldLongName.toLowerCase()
            const nameB = b.dataFieldLongName.toLowerCase()
            if (this.sortOrder === SortOrder.AtoZ) {
                return nameA.localeCompare(nameB)
            } else {
                return nameB.localeCompare(nameA)
            }
        })
        return sorted
    }

    #getBrowsingText(): string {
        // Collect all selected facet field names
        const selectedFacetNames: string[] = []
        Object.values(this.selectedFacets).forEach((fields) => {
            selectedFacetNames.push(...fields)
        })

        const hasFacets = selectedFacetNames.length > 0
        const hasQuery = !!this.searchQuery

        // Show nothing if there's no facets and no query
        if (!hasFacets && !hasQuery) {
            return ''
        }

        let text = 'Browsing'

        // Add facet names if present
        if (hasFacets) {
            if (selectedFacetNames.length === 1) {
                text += ` '${selectedFacetNames[0]}'`
            } else if (selectedFacetNames.length === 2) {
                text += ` '${selectedFacetNames[0]}' and '${selectedFacetNames[1]}'`
            } else {
                // Three or more: "A', 'B', and 'C"
                const allButLast = selectedFacetNames.slice(0, -1)
                const last = selectedFacetNames[selectedFacetNames.length - 1]
                text += ` '${allButLast.join("', '")}', and '${last}'`
            }
            text += ' variables'
        } else {
            // No facets, just "Browsing variables"
            text += ' variables'
        }

        // Add query if present
        if (hasQuery) {
            text += ` for query \`${this.searchQuery}\``
        }

        return text
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

                    ${
                        this.#controller.facetsByCategory?.observations.length
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
                                  (field) =>
                                      html`<label>
                                          <input
                                              type="radio"
                                              name="observation"
                                              value=${field.name}
                                              @change=${this.handleObservationChange}
                                          />
                                          ${field.name}
                                      </label>`,
                              )}
                          `
                            : html`<terra-skeleton
                              rows="4"
                              variableWidths
                          ></terra-skeleton>`
                    }

                    <terra-button
                        variant="text"
                        size
                        @click=${() => (this.showVariablesBrowse = true)}
                        >View All Now</terra-button
                    >
                </aside>

                <main>
                    ${columns.map(
                        (column) => html`
                            <div class="column">
                                <h3>${column.title}</h3>
                                <ul role="list">
                                    ${
                                        this.#controller.facetsByCategory?.[
                                            column.facetKey
                                        ]
                                            ?.filter((field) => field.count > 0)
                                            .map(
                                                (field) =>
                                                    html`<li
                                                    role="button"
                                                    tabindex="0"
                                                    aria-selected="false"
                                                    data-facet=${column.facetKey}
                                                    @click=${this.toggleFacetSelect}
                                                >
                                                    ${field.name}
                                                </li>`,
                                            ) ??
                                        html`<terra-skeleton
                                        rows=${getRandomIntInclusive(8, 12)}
                                        variableWidths
                                    ></terra-skeleton>`
                                    }
                                </ul>
                            </div>
                        `,
                    )}
                </main>
            </div>
        `
    }

    #renderFacet(
        facetKey: string,
        title: string,
        fields?: FacetField[],
        open?: boolean,
    ) {
        // Check if there are any fields with count > 0
        const hasValidFields = (fields ?? []).some((field) => field.count > 0)

        if (!hasValidFields) {
            return nothing
        }

        return html`<details ?open=${open}>
            <summary>${title}</summary>

            ${(fields ?? []).map((field) =>
                field.count > 0
                    ? html`
                          <div class="facet">
                              <label
                                  ><input
                                      type="checkbox"
                                      @change=${() =>
                                          this.#selectFacetField(
                                              facetKey,
                                              field.name,
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
                    : nothing,
            )}
        </details>`
    }

    #renderVariableDetails(index: number) {

        const variables = this.#getSortedVariables()
        const variable = variables[index]

        return html`
                <div class="sticky-element">
                    <p>
                        <label
                            ><strong>Name in Data File:</strong></label
                        >
                        ${
                            variable.dataFieldShortName
                        }
                    </p>
                    <p>
                        <label><strong>Units:</strong></label>
                        ${variable.dataFieldUnits}
                    </p>
                    <p>
                        <label
                            ><strong>Temporal Coverage:</strong></label
                        >
                        ${
                            variable.dataProductBeginDateTime
                        }
                        –
                        ${
                            variable.dataProductEndDateTime
                        }
                    </p>
                    <p>
                        <label><strong>Region Coverage:</strong></label>
                        ${variable.dataProductWest},
                        ${variable.dataProductSouth},
                        ${variable.dataProductEast},
                        ${variable.dataProductNorth}
                    </p>
                    <p>
                        <label
                            ><strong>Spatial Resolution:</strong></label
                        >
                        ${
                            variable.dataProductSpatialResolution
                        }
                    </p>
                    <p>
                        <label><strong>Dataset:</strong></label>
                        ${
                            variable.dataProductShortName
                        }_${
                            variable.dataProductVersion
                        }
                    </p>
                </div>
            `
    }

    #renderVariablesBrowse(loading?: boolean) {
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

        const browsingText = this.#getBrowsingText()

        return html`<div class="scrollable variables-container">
            <header>
                <div class="research-area">${browsingText}</div>

                <menu>
                    <li>
                        <terra-dropdown
                            class="list-menu-dropdown"
                            placement="bottom-end"
                        >
                            <terra-button
                                slot="trigger"
                                variant="default"
                                outline
                                caret
                                >Sort by ${getSortLabel(this.sortOrder)}</terra-button
                            >
                            <terra-menu @terra-select=${this.#handleSortChange}>
                                <terra-menu-item
                                    type="checkbox"
                                    value="aToZ"
                                    ?checked=${this.sortOrder === SortOrder.AtoZ}
                                    >A to Z</terra-menu-item
                                >
                                <terra-menu-item
                                    type="checkbox"
                                    value="zToA"
                                    ?checked=${this.sortOrder === SortOrder.ZtoA}
                                    >Z to A</terra-menu-item
                                >
                            </terra-menu>
                        </terra-dropdown>
                    </li>
                    <!--
                    <li>
                        <terra-dropdown class="list-menu-dropdown">
                            <terra-button slot="trigger" caret>Group By</terra-button>
                            <terra-menu>
                                <terra-menu-item value="depths"
                                    >Depths</terra-menu-item
                                >
                                <terra-menu-item value="disciplines"
                                    >Disciplines</terra-menu-item
                                >
                                <terra-menu-item value="measurements"
                                    >Measurements</terra-menu-item
                                >
                                <terra-menu-item value="observations"
                                    >Observations</terra-menu-item
                                >
                                <terra-menu-item value="platformInstruments"
                                    >Platform Instruments</terra-menu-item
                                >
                                <terra-menu-item value="portals"
                                    >Portals</terra-menu-item
                                >
                                <terra-menu-item value="spatialResolutions"
                                    >Spatial Resolutions</terra-menu-item
                                >
                                <terra-menu-item value="specialFeatures"
                                    >Special Features</terra-menu-item
                                >
                                <terra-menu-item value="temporalResolutions"
                                    >Temporal Resolutions</terra-menu-item
                                >
                                <terra-menu-item value="wavelengths"
                                    >Wavelengths</terra-menu-item
                                >
                            </terra-menu>
                        </terra-dropdown>
                    </li>
                    -->
                </menu>
            </header>

            ${this.isMobile
                ? html `
                    <aside>
                        <terra-accordion summary="Filter Results">
                            ${facets.map((facet) =>
                                this.#renderFacet(
                                    facet.facetKey,
                                    facet.title,
                                    this.#controller.facetsByCategory?.[facet.facetKey],
                                    facet.open,
                                ),
                            )}
                        </terra-accordion>
                    </aside>

                    <main>
                        ${this.#renderMobileVariablesList(Boolean(loading))}
                    </main>`
                : html `
                    <aside>
                        <h3>Filter</h3>

                        ${facets.map((facet) =>
                            this.#renderFacet(
                                facet.facetKey,
                                facet.title,
                                this.#controller.facetsByCategory?.[facet.facetKey],
                                facet.open,
                            ),
                        )}
                    </aside>

                    <main>
                        ${this.#renderVariablesList(Boolean(loading))}
                    </main>`
                }

        </div> `
    }

    #renderVariablesList(loading?: boolean) {
        const variables = this.#getSortedVariables()

        return html`
            <!-- LEFT COLUMN -->
            <section class="left-column">
                <ul class="variable-list">
                    ${
                        !loading && !variables.length
                            ? html`
                        <terra-alert variant="primary" appearance="white" open>
                            <p>We didn't find any variables matching your search and filters.</p>
                            <p>Please note: This is a beta release and may not have the full Giovanni catalog available yet. We are working on adding more variables and improving the search and filter capabilities, so please check back soon!</p>
                        </terra-alert>
                    `
                            : nothing
                    }

                    ${variables.map(
                        (variable, index) => html`
                            <li
                                aria-selected="false"
                                class="variable-list-item"
                                @mouseenter=${() => (this.activeIndex = index)}
                                @mouseleave=${() =>
                                    (this.activeIndex = undefined)}
                                @focusin=${() => (this.activeIndex = index)}
                                @focusout=${() => (this.activeIndex = undefined)}
                                @click=${(event: Event) => {
                                    const target =
                                        event.currentTarget as HTMLLIElement
                                    const targetCheckbox =
                                        target.querySelector(
                                            'input[type="checkbox"]',
                                        ) as HTMLInputElement | null

                                    if (!targetCheckbox) {
                                        return
                                    }

                                    target?.setAttribute(
                                        'aria-selected',
                                        `${targetCheckbox.checked}`,
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
                                                    input.checked,
                                                )
                                            }}
                                        />
                                        <strong
                                            >${variable.dataFieldLongName}</strong
                                        >
                                        <span
                                            >${variable.dataProductShortName}_${variable.dataProductVersion}
                                            &bull;
                                            ${variable.dataProductTimeInterval}
                                            &bull;
                                            ${variable.dataProductSpatialResolution}</span
                                        >
                                    </label>
                                </div>
                            </li>
                        `,
                    )}
                </ul>
            </section>

            <!-- RIGHT COLUMN -->
            ${
                !loading && !variables.length
                    ? nothing
                    : html`
                        <section class="variable-details">
                        ${
                            this.activeIndex !== undefined
                                ? this.#renderVariableDetails(this.activeIndex ?? 0)
                                : html`<p class="placeholder">
                                        Hover over a variable to see details
                                    </p>`
                        }
                        </section>
                    `
            }
        `
    }

    #renderMobileVariablesList(loading?: boolean) {

        const variables = this.#getSortedVariables()

        return html`
            <section>
                <ul class="variable-list">
                    ${
                        !loading && !variables.length
                            ? html`
                        <terra-alert variant="primary" appearance="white" open>
                            <p>We didn't find any variables matching your search and filters.</p>
                            <p>Please note: This is a beta release and may not have the full Giovanni catalog available yet. We are working on adding more variables and improving the search and filter capabilities, so please check back soon!</p>
                        </terra-alert>
                    `
                        : nothing
                    }

                    ${variables.map(
                        (variable, index) => html`
                            <li
                                data-variable-index=${index}
                                class="variable-list-item"
                            >
                                <div class="variable">
                                    <input
                                        data-variable=${variable}
                                        type="checkbox"
                                        @click=${(event: Event) =>
                                            event.stopPropagation()}
                                        @change=${(e: Event) => {
                                            const input =
                                                e.currentTarget as HTMLInputElement

                                            this.#handleVariableSelection(
                                                variable,
                                                input.checked,
                                            )
                                        }}
                                    />
                                    <label 
                                        @click=${() =>
                                            this.handleMobileVariableClick(index)}
                                    >
                                        <strong>
                                            ${variable.dataFieldLongName}
                                        </strong>
                                        <span>
                                            ${variable.dataProductShortName}_${variable.dataProductVersion}
                                            <ul class="resolution-info">
                                                <li>
                                                    ${variable.dataProductTimeInterval}
                                                </li>
                                                <li>
                                                    ${variable.dataProductSpatialResolution}
                                                </li>
                                            </ul>
                                        </span>
                                    </label>
                                </div>
                                ${
                                    this.mobileDetailsIndex === index
                                        ? html`
                                            <div class="variable-details">
                                                <span>
                                                    <terra-divider></terra-divider>
                                                    <terra-button outline circle size="small"
                                                        @click=${(event: Event) =>
                                                            {
                                                                event.stopPropagation()
                                                                this.handleDetailClose()
                                                            }}
                                                    >
                                                    <slot name="label">
                                                        <terra-icon name="outline-x-mark" library="heroicons" font-size="1.5em"></terra-icon>
                                                    </slot>
                                                    </terra-button>                                                </span>
                                                ${this.#renderVariableDetails(index)}
                                            </div>
                                        `
                                        : nothing
                                }
                            </li>
                        `,
                    )}
                </ul>
            </section>
        `
    }

    render() {
        const showLoader =
            this.#controller.isPending && // only show the loader when doing a fetch
            this.#controller.facetsByCategory // we won't show the loader initially, we'll show skeleton loading instead

        return html`
            <div class="container">
                <header class="search">
                    ${
                        this.showVariablesBrowse
                            ? html`
                              <terra-button @click=${this.reset}>
                                  <terra-icon
                                      name="solid-chevron-left"
                                      library="heroicons"
                                      font-size="1.5em"
                                  ></terra-icon>
                              </terra-button>
                          `
                            : nothing
                    }

                    <terra-variable-keyword-search
                        @terra-search=${this.handleSearch}
                    ></terra-variable-keyword-search>
                </header>

                ${
                    this.isMobile
                        ? console.log('Mobile view')
                        : console.log('Desktop view')
                }

                ${
                    this.showVariablesBrowse
                        ? this.#renderVariablesBrowse(Boolean(showLoader))
                        : this.#renderCategorySelect()
                }

                <dialog ?open=${showLoader}>
                    <terra-loader indeterminate></terra-loader>
                </dialog>
            </div>
        `
    }

    getVariable(variableEntryId: string) {
        return this.#controller.getVariable(variableEntryId)
    }
}
