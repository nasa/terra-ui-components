import componentStyles from '../../styles/component.styles.js'
import styles from './skeleton.styles.js'
import TerraElement from '../../internal/terra-element.js'
import { getRandomIntInclusive } from '../../utilities/number.js'
import { html } from 'lit'
import { property } from 'lit/decorators.js'
import type { CSSResultGroup } from 'lit'

/**
 * @summary Skeletons are loading indicators to represent where content will eventually be drawn.
 * @documentation https://terra-ui.netlify.app/components/skeleton
 * @status stable
 * @since 1.0
 */
export default class TerraSkeleton extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @property()
    rows: number = 1

    @property()
    effect: 'pulse' | 'sheen' | 'none' = 'pulse'

    @property({ type: Boolean, reflect: true })
    variableWidths: boolean = true

    render() {
        return html`
            ${new Array(parseInt(this.rows.toString())).fill(0).map(
                () =>
                    html` <div
                        part="base"
                        class=${`skeleton ${this.effect === 'pulse' ? 'skeleton--pulse' : ''} ${this.effect === 'sheen' ? 'skeleton--sheen' : ''}`}
                        style=${this.variableWidths
                            ? `width: ${getRandomIntInclusive(60, 100)}%`
                            : ''}
                    >
                        <div part="indicator" class="skeleton__indicator"></div>
                    </div>`
            )}
        `
    }
}
