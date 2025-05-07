import componentStyles from '../../styles/component.styles.js'
import styles from './skeleton.styles.js'
import TerraElement from '../../internal/terra-element.js'
import { getRandomIntInclusive } from '../../utilities/number.js'
import { html } from 'lit'
import { property } from 'lit/decorators.js'
import { SlSkeleton } from '@shoelace-style/shoelace'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Skeletons are loading indicators to represent where content will eventually be drawn.
 * @documentation https://disc.gsfc.nasa.gov/components/skeleton
 * @status experimental
 * @since 1.0
 *
 * @dependency sl-skeleton
 */
export default class TerraSkeleton extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'sl-skeleton': SlSkeleton,
    }

    @property()
    rows: number = 1

    @property()
    effect: 'pulse' | 'sheen' | 'none' = 'pulse'

    @property({ type: Boolean, reflect: true })
    variableWidths: boolean = true

    render() {
        return html`
            ${new Array(parseInt(this.rows.toString()))
                .fill(0)
                .map(
                    () =>
                        html`<sl-skeleton
                            effect=${this.effect}
                            style=${this.variableWidths
                                ? `width: ${getRandomIntInclusive(60, 100)}%`
                                : ''}
                        ></sl-skeleton>`
                )}
        `
    }
}
