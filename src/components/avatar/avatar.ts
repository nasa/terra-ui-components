import SlAvatar from './avatar.component.js';

export * from './avatar.component.js';
export default SlAvatar;

SlAvatar.define('gd-avatar');

declare global {
  interface HTMLElementTagNameMap {
    'gd-avatar': SlAvatar;
  }
}
