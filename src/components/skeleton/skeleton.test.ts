import '../../../dist/gesdisc-components.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlSkeleton from './skeleton.js';

describe('<gd-skeleton>', () => {
  it('should render default skeleton', async () => {
    const el = await fixture<SlSkeleton>(html` <gd-skeleton></gd-skeleton> `);

    await expect(el).to.be.accessible();

    const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;
    const indicator = el.shadowRoot!.querySelector<HTMLElement>('[part~="indicator"]')!;

    expect(base.getAttribute('class')).to.equal(' skeleton ');
    expect(indicator.getAttribute('class')).to.equal('skeleton__indicator');
  });

  it('should set pulse effect by attribute', async () => {
    const el = await fixture<SlSkeleton>(html` <gd-skeleton effect="pulse"></gd-skeleton> `);

    const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

    expect(base.getAttribute('class')).to.equal(' skeleton skeleton--pulse ');
  });

  it('should set sheen effect by attribute', async () => {
    const el = await fixture<SlSkeleton>(html` <gd-skeleton effect="sheen"></gd-skeleton> `);

    const base = el.shadowRoot!.querySelector<HTMLElement>('[part~="base"]')!;

    expect(base.getAttribute('class')).to.equal(' skeleton skeleton--sheen ');
  });
});
