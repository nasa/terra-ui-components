import SlBreadcrumbItem from './breadcrumb-item.component.js';

export * from './breadcrumb-item.component.js';
export default SlBreadcrumbItem;

SlBreadcrumbItem.define('gd-breadcrumb-item');

declare global {
  interface HTMLElementTagNameMap {
    'gd-breadcrumb-item': SlBreadcrumbItem;
  }
}
