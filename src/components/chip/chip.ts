import EduxChip from './chip.component.js'

export * from './chip.component.js'
export default EduxChip

EduxChip.define('edux-chip')

declare global {
    interface HTMLElementTagNameMap {
        'edux-chip': EduxChip
    }
}
