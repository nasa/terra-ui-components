import TerraDataGrid from './data-grid.component.js';

export * from './data-grid.component.js';
export default TerraDataGrid;

TerraDataGrid.define('terra-data-grid');

declare global {
    interface HTMLElementTagNameMap {
      'terra-data-grid': TerraDataGrid;
    }
}
