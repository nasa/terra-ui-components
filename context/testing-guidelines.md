# Testing Guide (`@nasa-terra/components`)

This guide defines the testing architecture, engineering principles, and patterns to emulate for all TypeScript, Lit web component, controller, and service tests in this repository. Both human developers and AI coding agents must follow these standards.

---

## 1. Web Test Runner (WTR) Architecture & Commands

Tests run in **real headless browsers** (Chromium, Firefox, and WebKit) via [`@web/test-runner`](../web-test-runner.config.js) and Playwright.

### Commands

```bash
# Run typechecking (tsc --noEmit) followed by the full test suite across all 3 browsers
npm test

# Run the full unit/component test suite without tsc
npm run test:unit

# Run all tests in watch mode
npm run test:watch

# Run a single test file group by its basename (before .test.ts)
npm run test:component <group-name>
# Examples:
#   npm run test:component map.component
#   npm run test:component harmony-request.controller

# Run a single test file group in watch mode
npm run test:component <group-name> -- --watch
```

### How `web-test-runner.config.js` Works

1. **File Discovery & Dynamic Groups**:
    - WTR globs `src/**/*.test.ts` for the `default` group.
    - Every `*.test.ts` file is automatically registered as a named group using the filename stem before `.test.ts` (`^.*\/(?<fileName>.*)\.test\.ts`).
    - **Uniqueness requirement**: Because group names come from the filename stem, **every test file must have a globally unique basename** (e.g., `map.component.test.ts`, `map.service.test.ts`, `harmony-request.controller.test.ts`).
2. **File Placement Convention**:
    - Place tests in a `__tests__/` subdirectory adjacent to the code under test:
        - Components: `src/components/<name>/__tests__/<name>.component.test.ts`
        - Component sub-modules: `src/components/<name>/layers/__tests__/<layer>.layer.test.ts`
        - Controllers: `src/controllers/__tests__/<name>.controller.test.ts`
        - Services / APIs / Mixins: `src/services/__tests__/<name>.service.test.ts`, `src/apis/__tests__/<name>.api.test.ts`, `src/mixins/__tests__/<name>.mixin.test.ts`
3. **Custom WTR Plugins**:
    - **`blockDistImportsPlugin`**: Forbids importing from `dist/` inside `.test.ts` files. Always import directly from source modules using `.js` specifiers (e.g., `import '../map.js'`).
    - **`horizonThemePlugin`**: Compiles `src/themes/horizon.scss` on the fly and injects `/dist/themes/horizon.css` into the test runner HTML so CSS custom properties and design tokens are present during tests.
    - **`resolveTestImages`**: Serves static test files from `src/test/fixtures/` when present, stubs `/assets/icons/*` and `*.svg` with an empty `<svg>`, and intercepts raster image URLs (`*.jpg|png|gif|webp`) with a 1×1 transparent GIF so tests never 404 or hit the network for images.
4. **Execution Environment**:
    - `@web/dev-server-esbuild` compiles TypeScript on the fly (`es2020`). Because esbuild strips types without typechecking, always ensure `npm run typecheck` passes alongside WTR.
    - Mocha is configured with `timeout: 8000` and `retries: 1`, and `concurrentBrowsers: 1` to prevent CPU contention across Chromium, Firefox, and WebKit.

---

## 2. Core Testing Philosophy

Our testing philosophy draws directly from John Ousterhout's _A Philosophy of Software Design_ and Andy Hunt & Dave Thomas's _The Pragmatic Programmer_.

### Principle 1: Test Deep Modules Through Narrow Contracts (Information Hiding)

A component, controller, or service should be treated as a **deep module**: rich internal behavior hidden behind a narrow, stable public contract.

- **Drive tests exclusively through public inputs**: HTML attributes, JS properties, slots, public methods, user interactions (mouse/keyboard), and stubbed external I/O boundaries (`fetch` or API modules).
- **Assert exclusively on observable outputs**: Rendered DOM semantics (`[part="..."]`, ARIA roles/attributes, visible text), emitted `terra-*` custom events, return values, and outbound API calls.
- **Do not couple to hidden internals**: Never read or mutate `@state()` fields, private properties (`_foo`), or internal controller methods just to force a component into a state that is reachable through public inputs or stubbed network responses. Refactoring private implementation details must not break tests.

### Principle 2: Pull Complexity Downwards into Factories & Harness Helpers

In a test file, each `it()` block is the specification that humans read; test helpers and builders are the implementation.

- Keep individual `it()` blocks to **~5–15 lines** structured clearly as **Arrange → Act → Assert**.
- Pull noisy setup—such as constructing UMM-C metadata, Harmony job payloads, WMTS XML capabilities, or controller hosts—down into composable factory functions with `Partial<T>` overrides at the top of the suite or in `src/test/`.
- **Exemplars to emulate**:
    - [`src/controllers/__tests__/harmony-request.controller.test.ts`](../src/controllers/__tests__/harmony-request.controller.test.ts) (`makeHarmonyRequest()`, `makeJob()`, `makeHost()`)
    - [`src/components/map/__tests__/map.component.test.ts`](../src/components/map/__tests__/map.component.test.ts) (`makeCapabilitiesXml()`, focused `describe` blocks per capability)

### Principle 3: Orthogonality & Zero State Leakage

Tests must be completely orthogonal: running Test A must never affect Test B, regardless of execution order.

- **Always restore stubs and timers**: Include `afterEach(() => sinon.restore())` in every suite that uses Sinon spies, stubs, or fake timers.
- **Isolate TanStack `QueryClient` state**: Components using `QueryClientMixin` default to `sharedQueryClient` (which caches for 15 minutes, retries failed requests up to 3 times, and persists to IndexedDB). In tests, provide a fresh, isolated client with retries disabled so tests never leak cache state or time out waiting for retry backoff:
    ```ts
    new QueryClient({
        defaultOptions: { queries: { retry: false } },
    })
    ```
- **Never make live network requests**: Always stub `globalThis.fetch` or the boundary API client (`harmonyApi`, `apiClient`, etc.) before mounting components or running controllers that trigger network queries.

### Principle 4: Test Behavior and State Transitions, Not the Framework

Avoid tautological tests that only test Lit's `@property()` decorator.

- **Don't write standalone getter/setter tests** like `el.foo = 'bar'; expect(el.foo).to.equal('bar')` when `foo` has no custom converter or side effect.
- **Do test observable property effects**:
    - Custom attribute converters / parsing (e.g., parsing JSON vs. comma-separated strings, falling back safely on malformed input).
    - Attribute reflection (`reflect: true`) when CSS or host semantics depend on the attribute.
    - DOM updates, ARIA state changes, or triggered requests resulting from the property change.
- **Consolidate default state assertions**: Verify a component's initial default state in one cohesive test rather than scattering redundant default checks across multiple `describe` blocks.

### Principle 5: Split Pure Logic/Controller Tests from UI Integration Tests

For data-intensive features (CMR, Harmony, Giovanni, OpenLayers, Plotly, AG Grid), separate concerns across two testing layers:

1. **Controller / Service / Model Unit Tests** (e.g., [`harmony-request.controller.test.ts`](../src/controllers/__tests__/harmony-request.controller.test.ts), [`harmony.request.test.ts`](../src/lib/harmony/__tests__/harmony.request.test.ts), [`LatLngBounds.test.ts`](../src/components/map/models/__tests__/LatLngBounds.test.ts)):
    - Test combinatorial logic, request deduplication, caching, pagination, coordinate math, and error handling without DOM rendering overhead.
2. **Component Integration Tests** (e.g., [`map.component.test.ts`](../src/components/map/__tests__/map.component.test.ts)):
    - Verify that the custom element correctly wires its attributes/properties, slots, user interactions, loading/error UI states, and `terra-*` events to its underlying controllers.

### Principle 6: Design by Contract — Real Browser Input, Accessibility & Form Controls

Because WTR runs in real browsers, verify real browser contracts rather than relying solely on synthetic JS calls:

- **Accessibility Invariant**: Assert axe accessibility compliance on interactive components in both their default and open/active states:
    ```ts
    await expect(el).to.be.accessible()
    ```
- **Form Control Contract**: Every component implementing `TerraFormControl` must run the shared validity contract suite from [`src/internal/test/form-control-base-tests.ts`](../src/internal/test/form-control-base-tests.ts):
    ```ts
    import { runFormControlBaseTests } from '../../../internal/test/form-control-base-tests.js'

    runFormControlBaseTests('terra-input')
    ```
- **Real User Input**: Prefer [`clickOnElement`](../src/internal/test.ts), [`moveMouseOnElement`](../src/internal/test.ts), [`dragElement`](../src/internal/test.ts) (from `src/internal/test.ts`) and `sendKeys` (from `@web/test-runner-commands`) when testing keyboard navigation, focus traps, hover states, and drag interactions.

### Principle 7: Find Bugs Once

Every bug fix must include a focused regression test that reproduces the exact failure mode through the public contract before the fix and passes after it.

---

## 3. Canonical Patterns to Emulate

### Pattern A: Testing a Reactive Controller in Isolation ("Brains Without the Skin")

Emulate [`src/controllers/__tests__/harmony-request.controller.test.ts`](../src/controllers/__tests__/harmony-request.controller.test.ts).

#### Why This Pattern Works (Software Engineering Context)

1. **Orthogonality — Separating "Brains" from "Skin" (_The Pragmatic Programmer_)**:
   In UI engineering, we separate _visual presentation_ (the Lit component) from _stateful orchestration and data fetching_ (the `ReactiveController`). Hunt & Thomas call this **Orthogonality**: decoupling things so one can change—and be tested—without dragging along the other. If you mount a full `<terra-data-subsetter>` component just to test whether an expired Harmony job is ignored, the browser has to build Shadow DOM trees, initialize OpenLayers maps, and fire unrelated network queries. Testing the controller directly tests the "brains" in milliseconds with zero visual overhead.
2. **Information Hiding via a Minimal `makeHost()` (_A Philosophy of Software Design_)**:
   A controller normally attaches to a Lit component (its "host") and calls `host.requestUpdate()` whenever data changes so the component knows to re-render. Because of Ousterhout's **Information Hiding**, the controller doesn't care _which_ component it's attached to—it only cares about a tiny 4-method contract (`ReactiveControllerHost & QueryClientHost`). `makeHost()` creates a lightweight stand-in object that satisfies that contract and gives each test a brand-new `QueryClient` with `retry: false` (so failed requests fail immediately instead of retrying 3 times and stalling the test).
3. **Pulling Complexity Downwards with `makeJob()` (_A Philosophy of Software Design_)**:
   A real `SubsetJobStatus` object from NASA's Harmony API has 10 required fields (`jobID`, `createdAt`, `updatedAt`, `links`, etc.), even when a test only cares about one field (`status: Status.CANCELED`). Ousterhout teaches us to **Pull Complexity Downwards**: hide the 9 irrelevant fields inside a `makeJob(overrides)` helper at the top of the file. Inside the `it()` block, the only field you pass is `makeJob({ status: Status.CANCELED })`—making cause and effect immediately obvious to the next reader.
4. **Replacing Real Network Calls with a `sinon.stub` (_The Pragmatic Programmer_)**:
   `sinon.stub(harmonyApi, 'cancelJob').resolves(...)` temporarily replaces the real network method with a programmable stand-in ("stub") that immediately returns fake data and records how it was called. `afterEach(() => sinon.restore())` peels that stub off after every test so the next test starts clean.

```ts
import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { QueryClient } from '@tanstack/query-core'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { harmonyApi, Status, type SubsetJobStatus } from '../../apis/harmony.api.js'
import type { QueryClientHost } from '../../mixins/query-client.mixin.js'
import { HarmonyRequestController } from '../harmony-request.controller.js'

// Factory helper: supplies valid defaults for all 10 required fields so individual
// tests only specify the 1 or 2 fields relevant to their scenario.
function makeJob(overrides: Partial<SubsetJobStatus> = {}): SubsetJobStatus {
    return {
        jobID: 'job-1',
        status: Status.RUNNING,
        message: '',
        progress: 50,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        dataExpiration: '2026-04-01T00:00:00.000Z',
        request: 'https://harmony.earthdata.nasa.gov/...',
        numInputGranules: 1,
        links: [],
        ...overrides,
    }
}

// Stand-in host: satisfies the controller's interface without rendering a DOM element,
// and creates a fresh QueryClient per test with retries disabled.
function makeHost(): ReactiveControllerHost & QueryClientHost {
    const controllers: ReactiveController[] = []
    return {
        addController: controller => controllers.push(controller),
        removeController: () => {},
        requestUpdate: () => {},
        get updateComplete() {
            return Promise.resolve(true)
        },
        queryClient: new QueryClient({
            defaultOptions: { queries: { retry: false } },
        }),
    }
}

describe('HarmonyRequestController', () => {
    afterEach(() => {
        // Always remove stubs after each test so tests stay orthogonal
        sinon.restore()
    })

    it('cancels the active job when cancelJob is called', async () => {
        // Arrange: intercept the network call and return a CANCELED job
        const cancelStub = sinon
            .stub(harmonyApi, 'cancelJob')
            .resolves(makeJob({ status: Status.CANCELED }))
        const controller = new HarmonyRequestController(makeHost())

        // Act: invoke the public controller method
        await controller.cancelJob({
            jobId: 'job-1',
            options: { bearerToken: 'tok' },
        })

        // Assert: verify the controller passed the exact expected arguments to the API
        expect(cancelStub.calledOnceWithExactly('job-1', { bearerToken: 'tok' })).to
            .be.true
    })
})
```

---

### Pattern B: Testing a Component's Public Contract & Events

Emulate [`src/components/map/__tests__/map.component.test.ts`](../src/components/map/__tests__/map.component.test.ts).

#### Why This Pattern Works (Software Engineering Context)

1. **Testing Both Doors into a Web Component — Attributes vs. Properties (_A Philosophy of Software Design_)**:
   Custom elements have two public entry points:
    - **HTML Attributes** (`<terra-map layers='[...]'>`): Always arrive from HTML as raw _strings_ and must be parsed by the component's converter.
    - **JavaScript Properties** (`el.layers = [...]`): Arrive as typed JavaScript arrays or objects.
      Ousterhout emphasizes **Defining Errors Out of Existence**: instead of crashing when a user passes invalid JSON in HTML (`layers="not-json"`), a well-designed component catches the parse error internally and falls back to an empty array `[]`. Testing both valid and malformed attribute strings locks in that resilient boundary.
2. **Respecting Information Hiding Through Public Postconditions (_A Philosophy of Software Design_)**:
   Notice how the second test verifies the layer was created: it calls the public method `el.getLayer('imagery')` and listens for the public event `terra-map-layer-change`, rather than reaching into private internal arrays (`el._olMap.layers`). Because the test only touches the public surface, you can refactor the internal OpenLayers setup later without breaking the test.
3. **Handling Asynchronous Time Deterministically — `oneEvent` and `waitUntil` (_The Pragmatic Programmer_)**:
   Lit components batch their DOM updates asynchronously (like frames in an animation). If you change `el.layers = ...` and check the DOM on the very next line without `await`, the component hasn't re-rendered yet.
    - We create `const eventPromise = oneEvent(el, 'terra-map-layer-change')` **before** changing `el.layers` so our listener is already waiting when the event fires.
    - We use `await waitUntil(() => Boolean(el.getLayer('imagery')))` to poll until the observable condition is true, rather than guessing with a brittle `setTimeout(..., 500)` (which is either too slow on a fast machine or too short on a busy CI runner).

```ts
import { expect, fixture, html, oneEvent, waitUntil } from '@open-wc/testing'
import sinon from 'sinon'
import type TerraMap from '../map.component.js'
import '../map.js'

describe('<terra-map>', () => {
    afterEach(() => {
        sinon.restore()
    })

    describe('layers attribute parsing', () => {
        it('parses a valid JSON array and falls back to [] on invalid input', async () => {
            // Valid HTML attribute string -> parsed into a JS array on el.layers
            const valid = await fixture<TerraMap>(html`
                <terra-map
                    layers='[{ "type": "gibs", "name": "imagery", "layer": "TestLayer" }]'
                ></terra-map>
            `)
            expect(valid.layers).to.deep.equal([
                { type: 'gibs', name: 'imagery', layer: 'TestLayer' },
            ])

            // Malformed HTML attribute string -> safely falls back to [] without throwing
            const invalid = await fixture<TerraMap>(
                html`<terra-map layers="not-json"></terra-map>`
            )
            expect(invalid.layers).to.deep.equal([])
        })
    })

    describe('layer lifecycle events', () => {
        it('emits terra-map-layer-change once a configured layer is built', async () => {
            const el = await fixture<TerraMap>(html`<terra-map></terra-map>`)

            // Start listening BEFORE triggering the change so we never miss the event
            const eventPromise = oneEvent(el, 'terra-map-layer-change')

            // Act: assign the JS property
            el.layers = [{ type: 'gibs', name: 'imagery', layer: 'TestLayer' }]

            // Assert: wait for the public event and public postcondition
            const event = await eventPromise
            expect(event.detail).to.deep.equal({ name: 'imagery', type: 'gibs' })
            await waitUntil(() => Boolean(el.getLayer('imagery')))
        })
    })
})
```

---

### Pattern C: Testing Interactive UI, Keyboard Navigation & Accessibility

Use `@open-wc/testing` axe assertions, `oneEvent`, and `@web/test-runner-commands` / [`src/internal/test.ts`](../src/internal/test.ts) for real pointer and keyboard interactions.

#### Why This Pattern Works (Software Engineering Context)

1. **Design by Contract — Real Browser Input vs. Synthetic Events (_The Pragmatic Programmer_)**:
   In a browser, calling `summary.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))` only notifies JavaScript functions that manually called `addEventListener('keydown', ...)`. It does **not** trigger the browser's built-in behavior—like pressing `Enter` or `Space` to toggle a native `<details>`/`<summary>`, submitting a `<form>`, or moving focus with `Tab`. Similarly, calling `el.click()` in JS bypasses CSS `pointer-events: none` and visibility checks.
   Using `sendKeys({ press: 'Enter' })` and `clickOnElement(el)` instructs Playwright to send **real OS/browser-level keystrokes and mouse clicks** across Chromium, Firefox, and WebKit—testing the true user experience contract.
2. **Understanding `el.shadowRoot` Lookups**:
   Web components encapsulate their internal markup inside a **Shadow DOM** (`el.shadowRoot`) so their styles and structure don't collide with the rest of the page. Slotted children passed _into_ the component (`<p>Bounding box controls</p>`) live in the outer Light DOM (`el.querySelector('p')`), whereas elements rendered _by_ the component's template (like `<summary>` or `[part="base"]`) live inside `el.shadowRoot.querySelector(...)`.
3. **Verifying Accessibility as a State Invariant (_The Pragmatic Programmer_)**:
   Accessibility is not a static property of the initial render; it is an **invariant** that must hold across every visual state. Many ARIA bugs (missing `aria-expanded` updates, unlabeled controls, broken contrast, or invalid roles) only appear _after_ a component opens or enters an error state. Calling `await expect(el).to.be.accessible()` both before and after interaction verifies that the accessibility tree stays valid through the transition.

```ts
import { expect, fixture, html, oneEvent } from '@open-wc/testing'
import { sendKeys } from '@web/test-runner-commands'
import { clickOnElement } from '../../../internal/test.js'
import type TerraAccordion from '../accordion.component.js'
import '../accordion.js'

describe('<terra-accordion>', () => {
    it('renders closed by default and passes accessibility checks', async () => {
        const el = await fixture<TerraAccordion>(html`
            <terra-accordion summary="Spatial Extent">
                <p>Bounding box controls</p>
            </terra-accordion>
        `)

        expect(el.open).to.be.false
        await expect(el).to.be.accessible()
    })

    it('toggles open state via keyboard and emits terra-accordion-toggle', async () => {
        const el = await fixture<TerraAccordion>(html`
            <terra-accordion summary="Spatial Extent">
                <p>Bounding box controls</p>
            </terra-accordion>
        `)
        // Query inside shadowRoot for elements rendered by the component's own template
        const summary = el.shadowRoot!.querySelector('summary')!

        // Focus the interactive element and send a real browser 'Enter' keystroke
        summary.focus()
        const toggleEvent = oneEvent(el, 'terra-accordion-toggle')
        await sendKeys({ press: 'Enter' })

        // Verify the emitted event payload, updated state, and open-state accessibility
        const event = await toggleEvent
        expect(event.detail.open).to.be.true
        expect(el.open).to.be.true
        await expect(el).to.be.accessible()
    })
})
```

---

## 4. Pre-Commit Checklist for Tests

Before considering any new component, controller, or bug fix complete:

1. **Unique group name**: The test file is placed in `__tests__/<unique-name>.test.ts` and can be targeted individually via `npm run test:component <unique-name>`.
2. **Contract coverage**: Public properties/converters, slots, user interactions (mouse & keyboard), custom events (`terra-*`), error/loading states, and accessibility (`to.be.accessible()`) are covered without reaching into private state.
3. **Isolation**: `sinon.restore()` runs in `afterEach`, `QueryClient` instances are isolated with `retry: false`, and zero live network calls are made.
4. **Verification**: Both `npm run typecheck` and `npm run test:component <unique-name>` pass across Chromium, Firefox, and WebKit.
