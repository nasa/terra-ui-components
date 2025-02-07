import TerraGiovanniBrowse from './giovanni-browse.component.js';

export * from './giovanni-browse.component.js';
export default TerraGiovanniBrowse;

TerraGiovanniBrowse.define('terra-giovanni-browse');

declare global {
    interface HTMLElementTagNameMap {
      'terra-giovanni-browse': TerraGiovanniBrowse;
    }
}
