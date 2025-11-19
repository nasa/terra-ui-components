import { classMap } from 'lit/directives/class-map.js'
import { html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import TerraIcon from '../icon/icon.component.js'
import styles from './avatar.styles.js'
import type { CSSResultGroup } from 'lit'
import TerraElement from '../../internal/terra-element.js'

/**
 * @summary Avatars are used to represent a person or object.
 * @documentation https://terra-ui.netlify.app/components/avatar
 * @status stable
 * @since 1.0
 *
 * @dependency terra-icon
 *
 * @event terra-error - The image could not be loaded. This may because of an invalid URL, a temporary network condition, or some
 * unknown cause.
 *
 * @slot icon - The default icon to use when no image or initials are present. Works best with `<terra-icon>`.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the avatar's icon.
 * @csspart initials - The container that wraps the avatar's initials.
 * @csspart image - The avatar image. Only shown when the `image` attribute is set.
 *
 * @cssproperty --size - The size of the avatar.
 */
export default class TerraAvatar extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-icon': TerraIcon,
    }

    @state() private hasError = false

    /** The image source to use for the avatar. */
    @property() image = ''

    /** A label to use to describe the avatar to assistive devices. */
    @property() label = ''

    /** Initials to use as a fallback when no image is available (1-2 characters max recommended). */
    @property() initials = ''

    /** Indicates how the browser should load the image. */
    @property() loading: 'eager' | 'lazy' = 'eager'

    /** The shape of the avatar. */
    @property({ reflect: true }) shape: 'circle' | 'square' | 'rounded' = 'circle'

    @watch('image')
    handleImageChange() {
        // Reset the error when a new image is provided
        this.hasError = false
    }

    private handleImageLoadError() {
        this.hasError = true
        this.emit('terra-error')
    }

    render() {
        const avatarWithImage = html`
            <img
                part="image"
                class="avatar__image"
                src="${this.image}"
                loading="${this.loading}"
                alt=""
                @error="${this.handleImageLoadError}"
            />
        `

        let avatarWithoutImage = html``

        if (this.initials) {
            avatarWithoutImage = html`<div part="initials" class="avatar__initials">
                ${this.initials}
            </div>`
        } else {
            avatarWithoutImage = html`
                <div part="icon" class="avatar__icon" aria-hidden="true">
                    <slot name="icon">
                        <terra-icon
                            name="solid-user"
                            library="heroicons"
                        ></terra-icon>
                    </slot>
                </div>
            `
        }

        return html`
            <div
                part="base"
                class=${classMap({
                    avatar: true,
                    'avatar--circle': this.shape === 'circle',
                    'avatar--rounded': this.shape === 'rounded',
                    'avatar--square': this.shape === 'square',
                })}
                role="img"
                aria-label=${this.label}
            >
                ${this.image && !this.hasError ? avatarWithImage : avatarWithoutImage}
            </div>
        `
    }
}
