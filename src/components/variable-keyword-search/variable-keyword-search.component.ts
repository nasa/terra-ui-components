import Fuse from 'fuse.js'
import { LitElement, html, nothing, type CSSResultGroup } from 'lit'
import { property, state } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { ref } from 'lit/directives/ref.js'
import TerraElement from '../../internal/terra-element.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraButton from '../button/button.js'
import TerraIcon from '../icon/icon.js'
import { FetchController } from './variable-keyword-search.controller.js'
import styles from './variable-keyword-search.styles.js'
import type { ListItem } from './variable-keyword-search.types.js'
import { clearSelection, renderSearchResult, walkToOption } from './lib.js'

/**
 * @summary Fuzzy-search for dataset keywords in combobox with list autocomplete.
 * @documentation https://disc.gsfc.nasa.gov/components/giovanni-serch
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
 * @cssproperty --label-height - The height of the input's label element.
 *
 * @event terra-variable-keyword-search-change - Emitted when an option is selected.
 * @event terra-search - Emitted when the component is triggering a search (like a form triggering submit).
 */
export default class TerraVariableKeywordSearch extends TerraElement {
    static dependencies = {
        'terra-button': TerraButton,
        'terra-icon': TerraIcon,
    }
    static styles: CSSResultGroup = [componentStyles, styles]
    static shadowRootOptions = {
        ...LitElement.shadowRootOptions,
        delegatesFocus: true,
    }

    static tagName = 'terra-variable-keyword-search'

    static initialQuery = ''

    #combobox: HTMLInputElement | null = null

    #fetchController = new FetchController(this)

    #listbox: HTMLUListElement | null = null

    #searchEngine: Fuse<ListItem> | null = null

    #walker: TreeWalker | null = null

    /**
     * Label the combobox with this.
     * @example Search All Variables
     */
    @property()
    label = 'Enter search terms (e.g., precipitation, AOD)'

    /**
     * Set a placeholder for the combobox with this.
     * Defaults to the label's value.
     */
    @property()
    placeholder: string

    /**
     * Hide the combobox's label text.
     * When hidden, still presents to screen readers.
     */
    @property({ attribute: 'hide-label', type: Boolean })
    hideLabel = true

    /** type can be `Boolean`, `String`, `Number`, `Object`, or `Array` */
    @property({ reflect: false, type: Object })
    searchConfig = {
        //* @see {@link https://www.fusejs.io/api/options.html#options}
        keys: ['id'],
        useExtendedSearch: true,
    }

    @property()
    value: string

    @state()
    isExpanded = false

    @state()
    query = TerraVariableKeywordSearch.initialQuery

    @state()
    searchResults: ListItem[] = []

    @watch('value')
    async valueChanged(_oldValue: string, newValue: string) {
        this.query = newValue
    }

    connectedCallback() {
        super.connectedCallback()

        //* set a window-level event listener to detect clicks that should close the listbox
        globalThis.addEventListener('click', this.#manageListboxVisibility)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        globalThis.removeEventListener('click', this.#manageListboxVisibility)
    }

    clear() {
        this.query = TerraVariableKeywordSearch.initialQuery
    }

    close() {
        this.isExpanded = false
    }

    toggle() {
        this.isExpanded = !this.isExpanded
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

        //* It's possible to click on elements that are not an option, so filter out anything not role="option".
        const [target] = path.filter(
            eventTarget => (eventTarget as HTMLElement).role === 'option'
        )

        if (!target) {
            return
        }

        this.#selectOption(target as HTMLLIElement)
        this.#handleSearch(this.query)
    }

    #handleKeydown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowDown': {
                if (!this.isExpanded) {
                    return
                }

                clearSelection(
                    this.#combobox as HTMLInputElement,
                    this.#listbox as HTMLUListElement
                )

                walkToOption(
                    this.#walker as TreeWalker,
                    this.#combobox as HTMLInputElement,
                    'next'
                )

                break
            }

            case 'ArrowUp': {
                if (!this.isExpanded) {
                    return
                }

                clearSelection(
                    this.#combobox as HTMLInputElement,
                    this.#listbox as HTMLUListElement
                )

                walkToOption(
                    this.#walker as TreeWalker,
                    this.#combobox as HTMLInputElement,
                    'previous'
                )

                break
            }

            case 'Enter': {
                const currentNode = this.#walker?.currentNode as HTMLLIElement
                //* Only select options. We manage listbox visibility and the options are not always rendered; the TreeWalker defaults to root node when in this state.
                if (currentNode.role === 'option') {
                    //* Pressing 'Enter' is like clicking an option; we choose it, not just walk to it.
                    this.#selectOption(currentNode)
                }

                //* Pressing 'Enter' also triggers a search.
                this.#handleSearch(this.query)

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
                    this.query = TerraVariableKeywordSearch.initialQuery
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
                TerraVariableKeywordSearch.tagName
        )

        if (!containedThis) {
            this.isExpanded = false
        }
    }

    #selectOption = (option: HTMLLIElement) => {
        this.query = option.id
        this.emit('terra-variable-keyword-search-change', { detail: option.id })

        this.isExpanded = false

        clearSelection(
            this.#combobox as HTMLInputElement,
            this.#listbox as HTMLUListElement
        )
    }

    #handleSearch(query: string) {
        if (query.length) {
            this.emit('terra-search', { detail: this.query })
        }
    }

    #clearSearch() {
        this.query = TerraVariableKeywordSearch.initialQuery
        this.emit('terra-search', { detail: this.query })

        clearSelection(
            this.#combobox as HTMLInputElement,
            this.#listbox as HTMLUListElement
        )

        this.#combobox?.focus()
    }

    render() {
        return html`<search part="base" title="Search through the list.">
            <label for="combobox" class=${this.hideLabel ? 'sr-only' : 'input-label'}
                >${this.label}</label
            >
            <div class="search-input-group">
                <terra-button
                    @click=${() => this.#handleSearch(this.query)}
                    aria-label=${this.query
                        ? `Search for ${this.query}.`
                        : 'Enter search term to enable search.'}
                    circle
                    class="search-button search-input-button"
                    outline
                    tabindex="-1"
                    type="button"
                >
                    <slot name="label">
                        <terra-icon
                            font-size="1.5em"
                            library="heroicons"
                            name="outline-magnifying-glass"
                        ></terra-icon>
                    </slot>
                </terra-button>

                <input
                    ${ref(el => {
                        if (el) {
                            this.#combobox ??= el as HTMLInputElement
                        }
                    })}
                    aria-autocomplete="list"
                    aria-controls="listbox"
                    aria-haspopup="list"
                    aria-expanded=${this.isExpanded}
                    autocomplete="off"
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

                ${this.query.length
                    ? html`<terra-button
                          @click=${() => this.#clearSearch()}
                          aria-label="Clear the searched term and start over."
                          circle
                          class="clear-button search-input-button"
                          outline
                          tabindex="-1"
                          type="button"
                      >
                          <slot name="label">
                              <terra-icon
                                  font-size="1.5em"
                                  library="heroicons"
                                  name="outline-x-circle"
                              ></terra-icon>
                          </slot>
                      </terra-button>`
                    : nothing}
            </div>

            <ul
                ${ref(el => {
                    if (el) {
                        this.#listbox ??= el as HTMLUListElement
                    }
                })}
                ?inert=${!this.isExpanded}
                ?open=${this.isExpanded}
                @click=${this.#handleOptionClick}
                aria-label=${this.query
                    ? `Keywords Matching ${this.query}`
                    : 'Keywords'}
                id="listbox"
                part="listbox"
                role="listbox"
                class="search-results"
            >
                ${this.#fetchController.render({
                    initial: () =>
                        html`<li class="updating">Updating List of Keywords</li>`,
                    pending: () =>
                        html`<li class="updating">Updating List of Keywords</li>`,
                    complete: list => {
                        //* @see {@link https://www.fusejs.io/api/options.html}
                        this.#searchEngine = new Fuse(list as any, this.searchConfig)

                        //* This needs to get reassigned on render, as this listbox's renderable nodes will change based on the active query.
                        this.#walker = document.createTreeWalker(
                            this.#listbox as HTMLUListElement,
                            NodeFilter.SHOW_ELEMENT,
                            node => {
                                return ['option', 'listbox'].includes(
                                    (node as HTMLElement).role ?? ''
                                )
                                    ? NodeFilter.FILTER_ACCEPT
                                    : NodeFilter.FILTER_SKIP
                            }
                        )

                        return map(this.searchResults, renderSearchResult)
                    },
                    // TODO: Consider a more robust error strategy...like retry w/ backoff?
                    error: errorMessage =>
                        html`<li class="error">${errorMessage}</li>`,
                })}
            </ul>
        </search>`
    }
}
