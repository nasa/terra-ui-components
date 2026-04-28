import { animateTo, parseDuration, stopAnimations } from '../../internal/animate.js'
import { classMap } from 'lit/directives/class-map.js'
import {
    getAnimation,
    setDefaultAnimation,
} from '../../utilities/animation-registry.js'
import { html } from 'lit'
import { property, query } from 'lit/decorators.js'
import { waitForEvent } from '../../internal/event.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraPopup from '../popup/popup.component.js'
import styles from './tooltip.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Tooltips display brief, contextual help on hover or focus. Popovers show richer supporting content.
 * @documentation https://terra-ui.netlify.app/components/tooltip
 * @status stable
 * @since 1.0
 *
 * @dependency terra-popup
 *
 * @slot - The tooltip or popover target element. Avoid slotting in more than one element, as subsequent ones will be ignored.
 * @slot content - The content to render in the tooltip or popover. Alternatively, you can use the `content` attribute.
 * @slot image - Optional image slot for popovers. When provided, the image will span the full width of the popover.
 *
 * @event terra-show - Emitted when the tooltip or popover begins to show.
 * @event terra-after-show - Emitted after it has shown and all animations are complete.
 * @event terra-hide - Emitted when the tooltip or popover begins to hide.
 * @event terra-after-hide - Emitted after it has hidden and all animations are complete.
 *
 * @csspart base - The component's base wrapper, an `<terra-popup>` element.
 * @csspart base__popup - The popup's exported `popup` part. Use this to target the tooltip's popup container.
 * @csspart base__arrow - The popup's exported `arrow` part. Use this to target the tooltip's arrow.
 * @csspart body - The tooltip or popover body where its content is rendered.
 *
 * @cssproperty --max-width - The maximum width of the tooltip before its content will wrap.
 * @cssproperty --hide-delay - The amount of time to wait before hiding the tooltip when hovering.
 * @cssproperty --show-delay - The amount of time to wait before showing the tooltip when hovering.
 *
 * @animation tooltip.show - The animation to use when showing the tooltip.
 * @animation tooltip.hide - The animation to use when hiding the tooltip.
 */
export default class TerraTooltip extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = { 'terra-popup': TerraPopup }

    private hoverTimeout: number
    private closeWatcher: CloseWatcher | null

    @query('slot:not([name])') defaultSlot: HTMLSlotElement
    @query('.tooltip__body') body: HTMLElement
    @query('terra-popup') popup: TerraPopup

    /** The tooltip or popover content. If you need to display HTML, use the `content` slot instead. */
    @property() content = ''

    /**
     * The variant of the component. `tooltip` shows compact inline help, while `popover` shows a larger card-style panel
     * that can contain images and links.
     */
    @property({ reflect: true }) variant: 'tooltip' | 'popover' = 'tooltip'

    /**
     * The preferred placement of the tooltip. Note that the actual placement may vary as needed to keep the tooltip
     * inside of the viewport.
     */
    @property() placement:
        | 'top'
        | 'top-start'
        | 'top-end'
        | 'right'
        | 'right-start'
        | 'right-end'
        | 'bottom'
        | 'bottom-start'
        | 'bottom-end'
        | 'left'
        | 'left-start'
        | 'left-end' = 'top'

    /** Disables the tooltip so it won't show when triggered. */
    @property({ type: Boolean, reflect: true }) disabled = false

    /** The distance in pixels from which to offset the tooltip or popover away from its target. */
    @property({ type: Number }) distance = 8

    /** Indicates whether or not the tooltip or popover is open. You can use this in lieu of the show/hide methods. */
    @property({ type: Boolean, reflect: true }) open = false

    /** The distance in pixels from which to offset the tooltip along its target. */
    @property({ type: Number }) skidding = 0

    /**
     * Controls how the tooltip or popover is activated. Possible options include `click`, `hover`, `focus`, and `manual`. Multiple
     * options can be passed by separating them with a space. When manual is used, the tooltip must be activated
     * programmatically.
     */
    @property() trigger = 'hover focus'

    /**
     * Enable this option to prevent the tooltip from being clipped when the component is placed inside a container with
     * `overflow: auto|hidden|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all,
     * scenarios.
     */
    @property({ type: Boolean }) hoist = false

    constructor() {
        super()
        this.addEventListener('blur', this.handleBlur, true)
        this.addEventListener('focus', this.handleFocus, true)
        this.addEventListener('click', this.handleClick)
        this.addEventListener('mouseover', this.handleMouseOver)
        this.addEventListener('mouseout', this.handleMouseOut)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        // Cleanup this event in case the tooltip is removed while open
        this.closeWatcher?.destroy()
        document.removeEventListener('keydown', this.handleDocumentKeyDown)
    }

    firstUpdated() {
        this.body.hidden = !this.open

        // If the tooltip is visible on init, update its position
        if (this.open) {
            this.popup.active = true
            this.popup.reposition()
        }
    }

    private handleBlur = () => {
        if (this.hasTrigger('focus')) {
            this.hide()
        }
    }

    private handleClick = () => {
        if (this.hasTrigger('click')) {
            if (this.open) {
                this.hide()
            } else {
                this.show()
            }
        }
    }

    private handleFocus = () => {
        if (this.hasTrigger('focus')) {
            this.show()
        }
    }

    private handleDocumentKeyDown = (event: KeyboardEvent) => {
        // Pressing escape when a tooltip is open should dismiss it
        if (event.key === 'Escape') {
            event.stopPropagation()
            this.hide()
        }
    }

    private handleMouseOver = () => {
        if (this.hasTrigger('hover')) {
            const delay = parseDuration(
                getComputedStyle(this).getPropertyValue('--show-delay')
            )
            clearTimeout(this.hoverTimeout)
            this.hoverTimeout = window.setTimeout(() => this.show(), delay)
        }
    }

    private handleMouseOut = () => {
        if (this.hasTrigger('hover')) {
            const delay = parseDuration(
                getComputedStyle(this).getPropertyValue('--hide-delay')
            )
            clearTimeout(this.hoverTimeout)
            this.hoverTimeout = window.setTimeout(() => this.hide(), delay)
        }
    }

    private hasTrigger(triggerType: string) {
        const triggers = this.trigger.split(' ')
        return triggers.includes(triggerType)
    }

    @watch('open', { waitUntilFirstUpdate: true })
    async handleOpenChange() {
        if (this.open) {
            if (this.disabled) {
                return
            }

            // Show
            this.emit('terra-show')
            if ('CloseWatcher' in window) {
                this.closeWatcher?.destroy()
                this.closeWatcher = new CloseWatcher()
                this.closeWatcher.onclose = () => {
                    this.hide()
                }
            } else {
                document.addEventListener('keydown', this.handleDocumentKeyDown)
            }

            await stopAnimations(this.body)
            this.body.hidden = false
            this.popup.active = true
            const { keyframes, options } = getAnimation(this, 'tooltip.show', {
                dir: 'ltr',
            })
            await animateTo(this.popup.popup, keyframes, options)
            this.popup.reposition()

            this.emit('terra-after-show')
        } else {
            // Hide
            this.emit('terra-hide')
            this.closeWatcher?.destroy()
            document.removeEventListener('keydown', this.handleDocumentKeyDown)

            await stopAnimations(this.body)
            const { keyframes, options } = getAnimation(this, 'tooltip.hide', {
                dir: 'ltr',
            })
            await animateTo(this.popup.popup, keyframes, options)
            this.popup.active = false
            this.body.hidden = true

            this.emit('terra-after-hide')
        }
    }

    @watch(['content', 'distance', 'hoist', 'placement', 'skidding'])
    async handleOptionsChange() {
        if (this.hasUpdated) {
            await this.updateComplete
            this.popup.reposition()
        }
    }

    @watch('disabled')
    handleDisabledChange() {
        if (this.disabled && this.open) {
            this.hide()
        }
    }

    /** Shows the tooltip or popover. */
    async show() {
        if (this.open) {
            return undefined
        }

        this.open = true
        return waitForEvent(this, 'terra-after-show')
    }

    /** Hides the tooltip or popover. */
    async hide() {
        if (!this.open) {
            return undefined
        }

        this.open = false
        return waitForEvent(this, 'terra-after-hide')
    }

    //
    // NOTE: Tooltip is a bit unique in that we're using aria-live instead of aria-labelledby to trick screen readers into
    // announcing the content. It works really well, but it violates an accessibility rule. We're also adding the
    // aria-describedby attribute to a slot, which is required by <terra-popup> to correctly locate the first assigned
    // element, otherwise positioning is incorrect.
    //
    render() {
        const isPopover = this.variant === 'popover'

        return html`
            <terra-popup
                part="base"
                exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
                class=${classMap({
                    tooltip: true,
                    'tooltip--popover': isPopover,
                    'tooltip--open': this.open,
                })}
                placement=${this.placement}
                distance=${this.distance}
                skidding=${this.skidding}
                strategy=${this.hoist ? 'fixed' : 'absolute'}
                flip
                shift
                arrow
                hover-bridge
            >
                ${'' /* eslint-disable-next-line lit-a11y/no-aria-slot */}
                <slot slot="anchor" aria-describedby="tooltip"></slot>

                ${'' /* eslint-disable-next-line lit-a11y/accessible-name */}
                <div
                    part="body"
                    id="tooltip"
                    class="tooltip__body"
                    role=${isPopover ? 'dialog' : 'tooltip'}
                    aria-live=${this.open ? 'polite' : 'off'}
                >
                    <div class="tooltip__image">
                        <slot name="image"></slot>
                    </div>
                    <slot name="content">${this.content}</slot>
                </div>
            </terra-popup>
        `
    }
}

setDefaultAnimation('tooltip.show', {
    keyframes: [
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1 },
    ],
    options: { duration: 150, easing: 'ease' },
})

setDefaultAnimation('tooltip.hide', {
    keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.8 },
    ],
    options: { duration: 150, easing: 'ease' },
})
