import '../../../dist/gesdisc-components.js';
import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';
import type SlTooltip from './tooltip.js';

describe('<gd-tooltip>', () => {
  it('should be visible with the open attribute', async () => {
    const el = await fixture<SlTooltip>(html`
      <gd-tooltip content="This is a tooltip" open>
        <gd-button>Hover Me</gd-button>
      </gd-tooltip>
    `);
    const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;

    expect(body.hidden).to.be.false;
  });

  it('should not be visible without the open attribute', async () => {
    const el = await fixture<SlTooltip>(html`
      <gd-tooltip content="This is a tooltip">
        <gd-button>Hover Me</gd-button>
      </gd-tooltip>
    `);
    const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;

    expect(body.hidden).to.be.true;
  });

  it('should emit gd-show and gd-after-show when calling show()', async () => {
    const el = await fixture<SlTooltip>(html`
      <gd-tooltip content="This is a tooltip">
        <gd-button>Hover Me</gd-button>
      </gd-tooltip>
    `);
    const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
    const showHandler = sinon.spy();
    const afterShowHandler = sinon.spy();

    el.addEventListener('gd-show', showHandler);
    el.addEventListener('gd-after-show', afterShowHandler);
    el.show();

    await waitUntil(() => showHandler.calledOnce);
    await waitUntil(() => afterShowHandler.calledOnce);

    expect(showHandler).to.have.been.calledOnce;
    expect(afterShowHandler).to.have.been.calledOnce;
    expect(body.hidden).to.be.false;
  });

  it('should emit gd-hide and gd-after-hide when calling hide()', async () => {
    const el = await fixture<SlTooltip>(html`
      <gd-tooltip content="This is a tooltip" open>
        <gd-button>Hover Me</gd-button>
      </gd-tooltip>
    `);
    const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
    const hideHandler = sinon.spy();
    const afterHideHandler = sinon.spy();

    el.addEventListener('gd-hide', hideHandler);
    el.addEventListener('gd-after-hide', afterHideHandler);
    el.hide();

    await waitUntil(() => hideHandler.calledOnce);
    await waitUntil(() => afterHideHandler.calledOnce);

    expect(hideHandler).to.have.been.calledOnce;
    expect(afterHideHandler).to.have.been.calledOnce;
    expect(body.hidden).to.be.true;
  });

  it('should emit gd-show and gd-after-show when setting open = true', async () => {
    const el = await fixture<SlTooltip>(html`
      <gd-tooltip content="This is a tooltip">
        <gd-button>Hover Me</gd-button>
      </gd-tooltip>
    `);
    const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
    const showHandler = sinon.spy();
    const afterShowHandler = sinon.spy();

    el.addEventListener('gd-show', showHandler);
    el.addEventListener('gd-after-show', afterShowHandler);
    el.open = true;

    await waitUntil(() => showHandler.calledOnce);
    await waitUntil(() => afterShowHandler.calledOnce);

    expect(showHandler).to.have.been.calledOnce;
    expect(afterShowHandler).to.have.been.calledOnce;
    expect(body.hidden).to.be.false;
  });

  it('should emit gd-hide and gd-after-hide when setting open = false', async () => {
    const el = await fixture<SlTooltip>(html`
      <gd-tooltip content="This is a tooltip" open>
        <gd-button>Hover Me</gd-button>
      </gd-tooltip>
    `);
    const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
    const hideHandler = sinon.spy();
    const afterHideHandler = sinon.spy();

    el.addEventListener('gd-hide', hideHandler);
    el.addEventListener('gd-after-hide', afterHideHandler);
    el.open = false;

    await waitUntil(() => hideHandler.calledOnce);
    await waitUntil(() => afterHideHandler.calledOnce);

    expect(hideHandler).to.have.been.calledOnce;
    expect(afterHideHandler).to.have.been.calledOnce;
    expect(body.hidden).to.be.true;
  });

  it('should hide the tooltip when tooltip is visible and disabled becomes true', async () => {
    const el = await fixture<SlTooltip>(html`
      <gd-tooltip content="This is a tooltip" open>
        <gd-button>Hover Me</gd-button>
      </gd-tooltip>
    `);
    const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
    const hideHandler = sinon.spy();
    const afterHideHandler = sinon.spy();

    el.addEventListener('gd-hide', hideHandler);
    el.addEventListener('gd-after-hide', afterHideHandler);
    el.disabled = true;

    await waitUntil(() => hideHandler.calledOnce);
    await waitUntil(() => afterHideHandler.calledOnce);

    expect(hideHandler).to.have.been.calledOnce;
    expect(afterHideHandler).to.have.been.calledOnce;
    expect(body.hidden).to.be.true;
  });

  it('should show when open initially', async () => {
    const el = await fixture<SlTooltip>(html`
      <gd-tooltip content="This is a tooltip" open>
        <gd-button>Hover Me</gd-button>
      </gd-tooltip>
    `);
    const body = el.shadowRoot!.querySelector<HTMLElement>('[part~="body"]')!;
    await el.updateComplete;

    expect(body.hidden).to.be.false;
  });

  it('should not accept user selection on the tooltip', async () => {
    const el = await fixture<SlTooltip>(html`
      <gd-tooltip content="This is a tooltip" open>
        <gd-button>Hover Me</gd-button>
      </gd-tooltip>
    `);
    const tooltipBody = el.shadowRoot!.querySelector('.tooltip__body')!;
    const userSelect = getComputedStyle(tooltipBody).userSelect || getComputedStyle(tooltipBody).webkitUserSelect;

    expect(userSelect).to.equal('none');
  });
});
