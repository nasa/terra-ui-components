import TerraCard from './card.component.js';

export * from './card.component.js';
export default TerraCard;

TerraCard.define('terra-card');

declare global {
    interface HTMLElementTagNameMap {
      'terra-card': TerraCard;
    }
}
