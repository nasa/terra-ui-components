import SlQrCode from './qr-code.component.js';

export * from './qr-code.component.js';
export default SlQrCode;

SlQrCode.define('gd-qr-code');

declare global {
  interface HTMLElementTagNameMap {
    'gd-qr-code': SlQrCode;
  }
}
