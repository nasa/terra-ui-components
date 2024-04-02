import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlCopyButton from './copy-button.js';

// We use aria-live to announce labels via tooltips
const ignoredRules = ['button-name'];

describe('<gd-copy-button>', () => {
  let el: SlCopyButton;

  describe('when provided no parameters', () => {
    before(async () => {
      el = await fixture(html`<gd-copy-button value="something"></gd-copy-button> `);
    });

    it('should pass accessibility tests', async () => {
      await expect(el).to.be.accessible({ ignoredRules });
    });
  });
});
