import '../../internal/scrollend-polyfill.js'
import { classMap } from 'lit/directives/class-map.js'
import { eventOptions, property, query, state } from 'lit/decorators.js'
import { html } from 'lit'
import { scrollIntoView } from '../../internal/scroll.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import styles from './tabs.styles.js'
import type { CSSResultGroup } from 'lit'
import type TerraTab from '../tab/tab.js'
import type TerraTabPanel from '../tab-panel/tab-panel.js'

/**
 * @summary Tabs organize content into a container that shows one section at a time.
 * @documentation https://terra-ui.netlify.app/components/tabs
 * @status stable
 * @since 1.0
 *
 * @dependency terra-icon
 *
 * @slot - Used for grouping tab panels in the tabs component. Must be `<terra-tab-panel>` elements.
 * @slot nav - Used for grouping tabs in the tabs component. Must be `<terra-tab>` elements.
 *
 * @event {{ name: String }} terra-tab-show - Emitted when a tab is shown.
 * @event {{ name: String }} terra-tab-hide - Emitted when a tab is hidden.
 *
 * @csspart base - The component's base wrapper.
 * @csspart nav - The tabs' navigation container where tabs are slotted in.
 * @csspart tabs - The container that wraps the tabs.
 * @csspart active-tab-indicator - The line that highlights the currently selected tab.
 * @csspart body - The tabs' body where tab panels are slotted in.
 * @csspart scroll-button - The previous/next scroll buttons that show when tabs are scrollable.
 * @csspart scroll-button--start - The starting scroll button.
 * @csspart scroll-button--end - The ending scroll button.
 *
 * @cssproperty --terra-tabs-indicator-color - The color of the active tab indicator.
 * @cssproperty --terra-tabs-track-color - The color of the indicator's track (the line that separates tabs from panels).
 * @cssproperty --terra-tabs-track-width - The width of the indicator's track (the line that separates tabs from panels).
 */
export default class TerraTabs extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-icon': TerraIcon,
    }

    private activeTab?: TerraTab
    private mutationObserver: MutationObserver
    private resizeObserver: ResizeObserver
    private tabs: TerraTab[] = []
    private focusableTabs: TerraTab[] = []
    private panels: TerraTabPanel[] = []

    @query('.tabs') tabsElement: HTMLElement
    @query('.tabs__body') body: HTMLSlotElement
    @query('.tabs__nav') nav: HTMLElement
    @query('.tabs__indicator') indicator: HTMLElement

    @state() private hasScrollControls = false

    @state() private shouldHideScrollStartButton = false
    @state() private shouldHideScrollEndButton = false

    /** The placement of the tabs. */
    @property() placement: 'top' | 'bottom' | 'start' | 'end' = 'top'

    /**
     * When set to auto, navigating tabs with the arrow keys will instantly show the corresponding tab panel. When set to
     * manual, the tab will receive focus but will not show until the user presses spacebar or enter.
     */
    @property() activation: 'auto' | 'manual' = 'auto'

    /** Disables the scroll arrows that appear when tabs overflow. */
    @property({ attribute: 'no-scroll-controls', type: Boolean }) noScrollControls =
        false

    /** Prevent scroll buttons from being hidden when inactive. */
    @property({ attribute: 'fixed-scroll-controls', type: Boolean })
    fixedScrollControls = false

    /** The size of the tabs. Can be overridden by individual tab components. */
    @property({ reflect: true }) size: 'large' | 'small' = 'large'

    connectedCallback() {
        const whenAllDefined = Promise.all([
            customElements.whenDefined('terra-tab'),
            customElements.whenDefined('terra-tab-panel'),
        ])

        super.connectedCallback()

        this.resizeObserver = new ResizeObserver(() => {
            this.repositionIndicator()
            this.updateScrollControls()
        })

        this.mutationObserver = new MutationObserver(mutations => {
            const instanceMutations = mutations.filter(({ target }) => {
                if (target === this) return true // Allow self updates
                if ((target as HTMLElement).closest('terra-tabs') !== this)
                    return false // We are not direct children

                // We should only care about changes to the tab or tab panel
                const tagName = (target as HTMLElement).tagName.toLowerCase()
                return tagName === 'terra-tab' || tagName === 'terra-tab-panel'
            })

            if (instanceMutations.length === 0) {
                return
            }

            // Update aria labels when the DOM changes
            if (
                instanceMutations.some(
                    m =>
                        !['aria-labelledby', 'aria-controls'].includes(
                            m.attributeName!
                        )
                )
            ) {
                setTimeout(() => this.setAriaLabels())
            }

            // Sync tabs when disabled states change
            if (instanceMutations.some(m => m.attributeName === 'disabled')) {
                this.syncTabsAndPanels()
                // sync tabs when active state on tab changes
            } else if (instanceMutations.some(m => m.attributeName === 'active')) {
                const tabs = instanceMutations
                    .filter(
                        m =>
                            m.attributeName === 'active' &&
                            (m.target as HTMLElement).tagName.toLowerCase() ===
                                'terra-tab'
                    )
                    .map(m => m.target as TerraTab)
                const newActiveTab = tabs.find(tab => tab.active)

                if (newActiveTab) {
                    this.setActiveTab(newActiveTab)
                }
            }
        })

        // After the first update...
        this.updateComplete.then(() => {
            this.syncTabsAndPanels()

            this.mutationObserver.observe(this, {
                attributes: true,
                attributeFilter: ['active', 'disabled', 'name', 'panel'],
                childList: true,
                subtree: true,
            })

            if (this.nav) {
                this.resizeObserver.observe(this.nav)
            }

            // Wait for tabs and tab panels to be registered
            whenAllDefined.then(() => {
                // Set initial tab state when the tabs become visible
                const intersectionObserver = new IntersectionObserver(
                    (entries, observer) => {
                        if (entries[0].intersectionRatio > 0) {
                            this.setAriaLabels()
                            this.setActiveTab(this.getActiveTab() ?? this.tabs[0], {
                                emitEvents: false,
                            })
                            observer.unobserve(entries[0].target)
                        }
                    }
                )
                if (this.tabsElement) {
                    intersectionObserver.observe(this.tabsElement)
                }
            })
        })
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.mutationObserver?.disconnect()

        if (this.nav) {
            this.resizeObserver?.unobserve(this.nav)
        }
    }

    private getAllTabs() {
        const slot =
            this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="nav"]')!

        return slot.assignedElements() as TerraTab[]
    }

    private getAllPanels() {
        return [...this.body.assignedElements()].filter(
            el => el.tagName.toLowerCase() === 'terra-tab-panel'
        ) as [TerraTabPanel]
    }

    private getActiveTab() {
        return this.tabs.find(el => el.active)
    }

    private handleClick(event: MouseEvent) {
        const target = event.target as HTMLElement
        const tab = target.closest('terra-tab')
        const tabs = tab?.closest('terra-tabs')

        // Ensure the target tab is in this tabs component
        if (tabs !== this) {
            return
        }

        if (tab !== null) {
            this.setActiveTab(tab, { scrollBehavior: 'smooth' })
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        const target = event.target as HTMLElement
        const tab = target.closest('terra-tab')
        const tabs = tab?.closest('terra-tabs')

        // Ensure the target tab is in this tabs component
        if (tabs !== this) {
            return
        }

        // Activate a tab
        if (['Enter', ' '].includes(event.key)) {
            if (tab !== null) {
                this.setActiveTab(tab, { scrollBehavior: 'smooth' })
                event.preventDefault()
            }
        }

        // Move focus left or right
        if (
            [
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Home',
                'End',
            ].includes(event.key)
        ) {
            const activeEl = this.tabs.find(t => t.matches(':focus'))
            const isRtl = getComputedStyle(this).direction === 'rtl'
            let nextTab: null | TerraTab = null

            if (activeEl?.tagName.toLowerCase() === 'terra-tab') {
                if (event.key === 'Home') {
                    nextTab = this.focusableTabs[0]
                } else if (event.key === 'End') {
                    nextTab = this.focusableTabs[this.focusableTabs.length - 1]
                } else if (
                    (['top', 'bottom'].includes(this.placement) &&
                        event.key === (isRtl ? 'ArrowRight' : 'ArrowLeft')) ||
                    (['start', 'end'].includes(this.placement) &&
                        event.key === 'ArrowUp')
                ) {
                    const currentIndex = this.tabs.findIndex(el => el === activeEl)
                    nextTab = this.findNextFocusableTab(currentIndex, 'backward')
                } else if (
                    (['top', 'bottom'].includes(this.placement) &&
                        event.key === (isRtl ? 'ArrowLeft' : 'ArrowRight')) ||
                    (['start', 'end'].includes(this.placement) &&
                        event.key === 'ArrowDown')
                ) {
                    const currentIndex = this.tabs.findIndex(el => el === activeEl)
                    nextTab = this.findNextFocusableTab(currentIndex, 'forward')
                }

                if (!nextTab) {
                    return
                }

                nextTab.tabIndex = 0
                nextTab.focus({ preventScroll: true })

                if (this.activation === 'auto') {
                    this.setActiveTab(nextTab, { scrollBehavior: 'smooth' })
                } else {
                    this.tabs.forEach(tabEl => {
                        tabEl.tabIndex = tabEl === nextTab ? 0 : -1
                    })
                }

                if (['top', 'bottom'].includes(this.placement)) {
                    scrollIntoView(nextTab, this.nav, 'horizontal')
                }

                event.preventDefault()
            }
        }
    }

    private handleScrollToStart() {
        const isRtl = getComputedStyle(this).direction === 'rtl'
        this.nav.scroll({
            left: isRtl
                ? this.nav.scrollLeft + this.nav.clientWidth
                : this.nav.scrollLeft - this.nav.clientWidth,
            behavior: 'smooth',
        })
    }

    private handleScrollToEnd() {
        const isRtl = getComputedStyle(this).direction === 'rtl'
        this.nav.scroll({
            left: isRtl
                ? this.nav.scrollLeft - this.nav.clientWidth
                : this.nav.scrollLeft + this.nav.clientWidth,
            behavior: 'smooth',
        })
    }

    private setActiveTab(
        tab: TerraTab,
        options?: { emitEvents?: boolean; scrollBehavior?: 'auto' | 'smooth' }
    ) {
        options = {
            emitEvents: true,
            scrollBehavior: 'auto',
            ...options,
        }

        if (tab !== this.activeTab && !tab.disabled) {
            const previousTab = this.activeTab
            this.activeTab = tab

            // Sync active tab and panel
            this.tabs.forEach(el => {
                el.active = el === this.activeTab
                el.tabIndex = el === this.activeTab ? 0 : -1
            })
            this.panels.forEach(el => (el.active = el.name === this.activeTab?.panel))
            this.syncIndicator()

            if (['top', 'bottom'].includes(this.placement)) {
                scrollIntoView(
                    this.activeTab,
                    this.nav,
                    'horizontal',
                    options.scrollBehavior
                )
            }

            // Emit events
            if (options.emitEvents) {
                if (previousTab) {
                    this.emit('terra-tab-hide', {
                        detail: { name: previousTab.panel },
                    })
                }

                this.emit('terra-tab-show', {
                    detail: { name: this.activeTab.panel },
                })
            }
        }
    }

    private setAriaLabels() {
        // Link each tab with its corresponding panel
        this.tabs.forEach(tab => {
            const panel = this.panels.find(el => el.name === tab.panel)
            if (panel) {
                tab.setAttribute('aria-controls', panel.getAttribute('id')!)
                panel.setAttribute('aria-labelledby', tab.getAttribute('id')!)
            }
        })
    }

    private repositionIndicator() {
        const currentTab = this.getActiveTab()

        if (!currentTab) {
            return
        }

        const width = currentTab.clientWidth
        const height = currentTab.clientHeight
        const isRtl = getComputedStyle(this).direction === 'rtl'

        // We can't used offsetLeft/offsetTop here due to a shadow parent issue where neither can getBoundingClientRect
        // because it provides invalid values for animating elements: https://bugs.chromium.org/p/chromium/issues/detail?id=920069
        const allTabs = this.getAllTabs()
        const precedingTabs = allTabs.slice(0, allTabs.indexOf(currentTab))
        const offset = precedingTabs.reduce(
            (previous, current) => ({
                left: previous.left + current.clientWidth,
                top: previous.top + current.clientHeight,
            }),
            { left: 0, top: 0 }
        )

        switch (this.placement) {
            case 'top':
            case 'bottom':
                this.indicator.style.width = `${width}px`
                // Don't override height - let CSS handle it for the border
                this.indicator.style.translate = isRtl
                    ? `${-1 * offset.left}px`
                    : `${offset.left}px`
                break

            case 'start':
            case 'end':
                // Don't override width - let CSS handle it for the border
                this.indicator.style.height = `${height}px`
                this.indicator.style.translate = `0 ${offset.top}px`
                break
        }
    }

    // This stores tabs and panels so we can refer to a cache instead of calling querySelectorAll() multiple times.
    private syncTabsAndPanels() {
        this.tabs = this.getAllTabs()
        this.focusableTabs = this.tabs.filter(el => !el.disabled)

        // Sync size to child tabs if they don't have their own size set
        this.tabs.forEach(tab => {
            if (!tab.hasAttribute('size')) {
                tab.size = this.size
            }
        })

        this.panels = this.getAllPanels()
        this.syncIndicator()

        // After updating, show or hide scroll controls as needed
        this.updateComplete.then(() => this.updateScrollControls())
    }

    private findNextFocusableTab(
        currentIndex: number,
        direction: 'forward' | 'backward'
    ): TerraTab | null {
        let nextTab: TerraTab | null = null
        const iterator = direction === 'forward' ? 1 : -1
        let nextIndex = currentIndex + iterator

        while (currentIndex < this.tabs.length) {
            nextTab = this.tabs[nextIndex] || null

            if (nextTab === null) {
                // This is where wrapping happens. If we're moving forward and get to the end, then we jump to the beginning. If we're moving backward and get to the start, then we jump to the end.
                if (direction === 'forward') {
                    nextTab = this.focusableTabs[0]
                } else {
                    nextTab = this.focusableTabs[this.focusableTabs.length - 1]
                }
                break
            }

            if (!nextTab.disabled) {
                break
            }

            nextIndex += iterator
        }

        return nextTab
    }

    /**
     * The reality of the browser means that we can't expect the scroll position to be exactly what we want it to be, so
     * we add one pixel of wiggle room to our calculations.
     */
    private scrollOffset = 1

    @eventOptions({ passive: true })
    private updateScrollButtons() {
        if (this.hasScrollControls && !this.fixedScrollControls) {
            this.shouldHideScrollStartButton =
                this.scrollFromStart() <= this.scrollOffset
            this.shouldHideScrollEndButton = this.isScrolledToEnd()
        }
    }

    private isScrolledToEnd() {
        return (
            this.scrollFromStart() + this.nav.clientWidth >=
            this.nav.scrollWidth - this.scrollOffset
        )
    }

    private scrollFromStart() {
        return getComputedStyle(this).direction === 'rtl'
            ? -this.nav.scrollLeft
            : this.nav.scrollLeft
    }

    @watch('noScrollControls', { waitUntilFirstUpdate: true })
    updateScrollControls() {
        if (this.noScrollControls) {
            this.hasScrollControls = false
        } else {
            // In most cases, we can compare scrollWidth to clientWidth to determine if scroll controls should show. However,
            // Safari appears to calculate this incorrectly when zoomed at 110%, causing the controls to toggle indefinitely.
            // Adding a single pixel to the comparison seems to resolve it.
            this.hasScrollControls =
                ['top', 'bottom'].includes(this.placement) &&
                this.nav.scrollWidth > this.nav.clientWidth + 1
        }

        this.updateScrollButtons()
    }

    @watch('placement', { waitUntilFirstUpdate: true })
    syncIndicator() {
        const tab = this.getActiveTab()

        if (tab) {
            this.indicator.style.display = 'block'
            this.repositionIndicator()
        } else {
            this.indicator.style.display = 'none'
        }
    }

    @watch('size', { waitUntilFirstUpdate: true })
    syncSize() {
        // Sync size to child tabs if they don't have their own size set
        this.tabs.forEach(tab => {
            if (!tab.hasAttribute('size')) {
                tab.size = this.size
            }
        })
    }

    /** Shows the specified tab panel. */
    show(panel: string) {
        const tab = this.tabs.find(el => el.panel === panel)

        if (tab) {
            this.setActiveTab(tab, { scrollBehavior: 'smooth' })
        }
    }

    render() {
        const isRtl = getComputedStyle(this).direction === 'rtl'

        return html`
            <div
                part="base"
                class=${classMap({
                    tabs: true,
                    'tabs--top': this.placement === 'top',
                    'tabs--bottom': this.placement === 'bottom',
                    'tabs--start': this.placement === 'start',
                    'tabs--end': this.placement === 'end',
                    'tabs--rtl': isRtl,
                    'tabs--has-scroll-controls': this.hasScrollControls,
                    'tabs--large': this.size === 'large',
                    'tabs--small': this.size === 'small',
                })}
                @click=${this.handleClick}
                @keydown=${this.handleKeyDown}
            >
                <div class="tabs__nav-container" part="nav">
                    ${this.hasScrollControls
                        ? html`
                              <button
                                  part="scroll-button scroll-button--start"
                                  class=${classMap({
                                      'tabs__scroll-button': true,
                                      'tabs__scroll-button--start': true,
                                      'tabs__scroll-button--start--hidden':
                                          this.shouldHideScrollStartButton,
                                  })}
                                  tabindex="-1"
                                  aria-hidden="true"
                                  aria-label="Scroll to start"
                                  @click=${this.handleScrollToStart}
                                  type="button"
                              >
                                  <terra-icon
                                      name=${isRtl ? 'chevron-right' : 'chevron-left'}
                                      library="heroicons"
                                      font-size="1rem"
                                  ></terra-icon>
                              </button>
                          `
                        : ''}

                    <div class="tabs__nav" @scrollend=${this.updateScrollButtons}>
                        <div part="tabs" class="tabs__tabs" role="tablist">
                            <div
                                part="active-tab-indicator"
                                class="tabs__indicator"
                            ></div>
                            <div class="tabs__resize-observer">
                                <slot
                                    name="nav"
                                    @slotchange=${this.syncTabsAndPanels}
                                ></slot>
                            </div>
                        </div>
                    </div>

                    ${this.hasScrollControls
                        ? html`
                              <button
                                  part="scroll-button scroll-button--end"
                                  class=${classMap({
                                      'tabs__scroll-button': true,
                                      'tabs__scroll-button--end': true,
                                      'tabs__scroll-button--end--hidden':
                                          this.shouldHideScrollEndButton,
                                  })}
                                  tabindex="-1"
                                  aria-hidden="true"
                                  aria-label="Scroll to end"
                                  @click=${this.handleScrollToEnd}
                                  type="button"
                              >
                                  <terra-icon
                                      name=${isRtl ? 'chevron-left' : 'chevron-right'}
                                      library="heroicons"
                                      font-size="1rem"
                                  ></terra-icon>
                              </button>
                          `
                        : ''}
                </div>

                <slot
                    part="body"
                    class="tabs__body"
                    @slotchange=${this.syncTabsAndPanels}
                ></slot>
            </div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'terra-tabs': TerraTabs
    }
}
