import Fuse from 'fuse.js'
import { LitElement, html, nothing, type CSSResultGroup } from 'lit'
import { property, state } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js'
import { map } from 'lit/directives/map.js'
import { ref } from 'lit/directives/ref.js'
import TerraElement from '../../internal/terra-element.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraButton from '../button/button.js'
import TerraIcon from '../icon/icon.js'
import {
    adaptValueToVariableMetadata,
    clearSelection,
    groupDocsByCollection,
    removeEmptyCollections,
    renderSearchResult,
    walkToOption,
} from './lib.js'
import { FetchController } from './variable-combobox.controller.js'
import styles from './variable-combobox.styles.js'
import type { ListItem } from './variable-combobox.types.js'

/**
 * @summary Fuzzy-search for dataset variables in combobox with list autocomplete.
 * @documentation https://disc.gsfc.nasa.gov/components/variable-combobox
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 * @status MVP
 * @since 1.0
 *
 * @csspart base - A `search` element, the component's base.
 * @csspart combobox - An `input` element used for searching.
 * @csspart button - A `button` used for toggling the listbox's visibility.
 * @csspart listbox - A `ul` that holds the clickable options.
 *
 * @cssproperty --host-height - The height of the host element.
 * @cssproperty --help-height - The height of the search help element.
 * @cssproperty --label-height - The height of the input's label element.
 *
 * @event terra-combobox-change - Emitted when an option is selected.
 */
export default class TerraVariableCombobox extends TerraElement {
    static dependencies = {
        'terra-button': TerraButton,
        'terra-icon': TerraIcon,
    }
    static styles: CSSResultGroup = [componentStyles, styles]
    static shadowRootOptions = {
        ...LitElement.shadowRootOptions,
        delegatesFocus: true,
    }

    static tagName = 'terra-variable-combobox'

    static initialQuery = ''

    #combobox: HTMLInputElement | null = null

    #fetchController: FetchController

    #searchableList: ListItem[] = []

    #listbox: HTMLUListElement | null = null

    #searchEngine: Fuse<ListItem> | null = null

    #walker: TreeWalker | null = null

    #tagContainer: HTMLDivElement | null = null

    /**
     * Label the combobox with this.
     * @example Search All Variables
     */
    @property()
    label = 'Search for Variables'

    /**
     * Set a placeholder for the combobox with this.
     * Defaults to the label's value.
     */
    @property()
    placeholder: string

    /**
     * Hide the combobox's help text.
     * When hidden, not rendered at all.
     */
    @property({ attribute: 'hide-help', type: Boolean, reflect: true })
    hideHelp = false

    /**
     * Hide the combobox's label text.
     * When hidden, still presents to screen readers.
     */
    @property({ attribute: 'hide-label', type: Boolean, reflect: true })
    hideLabel = false

    /**
     * Determines if the variable combobox uses tags or plain text to display the query.
     */
    @property({ attribute: 'use-tags', type: Boolean, reflect: true })
    useTags = false

    /**
     * Represents the EntryID (<collection-name>_<variable-name>) of the selected variable.
     * Other components (like the time-series graphing component) will use this.
     */
    @property()
    value: string

    /**
     * The token to be used for authentication with remote servers.
     * The component provides the header "Authorization: Bearer" (the request header and authentication scheme).
     * The property's value will be inserted after "Bearer" (the authentication scheme).
     */
    @property({ attribute: 'bearer-token', reflect: false })
    bearerToken: string

    @state()
    isExpanded = false

    @state()
    query = TerraVariableCombobox.initialQuery

    @state()
    searchResults: ListItem[] = []

    @state()
    tags: string[] = []

    @state()
    tagContainerWidth = 0

    /**
     * This component's value is read by other components.
     * Internally, the variable metdata has slight differences that require adapting.
     */
    @watch('value')
    async valueChanged(oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return
        }

        await this.#fetchController.taskComplete

        const compatibleValue = adaptValueToVariableMetadata(this.value)
        const selectedVariable = this.#fetchController.value?.find(metadata => {
            return compatibleValue === metadata.entryId
        })

        // Update the internal state to match the selected external value.
        if (selectedVariable) {
            this.query = selectedVariable.longName
            this.searchResults = this.#searchEngine
                ?.search(this.query)
                .map(({ item }: any) => item) as ListItem[]

            this.#dispatchChange(selectedVariable.eventDetail)

            if (this.useTags) {
                // Sets one tag, but obviously could be refactored for multiple tags.
                this.tags = [`${selectedVariable.name}`]
                // Clear out the value of the text input, which is decoupled from the query since we're using tags.
                this.#combobox!.value = TerraVariableCombobox.initialQuery
                // Clear out the stored query so that there is no filtering of listbox options.
                this.query = TerraVariableCombobox.initialQuery
            }
        }
    }

    connectedCallback() {
        super.connectedCallback()

        //* instantiate the fetch contoller maybe with a token
        this.#fetchController = new FetchController(this, this.bearerToken)

        //* set a window-level event listener to detect clicks that should close the listbox
        globalThis.addEventListener('click', this.#manageListboxVisibility)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        globalThis.removeEventListener('click', this.#manageListboxVisibility)
    }

    clear() {
        this.query = TerraVariableCombobox.initialQuery
    }

    close() {
        this.isExpanded = false
    }

    toggle() {
        this.isExpanded = !this.isExpanded
    }

    #dispatchChange = (stringifiedData: string) => {
        this.emit('terra-combobox-change', { detail: JSON.parse(stringifiedData) })
    }

    #handleButtonClick = () => {
        this.isExpanded = !this.isExpanded
        this.#combobox?.focus()
    }

    #handleComboboxChange = (event: Event) => {
        const target = event.target as HTMLInputElement
        this.query = target.value

        if (target.value) {
            //* Open (but do not close) the listbox if there's a query.
            this.isExpanded = true
        }

        this.searchResults = this.#searchEngine
            ?.search(target.value)
            .map(({ item }: any) => item) as ListItem[]
    }

    #handleOptionClick = (event: Event) => {
        const path = event.composedPath()

        // filter out anything not role="option"
        const [target] = path.filter(
            eventTarget => (eventTarget as HTMLElement).role === 'option'
        )

        if (!target) {
            return
        }

        this.#selectOption(target as HTMLLIElement)
    }

    #handleKeydown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowDown': {
                clearSelection(
                    this.#combobox as HTMLInputElement,
                    this.#listbox as HTMLUListElement
                )

                if (!this.isExpanded) {
                    this.isExpanded = true
                }

                //* Holding Alt Key should just open the listbox.
                if (event.altKey) {
                    break
                }

                walkToOption(
                    this.#walker as TreeWalker,
                    this.#combobox as HTMLInputElement,
                    'next'
                )

                break
            }

            case 'ArrowUp': {
                clearSelection(
                    this.#combobox as HTMLInputElement,
                    this.#listbox as HTMLUListElement
                )

                if (!this.isExpanded) {
                    this.isExpanded = true
                }

                walkToOption(
                    this.#walker as TreeWalker,
                    this.#combobox as HTMLInputElement,
                    'previous'
                )

                break
            }

            case 'Enter': {
                //* Pressing 'Enter' is like clicking an option; we choose it, not just walk to it.
                this.#selectOption(this.#walker?.currentNode as HTMLLIElement)

                break
            }

            case 'Escape': {
                clearSelection(
                    this.#combobox as HTMLInputElement,
                    this.#listbox as HTMLUListElement
                )

                if (this.isExpanded) {
                    this.isExpanded = false
                    // dispatching a standard event b/c this is a standard DOM event
                    // @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/cancel_event}
                    this.dispatchEvent(new Event('cancel'))
                } else {
                    this.query = TerraVariableCombobox.initialQuery
                }

                break
            }

            default: {
                break
            }
        }
    }

    #manageListboxVisibility = (event: Event) => {
        const path = event.composedPath()
        const containedThis = path.some(
            eventTarget =>
                (eventTarget as HTMLElement).localName ===
                TerraVariableCombobox.tagName
        )

        if (!containedThis) {
            this.isExpanded = false
        }
    }

    #selectOption = (option: HTMLLIElement) => {
        const { longName, eventDetail, name } = option.dataset

        this.query = `${longName}`
        this.#dispatchChange(eventDetail as string)

        this.isExpanded = false

        clearSelection(
            this.#combobox as HTMLInputElement,
            this.#listbox as HTMLUListElement
        )

        if (this.useTags) {
            // Sets one tag, but obviously could be refactored for multiple tags.
            this.tags = [`${name}`]
            // Clear out the value of the text input, which is decoupled from the query since we're using tags.
            this.#combobox!.value = TerraVariableCombobox.initialQuery
            // Clear out the stored query so that there is no filtering of listbox options.
            this.query = TerraVariableCombobox.initialQuery
        }
    }

    #renderTags(tag: string, _index: number) {
        return html`
            <terra-button
                size="small"
                variant="default"
                outline
                class="tag"
                aria-label=${`Clear tag ${tag}`}
                @click=${() => {
                    this.tags = []
                    this.clear()

                    // I dont' love this, but requestUpdate() didn't work...I needed to wait until the tag container has collapsed.
                    setTimeout(() => {
                        this.tagContainerWidth =
                            this.#tagContainer?.getBoundingClientRect()
                                .width as number
                    }, 100)
                }}
            >
                ${tag}
                <terra-icon
                    class="tag-icon"
                    slot="suffix"
                    name="outline-x-circle"
                    library="heroicons"
                ></terra-icon>
            </terra-button>
        `
    }

    render() {
        return html`<search part="base" title="Search through the list.">
            <label for="combobox" class=${this.hideLabel ? 'sr-only' : 'input-label'}
                >${this.label}</label
            >
            <div class="search-input-group">
                ${this.useTags
                    ? html`<div
                          ${ref(el => {
                              if (el) {
                                  this.#tagContainer ??= el as HTMLDivElement
                                  this.tagContainerWidth =
                                      el.getBoundingClientRect().width
                              }
                          })}
                          class="tag-container"
                          id="tag-container"
                      >
                          ${map(this.tags, (value, index) =>
                              this.#renderTags(value, index)
                          )}
                      </div>`
                    : nothing}
                <input
                    ${ref(el => {
                        if (el) {
                            this.#combobox ??= el as HTMLInputElement
                        }
                    })}
                    autocomplete="off"
                    aria-autocomplete="list"
                    aria-controls="listbox"
                    aria-haspopup="list"
                    aria-expanded=${this.isExpanded}
                    class="combobox"
                    id="combobox"
                    part="combobox"
                    role="combobox"
                    type="text"
                    style=${this.useTags
                        ? `padding-inline-start: calc(${this.tagContainerWidth}px + 0.25rem);`
                        : nothing}
                    aria-describedby=${this.useTags ? 'tag-container' : nothing}
                    placeholder=${this.useTags
                        ? nothing
                        : this.placeholder ?? `${this.label}…`}
                    .value=${this.useTags
                        ? TerraVariableCombobox.initialQuery
                        : this.query}
                    @input=${this.#handleComboboxChange}
                    @keydown=${this.#handleKeydown}
                />
                <terra-button
                    shape="square-left"
                    aria-controls="listbox"
                    aria-expanded=${this.isExpanded}
                    aria-label="List of Searchable Variables"
                    class="combobox-button"
                    id="combobox-button"
                    part="button"
                    tabindex="-1"
                    type="button"
                    @click=${this.#handleButtonClick}
                >
                    ${['COMPLETE', 'ERROR'].includes(this.#fetchController.taskStatus)
                        ? html`<terra-icon
                              class="chevron"
                              name="chevron-down"
                          ></terra-icon>`
                        : html`<svg
                              class="button-icon spinner"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                          >
                              <circle
                                  cx="12"
                                  cy="12"
                                  r="9.5"
                                  fill="none"
                                  stroke-width="3"
                              ></circle>
                          </svg>`}
                </terra-button>

                ${this.hideHelp
                    ? nothing
                    : html`<p class="search-help">
                          See
                          <a
                              href="https://www.fusejs.io/examples.html#extended-search"
                              rel="noopener noreferrer"
                              tabindex=${this.isExpanded ? '-1 ' : '0'}
                              target="_blank"
                              >extended search syntax
                              <terra-icon
                                  name="outline-arrow-top-right-on-square"
                                  library="heroicons"
                              ></terra-icon></a
                          >.
                      </p>`}
            </div>

            <ul
                ${ref(el => {
                    if (el) {
                        this.#listbox ??= el as HTMLUListElement

                        //* This needs to get reassigned on render, as this listbox's renderable nodes will change based on the active query.
                        this.#walker = document.createTreeWalker(
                            el,
                            NodeFilter.SHOW_ELEMENT,
                            node => {
                                return (node as HTMLElement).dataset.treeWalker ===
                                    'filter_skip'
                                    ? NodeFilter.FILTER_SKIP
                                    : NodeFilter.FILTER_ACCEPT
                            }
                        )
                    }
                })}
                ?inert=${!this.isExpanded}
                ?open=${this.isExpanded}
                @click=${this.#handleOptionClick}
                aria-label=${this.query
                    ? `Variables Matching ${this.query}`
                    : 'Variables'}
                id="listbox"
                part="listbox"
                role="listbox"
                class="search-results"
            >
                ${this.#fetchController.render({
                    initial: () =>
                        html`<li class="updating">Updating List of Variables</li>`,
                    pending: () =>
                        html`<li class="updating">Updating List of Variables</li>`,
                    complete: list => {
                        //Filter out GPM_3IMERGHH V06 as soon as results arrive
                        const filtered = list.filter(
                            item =>
                                !(
                                    item.collectionShortName === 'GPM_3IMERGHH' &&
                                    item.collectionVersion === '06'
                                )
                        )

                        this.#searchableList = filtered

                        //* @see {@link https://www.fusejs.io/api/options.html}
                        this.#searchEngine = new Fuse(this.#searchableList, {
                            //* @see {@link https://www.fusejs.io/examples.html#nested-search}
                            findAllMatches: true,
                            keys: [
                                'entryId',
                                'longName',
                                'name',
                                'standardName',
                                'units',
                            ],
                            useExtendedSearch: true,
                        })

                        return cache(
                            this.query === TerraVariableCombobox.initialQuery
                                ? map(
                                      removeEmptyCollections(
                                          groupDocsByCollection(this.#searchableList)
                                      ),
                                      renderSearchResult
                                  )
                                : map(
                                      removeEmptyCollections(
                                          groupDocsByCollection(this.searchResults)
                                      ),
                                      renderSearchResult
                                  )
                        )
                    },
                    // TODO: Consider a more robust error strategy...like retry w/ backoff?
                    error: errorMessage =>
                        html`<li class="error" data-tree-walker="filter_skip">
                            ${errorMessage}
                        </li>`,
                })}
            </ul>
        </search>`
    }
}
