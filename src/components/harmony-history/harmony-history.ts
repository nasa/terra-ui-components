import TerraHarmonyHistory from './harmony-history.component.js';

export * from './harmony-history.component.js';
export default TerraHarmonyHistory;

TerraHarmonyHistory.define('terra-harmony-history');

declare global {
    interface HTMLElementTagNameMap {
      'terra-harmony-history': TerraHarmonyHistory;
    }
}
