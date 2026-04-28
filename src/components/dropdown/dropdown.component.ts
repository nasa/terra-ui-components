import { animateTo, stopAnimations } from '../../internal/animate.js'
import { classMap } from 'lit/directives/class-map.js'
import {
    getAnimation,
    setDefaultAnimation,
} from '../../utilities/animation-registry.js'
import { getDeepestActiveElement } from '../../internal/active-elements.js'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { property, query } from 'lit/decorators.js'
import { waitForEvent } from '../../internal/event.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraPopup from '../popup/popup.component.js'
import styles from './dropdown.styles.js'
import type { CSSResultGroup } from 'lit'
import type { TerraSelectEvent } from '../../events/terra-select.js'
import type TerraMenu from '../menu/menu.js'
import TerraElement from '../../internal/terra-element.js'

/**
 * @summary Dropdowns expose additional content that "drops down" in a panel.
 * @documentation https://terra-ui.netlify.app/components/dropdown
 * @status stable
 * @since 1.0
 *
 * @dependency terra-popup
 *
 * @slot - The dropdown's main content, typically a `<terra-menu>` element.
 * @slot trigger - The dropdown's trigger, usually a `<terra-button>` element.
 *
 * @event terra-show - Emitted when the dropdown opens.
 * @event terra-after-show - Emitted after the dropdown opens and all animations are complete.
 * @event terra-hide - Emitted when the dropdown closes.
 * @event terra-after-hide - Emitted after the dropdown closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper, an `<terra-popup>` element.
 * @csspart base__popup - The popup's exported `popup` part. Use this to target the dropdown's popup container.
 * @csspart trigger - The container that wraps the trigger.
 * @csspart panel - The panel that gets shown when the dropdown is open.
 *
 * @animation dropdown.show - The animation to use when showing the dropdown.
 * @animation dropdown.hide - The animation to use when hiding the dropdown.
 */
export default class TerraDropdown extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = { 'terra-popup': TerraPopup }

    @query('.dropdown') popup: TerraPopup
    @query('.dropdown__trigger') trigger: HTMLSlotElement
    @query('.dropdown__panel') panel: HTMLSlotElement

    private closeWatcher: CloseWatcher | null

    /**
     * Indicates whether or not the dropdown is open. You can toggle this attribute to show and hide the dropdown, or you
     * can use the `show()` and `hide()` methods and this attribute will reflect the dropdown's open state.
     */
    @property({ type: Boolean, reflect: true }) open = false

    /**
     * The preferred placement of the dropdown panel. Note that the actual placement may vary as needed to keep the panel
     * inside of the viewport.
     */
    @property({ reflect: true }) placement:
        | 'top'
        | 'top-start'
        | 'top-end'
        | 'bottom'
        | 'bottom-start'
        | 'bottom-end'
        | 'right'
        | 'right-start'
        | 'right-end'
        | 'left'
        | 'left-start'
        | 'left-end' = 'bottom-start'

    /** Disables the dropdown so the panel will not open. */
    @property({ type: Boolean, reflect: true }) disabled = false

    /**
     * By default, the dropdown is closed when an item is selected. This attribute will keep it open instead. Useful for
     * dropdowns that allow for multiple interactions.
     */
    @property({ attribute: 'stay-open-on-select', type: Boolean, reflect: true })
    stayOpenOnSelect = false

    /**
     * The dropdown will close when the user interacts outside of this element (e.g. clicking). Useful for composing other
     * components that use a dropdown internally.
     */
    @property({ attribute: false }) containingElement?: HTMLElement

    /** The distance in pixels from which to offset the panel away from its trigger. */
    @property({ type: Number }) distance = 0

    /** The distance in pixels from which to offset the panel along its trigger. */
    @property({ type: Number }) skidding = 0

    /**
     * Enable this option to prevent the panel from being clipped when the component is placed inside a container with
     * `overflow: auto|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all, scenarios.
     */
    @property({ type: Boolean }) hoist = false

    /**
     * When true, the dropdown opens on mouse hover instead of click.
     * @default false
     */
    @property({ type: Boolean, reflect: true }) hover = false

    private hoverTimeout: number | null = null
    private hideTimeout: number | null = null

    /**
     * Syncs the popup width or height to that of the trigger element.
     */
    @property({ reflect: true }) sync: 'width' | 'height' | 'both' | undefined =
        undefined

    connectedCallback() {
        super.connectedCallback()

        if (!this.containingElement) {
            this.containingElement = this
        }
    }

    firstUpdated() {
        this.panel.hidden = !this.open

        // Attach hover listeners if needed (after update completes)
        this.updateComplete.then(() => {
            this.attachHoverListeners()
        })

        // If the dropdown is visible on init, update its position
        if (this.open) {
            this.addOpenListeners()
            this.popup.active = true
            this.attachPanelHoverListeners()
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeOpenListeners()
        this.removeHoverListeners()
        this.hide()
        // Clear any pending timeouts
        if (this.hoverTimeout !== null) {
            clearTimeout(this.hoverTimeout)
            this.hoverTimeout = null
        }
        if (this.hideTimeout !== null) {
            clearTimeout(this.hideTimeout)
            this.hideTimeout = null
        }
    }

    private removeHoverListeners() {
        const assignedElements =
            this.trigger?.assignedElements({ flatten: true }) || []
        const triggerElement = assignedElements[0] as HTMLElement | undefined

        if (!triggerElement) {
            return
        }

        // For terra-button, try to get the internal button element
        let targetElement: HTMLElement = triggerElement
        if (triggerElement.tagName.toLowerCase() === 'terra-button') {
            const button = (triggerElement as any).button as HTMLElement | undefined
            if (button) {
                targetElement = button
            }
        }

        targetElement.removeEventListener('mouseenter', this.handleTriggerMouseEnter)
        targetElement.removeEventListener('mouseleave', this.handleTriggerMouseLeave)

        const popupElement = this.popup?.popup as HTMLElement | undefined
        if (popupElement) {
            popupElement.removeEventListener('mouseenter', this.handlePanelMouseEnter)
            popupElement.removeEventListener('mouseleave', this.handlePanelMouseLeave)
        }
    }

    focusOnTrigger() {
        const trigger = this.trigger.assignedElements({ flatten: true })[0] as
            | HTMLElement
            | undefined
        if (typeof trigger?.focus === 'function') {
            trigger.focus()
        }
    }

    getMenu() {
        return this.panel
            .assignedElements({ flatten: true })
            .find(el => el.tagName.toLowerCase() === 'terra-menu') as
            | TerraMenu
            | undefined
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        // Close when escape is pressed inside an open dropdown. We need to listen on the panel itself and stop propagation
        // in case any ancestors are also listening for this key.
        if (this.open && event.key === 'Escape') {
            event.stopPropagation()
            this.hide()
            this.focusOnTrigger()
        }
    }

    private handleDocumentKeyDown = (event: KeyboardEvent) => {
        // Close when escape or tab is pressed
        if (event.key === 'Escape' && this.open && !this.closeWatcher) {
            event.stopPropagation()
            this.focusOnTrigger()
            this.hide()
            return
        }

        // Handle tabbing
        if (event.key === 'Tab') {
            // Tabbing within an open menu should close the dropdown and refocus the trigger
            if (
                this.open &&
                document.activeElement?.tagName.toLowerCase() === 'terra-menu-item'
            ) {
                event.preventDefault()
                this.hide()
                this.focusOnTrigger()
                return
            }

            const computeClosestContaining = (
                element: Element | null | undefined,
                tagName: string
            ): Element | null => {
                if (!element) return null

                const closest = element.closest(tagName)
                if (closest) return closest

                const rootNode = element.getRootNode()
                if (rootNode instanceof ShadowRoot) {
                    return computeClosestContaining(rootNode.host, tagName)
                }

                return null
            }

            // Tabbing outside of the containing element closes the panel
            //
            // If the dropdown is used within a shadow DOM, we need to obtain the activeElement within that shadowRoot,
            // otherwise `document.activeElement` will only return the name of the parent shadow DOM element.
            setTimeout(() => {
                const activeElement =
                    this.containingElement?.getRootNode() instanceof ShadowRoot
                        ? getDeepestActiveElement()
                        : document.activeElement

                if (
                    !this.containingElement ||
                    computeClosestContaining(
                        activeElement,
                        this.containingElement.tagName.toLowerCase()
                    ) !== this.containingElement
                ) {
                    this.hide()
                }
            })
        }
    }

    private handleDocumentMouseDown = (event: MouseEvent) => {
        // Close when clicking outside of the containing element
        const path = event.composedPath()
        if (this.containingElement && !path.includes(this.containingElement)) {
            this.hide()
        }
    }

    private handlePanelSelect = (event: TerraSelectEvent) => {
        const target = event.target as HTMLElement

        // Hide the dropdown when a menu item is selected
        if (!this.stayOpenOnSelect && target.tagName.toLowerCase() === 'terra-menu') {
            this.hide()
            this.focusOnTrigger()
        }
    }

    handleTriggerClick() {
        if (this.hover) {
            return // Don't handle clicks when hover is enabled
        }
        if (this.open) {
            this.hide()
        } else {
            this.show()
            this.focusOnTrigger()
        }
    }

    private handleTriggerMouseEnter = () => {
        if (!this.hover || this.disabled) {
            return
        }
        // Clear any pending hide timeout
        if (this.hideTimeout !== null) {
            clearTimeout(this.hideTimeout)
            this.hideTimeout = null
        }
        // Show after a short delay to prevent accidental triggers
        this.hoverTimeout = window.setTimeout(() => {
            if (!this.open) {
                this.show()
            }
            this.hoverTimeout = null
        }, 150)
    }

    private handleTriggerMouseLeave = () => {
        if (!this.hover) {
            return
        }
        // Clear any pending show timeout
        if (this.hoverTimeout !== null) {
            clearTimeout(this.hoverTimeout)
            this.hoverTimeout = null
        }
        // Hide after a delay to allow moving to the panel
        this.hideTimeout = window.setTimeout(() => {
            if (this.open) {
                this.hide()
            }
            this.hideTimeout = null
        }, 200)
    }

    private handlePanelMouseEnter = () => {
        if (!this.hover) {
            return
        }
        // Clear any pending hide timeout when mouse enters panel
        if (this.hideTimeout !== null) {
            clearTimeout(this.hideTimeout)
            this.hideTimeout = null
        }
    }

    private handlePanelMouseLeave = () => {
        if (!this.hover) {
            return
        }
        // Hide when mouse leaves panel
        this.hideTimeout = window.setTimeout(() => {
            if (this.open) {
                this.hide()
            }
            this.hideTimeout = null
        }, 200)
    }

    async handleTriggerKeyDown(event: KeyboardEvent) {
        // When spacebar/enter is pressed, show the panel but don't focus on the menu. This let's the user press the same
        // key again to hide the menu in case they don't want to make a selection.
        if ([' ', 'Enter'].includes(event.key)) {
            event.preventDefault()
            this.handleTriggerClick()
            return
        }

        const menu = this.getMenu()

        if (menu) {
            const menuItems = menu.getAllItems()
            const firstMenuItem = menuItems[0]
            const lastMenuItem = menuItems[menuItems.length - 1]

            // When up/down is pressed, we make the assumption that the user is familiar with the menu and plans to make a
            // selection. Rather than toggle the panel, we focus on the menu (if one exists) and activate the first item for
            // faster navigation.
            if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                event.preventDefault()

                // Show the menu if it's not already open
                if (!this.open) {
                    this.show()

                    // Wait for the dropdown to open before focusing, but not the animation
                    await this.updateComplete
                }

                if (menuItems.length > 0) {
                    // Focus on the first/last menu item after showing
                    this.updateComplete.then(() => {
                        if (event.key === 'ArrowDown' || event.key === 'Home') {
                            menu.setCurrentItem(firstMenuItem)
                            firstMenuItem.focus()
                        }

                        if (event.key === 'ArrowUp' || event.key === 'End') {
                            menu.setCurrentItem(lastMenuItem)
                            lastMenuItem.focus()
                        }
                    })
                }
            }
        }
    }

    handleTriggerKeyUp(event: KeyboardEvent) {
        // Prevent space from triggering a click event in Firefox
        if (event.key === ' ') {
            event.preventDefault()
        }
    }

    handleTriggerSlotChange() {
        this.updateAccessibleTrigger()
        // Use requestAnimationFrame to ensure the element is fully rendered
        requestAnimationFrame(() => {
            this.attachHoverListeners()
        })
    }

    private attachHoverListeners() {
        if (!this.hover || !this.trigger) {
            return
        }

        const assignedElements = this.trigger.assignedElements({ flatten: true })
        const triggerElement = assignedElements[0] as HTMLElement | undefined

        if (!triggerElement) {
            return
        }

        // Remove old listeners if they exist
        triggerElement.removeEventListener('mouseenter', this.handleTriggerMouseEnter)
        triggerElement.removeEventListener('mouseleave', this.handleTriggerMouseLeave)

        // For terra-button, try to get the internal button element
        let targetElement: HTMLElement = triggerElement
        if (triggerElement.tagName.toLowerCase() === 'terra-button') {
            // Try to access the internal button element
            const button = (triggerElement as any).button as HTMLElement | undefined
            if (button) {
                targetElement = button
            }
        }

        // Add listeners to the target element
        targetElement.addEventListener('mouseenter', this.handleTriggerMouseEnter)
        targetElement.addEventListener('mouseleave', this.handleTriggerMouseLeave)
    }

    private attachPanelHoverListeners() {
        if (!this.hover) {
            return
        }

        // Attach listeners to the popup's popup element (the actual visible panel)
        // We need to wait for the popup to be rendered
        this.updateComplete.then(() => {
            const popupElement = this.popup?.popup as HTMLElement | undefined
            if (popupElement) {
                // Remove old listeners if they exist
                popupElement.removeEventListener(
                    'mouseenter',
                    this.handlePanelMouseEnter
                )
                popupElement.removeEventListener(
                    'mouseleave',
                    this.handlePanelMouseLeave
                )

                // Add new listeners
                popupElement.addEventListener(
                    'mouseenter',
                    this.handlePanelMouseEnter
                )
                popupElement.addEventListener(
                    'mouseleave',
                    this.handlePanelMouseLeave
                )
            }
        })
    }

    //
    // Slotted triggers can be arbitrary content, but we need to link them to the dropdown panel with `aria-haspopup` and
    // `aria-expanded`. These must be applied to the "accessible trigger" (the tabbable portion of the trigger element
    // that gets slotted in) so screen readers will understand them. The accessible trigger could be the slotted element,
    // a child of the slotted element, or an element in the slotted element's shadow root.
    //
    // For example, the accessible trigger of an <terra-button> is a <button> located inside its shadow root.
    //
    // To determine this, we assume the first tabbable element in the trigger slot is the "accessible trigger."
    //
    updateAccessibleTrigger() {
        /*
        TODO:
        const assignedElements = this.trigger.assignedElements({
            flatten: true,
        }) as HTMLElement[]
        const accessibleTrigger = assignedElements.find(
            el => getTabbableBoundary(el).start
        )
        let target: HTMLElement

        if (accessibleTrigger) {
            switch (accessibleTrigger.tagName.toLowerCase()) {
                // Terra buttons have to update the internal button so it's announced correctly by screen readers
                case 'terra-button':
                case 'terra-icon-button':
                    target = (accessibleTrigger as TerraButton | TerraIconButton).button
                    break

                default:
                    target = accessibleTrigger
            }

            target.setAttribute('aria-haspopup', 'true')
            target.setAttribute('aria-expanded', this.open ? 'true' : 'false')
        }*/
    }

    /** Shows the dropdown panel. */
    async show() {
        if (this.open) {
            return undefined
        }

        this.open = true
        return waitForEvent(this, 'terra-after-show')
    }

    /** Hides the dropdown panel */
    async hide() {
        if (!this.open) {
            return undefined
        }

        this.open = false
        return waitForEvent(this, 'terra-after-hide')
    }

    /**
     * Instructs the dropdown menu to reposition. Useful when the position or size of the trigger changes when the menu
     * is activated.
     */
    reposition() {
        this.popup.reposition()
    }

    addOpenListeners() {
        this.panel.addEventListener('terra-select', this.handlePanelSelect)
        if ('CloseWatcher' in window) {
            this.closeWatcher?.destroy()
            this.closeWatcher = new CloseWatcher()
            this.closeWatcher.onclose = () => {
                this.hide()
                this.focusOnTrigger()
            }
        } else {
            this.panel.addEventListener('keydown', this.handleKeyDown)
        }
        document.addEventListener('keydown', this.handleDocumentKeyDown)
        document.addEventListener('mousedown', this.handleDocumentMouseDown)
    }

    removeOpenListeners() {
        if (this.panel) {
            this.panel.removeEventListener('terra-select', this.handlePanelSelect)
            this.panel.removeEventListener('keydown', this.handleKeyDown)
        }
        document.removeEventListener('keydown', this.handleDocumentKeyDown)
        document.removeEventListener('mousedown', this.handleDocumentMouseDown)
        this.closeWatcher?.destroy()
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.disabled) {
            this.open = false
            return
        }

        this.updateAccessibleTrigger()

        if (this.open) {
            // Show
            this.emit('terra-show')
            this.addOpenListeners()
            this.attachPanelHoverListeners()

            await stopAnimations(this)
            this.panel.hidden = false
            this.popup.active = true
            const { keyframes, options } = getAnimation(this, 'dropdown.show', {
                dir: 'ltr',
            })
            await animateTo(this.popup.popup, keyframes, options)

            this.emit('terra-after-show')
        } else {
            // Hide
            this.emit('terra-hide')
            this.removeOpenListeners()

            await stopAnimations(this)
            const { keyframes, options } = getAnimation(this, 'dropdown.hide', {
                dir: 'ltr',
            })
            await animateTo(this.popup.popup, keyframes, options)
            this.panel.hidden = true
            this.popup.active = false

            this.emit('terra-after-hide')
        }
    }

    @watch('hover', { waitUntilFirstUpdate: true })
    handleHoverChange() {
        this.attachHoverListeners()
    }

    render() {
        return html`
            <terra-popup
                part="base"
                exportparts="popup:base__popup"
                id="dropdown"
                placement=${this.placement}
                distance=${this.distance}
                skidding=${this.skidding}
                strategy=${this.hoist ? 'fixed' : 'absolute'}
                flip
                shift
                auto-size="vertical"
                auto-size-padding="10"
                sync=${ifDefined(this.sync ? this.sync : undefined)}
                class=${classMap({
                    dropdown: true,
                    'dropdown--open': this.open,
                })}
            >
                <slot
                    name="trigger"
                    slot="anchor"
                    part="trigger"
                    class="dropdown__trigger"
                    @click=${this.handleTriggerClick}
                    @keydown=${this.handleTriggerKeyDown}
                    @keyup=${this.handleTriggerKeyUp}
                    @slotchange=${this.handleTriggerSlotChange}
                ></slot>

                <div
                    aria-hidden=${this.open ? 'false' : 'true'}
                    aria-labelledby="dropdown"
                >
                    <slot part="panel" class="dropdown__panel"></slot>
                </div>
            </terra-popup>
        `
    }
}

setDefaultAnimation('dropdown.show', {
    keyframes: [
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1 },
    ],
    options: { duration: 100, easing: 'ease' },
})

setDefaultAnimation('dropdown.hide', {
    keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.9 },
    ],
    options: { duration: 100, easing: 'ease' },
})
