import TerraCollectionVisualization from './collection-visualization.component.js';

export * from './collection-visualization.component.js';
export default TerraCollectionVisualization;

TerraCollectionVisualization.define('terra-collection-visualization');

declare global {
    interface HTMLElementTagNameMap {
      'terra-collection-visualization': TerraCollectionVisualization;
    }
}
