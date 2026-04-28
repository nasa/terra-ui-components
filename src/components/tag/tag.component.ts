import { property } from 'lit/decorators.js'
import { html, nothing } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import TerraIcon from '../icon/icon.component.js'
import styles from './tag.styles.js'
import type { CSSResultGroup } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

/**
 * @summary Tags are simple labels that help categorize items.
 * @documentation https://terra-ui.netlify.app/components/tag
 * @status stable
 * @since 1.0
 *
 * @dependency terra-icon
 *
 * @event terra-click - Emitted when a topic tag is clicked (unless href is provided).
 *
 * @slot - The tag label text.
 * @slot icon - Optional icon slot for content tags (overrides icon prop).
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The icon element (content tags only).
 * @csspart label - The text label.
 *
 * @cssproperty --terra-tag-font-family - The font family for the tag.
 * @cssproperty --terra-tag-font-size-small - The font size for small tags.
 * @cssproperty --terra-tag-font-size-medium - The font size for medium tags.
 * @cssproperty --terra-tag-font-size-large - The font size for large tags.
 * @cssproperty --terra-tag-font-weight - The font weight for the tag.
 * @cssproperty --terra-tag-font-weight-urgent - The font weight for urgent tags.
 * @cssproperty --terra-tag-color - The text color of the tag.
 * @cssproperty --terra-tag-background-color - The background color of the tag.
 * @cssproperty --terra-tag-border-color - The border color for topic tags.
 * @cssproperty --terra-tag-border-color-hover - The border color for topic tags on hover.
 * @cssproperty --terra-tag-background-color-hover - The background color for topic tags on hover.
 * @cssproperty --terra-tag-icon-border-color - The border color for content tag icons.
 * @cssproperty --terra-tag-icon-size-small - The size of small content tag icons.
 * @cssproperty --terra-tag-icon-size-medium - The size of medium content tag icons.
 * @cssproperty --terra-tag-icon-size-large - The size of large content tag icons.
 * @cssproperty --terra-tag-icon-inner-size-small - The inner icon size for small content tags.
 * @cssproperty --terra-tag-icon-inner-size-medium - The inner icon size for medium content tags.
 * @cssproperty --terra-tag-icon-inner-size-large - The inner icon size for large content tags.
 * @cssproperty --terra-tag-urgent-color - The text color for urgent tags.
 * @cssproperty --terra-tag-urgent-background-color - The background color for urgent tags.
 * @cssproperty --terra-tag-padding-small - The padding for small topic/urgent tags.
 * @cssproperty --terra-tag-padding-medium - The padding for medium topic/urgent tags.
 * @cssproperty --terra-tag-padding-large - The padding for large topic/urgent tags.
 */
export default class TerraTag extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-icon': TerraIcon,
    }

    /** The tag variant. Determines the styling and behavior. */
    @property({ reflect: true })
    variant: 'content' | 'topic' | 'urgent' = 'content'

    /** The size of the tag. */
    @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium'

    /** The icon name for content tags. Used with the default icon library. */
    @property({ reflect: true }) icon?: string

    /** The icon library to use for content tags. */
    @property({ reflect: true }) iconLibrary: 'default' | 'heroicons' | string =
        'default'

    /** When true, tags will stack vertically instead of sitting side by side. */
    @property({ type: Boolean, reflect: true }) stack = false

    /** When true, forces dark mode styles regardless of system preference. Useful when placing the component on a dark background. */
    @property({ type: Boolean, reflect: true }) dark = false

    /** The href for topic tags. If provided, the tag will be rendered as a link. */
    @property() href?: string

    private handleClick = (e: MouseEvent) => {
        if (this.variant === 'topic') {
            this.emit('terra-click', { detail: { originalEvent: e } })
        }
    }

    render() {
        const isLink = this.variant === 'topic' && this.href
        const isContent = this.variant === 'content'

        const baseClasses = {
            tag: true,
            'tag--content': isContent,
            'tag--topic': this.variant === 'topic',
            'tag--urgent': this.variant === 'urgent',
            'tag--small': this.size === 'small',
            'tag--medium': this.size === 'medium',
            'tag--large': this.size === 'large',
        }

        const content = html`
            ${isContent
                ? html`
                      <span
                          part="icon"
                          class="${classMap({
                              tag__icon: true,
                              'tag__icon--small': this.size === 'small',
                              'tag__icon--medium': this.size === 'medium',
                              'tag__icon--large': this.size === 'large',
                          })}"
                      >
                          <slot name="icon">
                              ${this.icon
                                  ? html`
                                        <terra-icon
                                            name="${this.icon}"
                                            library="${this.iconLibrary}"
                                        ></terra-icon>
                                    `
                                  : nothing}
                          </slot>
                      </span>
                  `
                : nothing}
            <span part="label" class="tag__label">
                <slot></slot>
            </span>
        `

        if (isLink) {
            return html`
                <a
                    part="base"
                    href="${this.href}"
                    class="${classMap(baseClasses)}"
                    @click="${this.handleClick}"
                >
                    ${content}
                </a>
            `
        }

        return html`
            <div
                part="base"
                class="${classMap(baseClasses)}"
                @click="${this.handleClick}"
                role="${this.variant === 'topic' ? 'button' : nothing}"
                tabindex="${this.variant === 'topic' && !this.href ? '0' : nothing}"
            >
                ${content}
            </div>
        `
    }
}
