import SlTabPanel from './tab-panel.component.js';

export * from './tab-panel.component.js';
export default SlTabPanel;

SlTabPanel.define('gd-tab-panel');

declare global {
  interface HTMLElementTagNameMap {
    'gd-tab-panel': SlTabPanel;
  }
}
