import { html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import styles from './scroll-hint.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Scroll hint is an animated button that prompts visitors to scroll.
 * @documentation https://terra-ui.netlify.app/components/scroll-hint
 * @status stable
 * @since 1.0
 *
 * @dependency terra-icon
 *
 * @event terra-scroll - Emitted when the scroll hint is clicked and scrolling begins.
 *
 * @csspart base - The component's base wrapper.
 * @csspart button - The clickable button element.
 * @csspart icon-container - The container for the icon and pulsing ring.
 * @csspart icon - The chevron icon.
 * @csspart ring - The pulsing ring around the icon.
 * @csspart text - The "SCROLL TO CONTINUE" text.
 *
 * @cssproperty --terra-scroll-hint-icon-background-color - The background color of the icon circle.
 * @cssproperty --terra-scroll-hint-icon-color - The color of the chevron icon.
 * @cssproperty --terra-scroll-hint-text-color - The color of the text.
 * @cssproperty --terra-scroll-hint-ring-color - The color of the pulsing ring.
 */
export default class TerraScrollHint extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-icon': TerraIcon,
    }

    /** When true, the component will be positioned inline in the DOM flow instead of fixed to the viewport. */
    @property({ type: Boolean, reflect: true }) inline = false

    /** When true, forces dark mode styles regardless of system preference. Useful when placing the component on a dark background. */
    @property({ type: Boolean, reflect: true }) dark = false

    /** The delay in milliseconds before showing the scroll hint after inactivity. Defaults to 3000ms (3 seconds). */
    @property({ type: Number }) inactivityDelay = 3000

    @state() private visible = false

    @watch('inline')
    handleInlineChange() {
        if (this.inline) {
            // If inline, always show
            this.visible = true
            this.clearTimers()
        } else {
            // If not inline, hide and restart timer
            this.visible = false
            this.clearTimers()
            this.startInactivityTimer()
        }
    }

    private scrollTimeout?: number
    private clickTimeout?: number
    private inactivityTimeout?: number

    connectedCallback() {
        super.connectedCallback()
        this.setupEventListeners()

        // If inline, always show. Otherwise, start inactivity timer
        if (this.inline) {
            this.visible = true
        } else {
            this.startInactivityTimer()
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.cleanupEventListeners()
        this.clearTimers()
    }

    private setupEventListeners() {
        window.addEventListener('scroll', this.handleScroll, { passive: true })
        document.addEventListener('click', this.handleDocumentClick)
    }

    private cleanupEventListeners() {
        window.removeEventListener('scroll', this.handleScroll)
        document.removeEventListener('click', this.handleDocumentClick)
    }

    private handleScroll = () => {
        // If inline, always visible - don't hide on scroll
        if (this.inline) {
            return
        }

        // Check if user is at the bottom of the page
        const isAtBottom = this.isAtBottomOfPage()

        if (isAtBottom) {
            // Hide if at bottom and don't show again
            if (this.visible) {
                this.hide()
            }
            // Clear timer so it won't show again
            this.clearTimers()
        } else {
            // Hide on any scroll if visible, then restart timer
            if (this.visible) {
                this.hide()
                // Restart timer after hiding (unless at bottom)
                this.startInactivityTimer()
            }
        }
    }

    private handleDocumentClick = (e: MouseEvent) => {
        // Don't hide if clicking on the scroll hint itself
        if (this.contains(e.target as Node)) {
            return
        }
        // Only hide on document click if not inline
        if (!this.inline && this.visible) {
            this.hide()
            // Restart timer after hiding (unless at bottom)
            this.startInactivityTimer()
        }
    }

    private isAtBottomOfPage(): boolean {
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const scrollTop = window.scrollY || document.documentElement.scrollTop

        // Consider "at bottom" if within 100px of the bottom
        const threshold = 100
        return scrollTop + windowHeight >= documentHeight - threshold
    }

    private handleClick = () => {
        this.emit('terra-scroll')
        // Only hide if not inline
        if (!this.inline) {
            this.hide()
            // Restart timer after hiding (unless at bottom)
            // Use a small delay to allow scroll to complete first
            setTimeout(() => {
                this.startInactivityTimer()
            }, 100)
        }
        this.scrollDown()
    }

    private scrollDown() {
        const viewportHeight = window.innerHeight
        window.scrollBy({
            top: viewportHeight,
            behavior: 'smooth',
        })
    }

    private hide() {
        this.visible = false
        this.clearTimers()
    }

    private startInactivityTimer() {
        // Only start timer if not inline and not at bottom of page
        if (this.inline) {
            return
        }

        // Check if already at bottom - if so, don't show
        if (this.isAtBottomOfPage()) {
            return
        }

        // Show after configured delay of inactivity
        this.inactivityTimeout = window.setTimeout(() => {
            // Double-check we're not at bottom before showing
            if (!this.isAtBottomOfPage()) {
                this.visible = true
            }
        }, this.inactivityDelay)
    }

    private clearTimers() {
        clearTimeout(this.scrollTimeout)
        clearTimeout(this.clickTimeout)
        clearTimeout(this.inactivityTimeout)
    }

    render() {
        if (!this.visible) {
            return html``
        }

        return html`
            <button
                part="button"
                class="scroll-hint"
                @click="${this.handleClick}"
                aria-label="Scroll to continue"
            >
                <div part="icon-container" class="scroll-hint__icon-container">
                    <div part="ring" class="scroll-hint__ring"></div>
                    <div part="icon" class="scroll-hint__icon">
                        <terra-icon
                            name="chevron-down"
                            library="default"
                        ></terra-icon>
                    </div>
                </div>
                <span part="text" class="scroll-hint__text">SCROLL TO CONTINUE</span>
            </button>
        `
    }
}
