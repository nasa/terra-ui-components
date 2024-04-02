import SlBreadcrumb from './breadcrumb.component.js';

export * from './breadcrumb.component.js';
export default SlBreadcrumb;

SlBreadcrumb.define('gd-breadcrumb');

declare global {
  interface HTMLElementTagNameMap {
    'gd-breadcrumb': SlBreadcrumb;
  }
}
