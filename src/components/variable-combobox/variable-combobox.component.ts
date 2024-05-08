import Fuse from 'fuse.js'
import { LitElement, html, nothing, type CSSResultGroup } from 'lit'
import { property, state } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js'
import { map } from 'lit/directives/map.js'
import { ref } from 'lit/directives/ref.js'
import EduxElement from '../../internal/edux-element.js'
import componentStyles from '../../styles/component.styles.js'
import {
    clearSelection,
    groupDocsByCollection,
    removeEmptyCollections,
    renderSearchResult,
    walkToOption,
} from './lib.js'
import { FetchController, type ListItem } from './variable-combobox.controller.js'
import styles from './variable-combobox.styles.js'

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
 */
export default class EduxVariableCombobox extends EduxElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    static shadowRootOptions = {
        ...LitElement.shadowRootOptions,
        delegatesFocus: true,
    }

    static tagName = 'edux-variable-combobox'

    static initialQuery = ''

    #combobox: HTMLInputElement | null = null

    #fetchController = new FetchController(this)

    #searchableList: ListItem[] = []

    #listbox: HTMLUListElement | null = null

    #searchEngine: Fuse<ListItem> | null = null

    #walker: TreeWalker | null = null

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
    @property({ attribute: 'hide-help', type: Boolean })
    hideHelp = false

    /**
     * Hide the combobox's label text.
     * When hidden, still presents to screen readers.
     */
    @property({ attribute: 'hide-label', type: Boolean })
    hideLabel = false

    @state()
    isExpanded = false

    @state()
    query = EduxVariableCombobox.initialQuery

    @state()
    searchResults: ListItem[] = []

    connectedCallback() {
        super.connectedCallback()

        //* set a window-level event listener to detect clicks that should close the listbox
        globalThis.addEventListener('click', this.#manageListboxVisibility)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        globalThis.addEventListener('click', this.#manageListboxVisibility)
    }

    #dispatchChange = (stringifiedData: string) => {
        this.emit('edux-combobox-change', { detail: JSON.parse(stringifiedData) })
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
            .map(({ item }) => item) as ListItem[]
    }

    #handleOptionClick = (event: Event) => {
        const path = event.composedPath()

        const [target] = path.filter(
            eventTarget => (eventTarget as HTMLElement).role === 'option'
        )

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
                } else {
                    this.query = EduxVariableCombobox.initialQuery
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
                EduxVariableCombobox.tagName
        )

        if (!containedThis) {
            this.isExpanded = false
        }
    }

    #selectOption = (option: HTMLLIElement) => {
        const { longName, eventDetail } = option.dataset

        this.query = `${longName}`
        this.#dispatchChange(eventDetail as string)

        this.isExpanded = false

        clearSelection(
            this.#combobox as HTMLInputElement,
            this.#listbox as HTMLUListElement
        )
    }

    render() {
        return html`<search part="base" title="Search through the list.">
            <label
                for="combobox"
                class=${this.hideLabel ? 'sr-only' : 'search-input-label'}
                >${this.label}</label
            >
            <div class="search-input-group">
                <input
                    ${ref(el => {
                        if (el) {
                            this.#combobox ??= el as HTMLInputElement
                        }
                    })}
                    aria-autocomplete="list"
                    aria-controls="listbox"
                    aria-expanded=${this.isExpanded}
                    class="combobox"
                    id="combobox"
                    part="combobox"
                    role="combobox"
                    type="text"
                    .placeholder=${this.placeholder ?? `${this.label}…`}
                    .value=${this.query}
                    @input=${this.#handleComboboxChange}
                    @keydown=${this.#handleKeydown}
                />
                <button
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
                        ? html`<svg
                              aria-hidden="true"
                              class="button-icon chevron"
                              focusable="false"
                              viewBox="0 0 400 400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                          >
                              <path
                                  d="m4.2 122.2 195.1 195.1 196.5-196.6-37.9-38-157.8 157.8-156.8-156.8z"
                              ></path>
                          </svg> `
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
                </button>

                ${this.hideHelp
                    ? nothing
                    : html`<p class="search-help">
                          See
                          <a
                              href="https://www.fusejs.io/examples.html#extended-search"
                              rel="noopener noreferrer"
                              target="_blank"
                              >extended search syntax
                              <svg
                                  aria-hidden="true"
                                  class="external-link"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                              >
                                  <path
                                      d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
                                  /></svg></a
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
                        this.#searchableList = list

                        //* @see {@link https://www.fusejs.io/api/options.html}
                        this.#searchEngine = new Fuse(list, {
                            //* @see https://www.fusejs.io/examples.html#nested-search
                            findAllMatches: true,
                            keys: ['longName', 'units'],
                            useExtendedSearch: true,
                        })
                    },
                    // TODO: Consider a more robust error strategy...like retry w/ backoff?
                    error: errorMessage =>
                        html`<li class="error">${errorMessage}</li>`,
                })}
                ${cache(
                    this.query === EduxVariableCombobox.initialQuery
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
                )}
            </ul>
        </search>`
    }
}
