import SlSplitPanel from './split-panel.component.js';

export * from './split-panel.component.js';
export default SlSplitPanel;

SlSplitPanel.define('gd-split-panel');

declare global {
  interface HTMLElementTagNameMap {
    'gd-split-panel': SlSplitPanel;
  }
}
