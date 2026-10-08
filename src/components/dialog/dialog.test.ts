import { elementUpdated, expect, fixture, html } from "@open-wc/testing";
import "./dialog.js";
import sinon from "sinon";
import type TerraDialog from "./dialog.component.js";

describe("<terra-dialog>", () => {
  describe("Basic Rendering", () => {
    it("should render a component", async () => {
      const el = await fixture(html` <terra-dialog></terra-dialog> `);
      expect(el).to.exist;
    });

    it("should render with base part", async () => {
      const el: any = await fixture(html` <terra-dialog></terra-dialog> `);
      const base = el.shadowRoot?.querySelector('[part~="base"]');
      expect(base).to.exist;
    });
  });

  describe("Focus Management", () => {
    afterEach(() => {
      sinon.restore();
    });

    it("traps forward focus and prevents default when pressing Tab in a dialog with no focusable elements", async () => {
      const el = await fixture<TerraDialog>(html`
        <terra-dialog no-header open>
          <p>Static text only with no focusable controls</p>
        </terra-dialog>
      `);
      await elementUpdated(el);

      const focusSpy = sinon.spy(el, "focus");

      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });

      document.dispatchEvent(tabEvent);

      expect(tabEvent.defaultPrevented).to.be.true;
      expect(focusSpy.called).to.be.true;
      expect(
        focusSpy.calledWith({
          focusVisible: false,
          preventScroll: true,
        }),
      ).to.be.true;
    });

    it("traps backward focus and prevents default when pressing Shift+Tab in a dialog with no focusable elements", async () => {
      const el = await fixture<TerraDialog>(html`
        <terra-dialog no-header open>
          <p>Static text only with no focusable controls</p>
        </terra-dialog>
      `);
      await elementUpdated(el);

      const focusSpy = sinon.spy(el, "focus");

      const tabEvent = new KeyboardEvent("keydown", {
        shiftKey: true,
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });

      document.dispatchEvent(tabEvent);

      expect(tabEvent.defaultPrevented).to.be.true;
      expect(focusSpy.called).to.be.true;
      expect(
        focusSpy.calledWith({
          focusVisible: false,
          preventScroll: true,
        }),
      ).to.be.true;
    });
  });
});
