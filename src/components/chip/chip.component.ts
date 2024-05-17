import { property } from 'lit/decorators.js'
import { html } from 'lit'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import EduxElement from '../../internal/edux-element.js'
import styles from './chip.styles.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://disc.gsfc.nasa.gov/components/chip
 * @status experimental
 * @since 1.0
 *
 * @dependency edux-example
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class EduxChip extends EduxElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    /** An example attribute. */
    @property() attr = 'example'

    @watch('example')
    handleExampleChange() {
        // do something
    }

    render() {
        return html` <slot></slot> `
    }
}
