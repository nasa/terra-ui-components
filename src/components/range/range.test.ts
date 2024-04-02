import '../../../dist/gesdisc-components.js';
import { clickOnElement } from '../../internal/test.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runFormControlBaseTests } from '../../internal/test/form-control-base-tests.js';
import { sendKeys } from '@web/test-runner-commands';
import { serialize } from '../../utilities/form.js';
import sinon from 'sinon';
import type SlRange from './range.js';

describe('<gd-range>', () => {
  it('should pass accessibility tests', async () => {
    const el = await fixture<SlRange>(html` <gd-range label="Name"></gd-range> `);
    await expect(el).to.be.accessible();
  });

  it('default properties', async () => {
    const el = await fixture<SlRange>(html` <gd-range></gd-range> `);

    expect(el.name).to.equal('');
    expect(el.value).to.equal(0);
    expect(el.title).to.equal('');
    expect(el.label).to.equal('');
    expect(el.helpText).to.equal('');
    expect(el.disabled).to.be.false;
    expect(el.checkValidity()).to.be.true;
    expect(el.min).to.equal(0);
    expect(el.max).to.equal(100);
    expect(el.step).to.equal(1);
    expect(el.tooltip).to.equal('top');
    expect(el.defaultValue).to.equal(0);
  });

  it('should have title if title attribute is set', async () => {
    const el = await fixture<SlRange>(html` <gd-range title="Test"></gd-range> `);
    const input = el.shadowRoot!.querySelector('input')!;

    expect(input.title).to.equal('Test');
  });

  it('should be disabled with the disabled attribute', async () => {
    const el = await fixture<SlRange>(html` <gd-range disabled></gd-range> `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('[part~="input"]')!;

    expect(input.disabled).to.be.true;
  });

  describe('when the value changes', () => {
    it('should emit gd-change and gd-input when the value changes from clicking the slider', async () => {
      const el = await fixture<SlRange>(html` <gd-range value="0"></gd-range> `);
      const changeHandler = sinon.spy();
      const inputHandler = sinon.spy();

      el.addEventListener('gd-change', changeHandler);
      el.addEventListener('gd-input', inputHandler);
      await clickOnElement(el, 'right');
      await el.updateComplete;

      expect(el.value).to.equal(100);
      expect(changeHandler).to.have.been.calledOnce;
      expect(inputHandler).to.have.been.calledOnce;
    });

    it('should emit gd-change and gd-input and decrease the value when pressing left arrow', async () => {
      const el = await fixture<SlRange>(html` <gd-range value="50"></gd-range> `);
      const changeHandler = sinon.spy();
      const inputHandler = sinon.spy();

      el.addEventListener('gd-change', changeHandler);
      el.addEventListener('gd-input', inputHandler);
      el.focus();
      await sendKeys({ press: 'ArrowLeft' });
      await el.updateComplete;

      expect(el.value).to.equal(49);
      expect(changeHandler).to.have.been.calledOnce;
      expect(inputHandler).to.have.been.calledOnce;
    });

    it('should emit gd-change and gd-input and decrease the value when pressing right arrow', async () => {
      const el = await fixture<SlRange>(html` <gd-range value="50"></gd-range> `);
      const changeHandler = sinon.spy();
      const inputHandler = sinon.spy();

      el.addEventListener('gd-change', changeHandler);
      el.addEventListener('gd-input', inputHandler);
      el.focus();
      await sendKeys({ press: 'ArrowRight' });
      await el.updateComplete;

      expect(el.value).to.equal(51);
      expect(changeHandler).to.have.been.calledOnce;
      expect(inputHandler).to.have.been.calledOnce;
    });

    it('should not emit gd-change or gd-input when changing the value programmatically', async () => {
      const el = await fixture<SlRange>(html` <gd-range value="0"></gd-range> `);

      el.addEventListener('gd-change', () => expect.fail('gd-change should not be emitted'));
      el.addEventListener('gd-input', () => expect.fail('gd-input should not be emitted'));
      el.value = 50;

      await el.updateComplete;
    });

    it('should not emit gd-change or gd-input when stepUp() is called programmatically', async () => {
      const el = await fixture<SlRange>(html` <gd-range step="2" value="2"></gd-range> `);

      el.addEventListener('gd-change', () => expect.fail('gd-change should not be emitted'));
      el.addEventListener('gd-input', () => expect.fail('gd-input should not be emitted'));
      el.stepUp();
      await el.updateComplete;
    });

    it('should not emit gd-change or gd-input when stepDown() is called programmatically', async () => {
      const el = await fixture<SlRange>(html` <gd-range step="2" value="2"></gd-range> `);

      el.addEventListener('gd-change', () => expect.fail('gd-change should not be emitted'));
      el.addEventListener('gd-input', () => expect.fail('gd-input should not be emitted'));
      el.stepDown();
      await el.updateComplete;
    });
  });

  describe('step', () => {
    it('should increment by step when stepUp() is called', async () => {
      const el = await fixture<SlRange>(html` <gd-range step="2" value="2"></gd-range> `);

      el.stepUp();
      await el.updateComplete;
      expect(el.value).to.equal(4);
    });

    it('should decrement by step when stepDown() is called', async () => {
      const el = await fixture<SlRange>(html` <gd-range step="2" value="2"></gd-range> `);

      el.stepDown();
      await el.updateComplete;
      expect(el.value).to.equal(0);
    });
  });

  describe('when submitting a form', () => {
    it('should serialize its name and value with FormData', async () => {
      const form = await fixture<HTMLFormElement>(html` <form><gd-range name="a" value="1"></gd-range></form> `);
      const formData = new FormData(form);
      expect(formData.get('a')).to.equal('1');
    });

    it('should serialize its name and value with JSON', async () => {
      const form = await fixture<HTMLFormElement>(html` <form><gd-range name="a" value="1"></gd-range></form> `);
      const json = serialize(form);
      expect(json.a).to.equal('1');
    });

    it('should be invalid when setCustomValidity() is called with a non-empty value', async () => {
      const range = await fixture<HTMLFormElement>(html` <gd-range></gd-range> `);

      range.setCustomValidity('Invalid selection');
      await range.updateComplete;

      expect(range.checkValidity()).to.be.false;
      expect(range.hasAttribute('data-invalid')).to.be.true;
      expect(range.hasAttribute('data-valid')).to.be.false;
      expect(range.hasAttribute('data-user-invalid')).to.be.false;
      expect(range.hasAttribute('data-user-valid')).to.be.false;

      await clickOnElement(range);
      await range.updateComplete;
      range.blur();
      await range.updateComplete;

      expect(range.hasAttribute('data-user-invalid')).to.be.true;
      expect(range.hasAttribute('data-user-valid')).to.be.false;
    });

    it('should receive validation attributes ("states") even when novalidate is used on the parent form', async () => {
      const el = await fixture<HTMLFormElement>(html` <form novalidate><gd-range></gd-range></form> `);
      const range = el.querySelector<SlRange>('gd-range')!;

      range.setCustomValidity('Invalid value');
      await range.updateComplete;

      expect(range.hasAttribute('data-invalid')).to.be.true;
      expect(range.hasAttribute('data-valid')).to.be.false;
      expect(range.hasAttribute('data-user-invalid')).to.be.false;
      expect(range.hasAttribute('data-user-valid')).to.be.false;
    });

    it('should be present in form data when using the form attribute and located outside of a <form>', async () => {
      const el = await fixture<HTMLFormElement>(html`
        <div>
          <form id="f">
            <gd-button type="submit">Submit</gd-button>
          </form>
          <gd-range form="f" name="a" value="50"></gd-range>
        </div>
      `);
      const form = el.querySelector('form')!;
      const formData = new FormData(form);

      expect(formData.get('a')).to.equal('50');
    });
  });

  describe('when resetting a form', () => {
    it('should reset the element to its initial value', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <gd-range name="a" value="99"></gd-range>
          <gd-button type="reset">Reset</gd-button>
        </form>
      `);
      const button = form.querySelector('gd-button')!;
      const input = form.querySelector('gd-range')!;
      input.value = 80;

      await input.updateComplete;

      setTimeout(() => button.click());
      await oneEvent(form, 'reset');
      await input.updateComplete;

      expect(input.value).to.equal(99);

      input.defaultValue = 0;

      setTimeout(() => button.click());
      await oneEvent(form, 'reset');
      await input.updateComplete;

      expect(input.value).to.equal(0);
    });
  });

  runFormControlBaseTests('gd-range');
});
