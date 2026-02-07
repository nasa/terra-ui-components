import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement from '../../internal/terra-element.js'
import styles from './caption.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Captions are small text blocks that describe photos, provide additional context and information, and give credit to photographers and other content owners and creators.
 * @documentation https://terra-ui.netlify.app/components/caption
 * @status stable
 * @since 1.0
 *
 * @slot - The caption content. Use a `<span class="credit">` element for credits, which will be displayed with higher contrast.
 *
 * @cssproperty --terra-caption-font-family - The font family for the caption.
 * @cssproperty --terra-caption-font-size - The font size for the caption.
 * @cssproperty --terra-caption-font-weight - The font weight for the caption.
 * @cssproperty --terra-caption-line-height - The line height for the caption.
 * @cssproperty --terra-caption-color - The text color for the caption.
 * @cssproperty --terra-caption-credit-color - The text color for credits within the caption.
 */
export default class TerraCaption extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    render() {
        return html`<slot></slot>`
    }
}
