# Testing Roadmap & Implementation Plan (`@nasa-terra/components`)

This document tracks prioritized testing work across the repository. While [`context/testing-guidelines.md`](./testing-guidelines.md) defines _how_ we write tests (architecture, philosophy, and patterns to emulate), this plan defines _what_ to build or improve next in self-contained, PR-sized increments. When you finish implementing the plan, delete this document.

Every item below must adhere to the Pre-Commit Checklist in [`context/testing-guidelines.md`](./testing-guidelines.md#4-pre-commit-checklist-for-tests).

---

## Phase 1: Test Infrastructure & Type Hygiene

Foundational improvements that pull complexity downwards and make every subsequent test easier and safer to write.

- [ ] **1.1 Fix existing TypeScript errors in test files and include tests in `typecheck`**
    - **Context**: `npm run typecheck` currently runs `tsc --noEmit --project ./tsconfig.prod.json`, which excludes `*.test.ts`. Running `tsc --noEmit --project ./tsconfig.json` surfaces 16 type errors across 6 existing test files (`breadcrumbs`, `browse-variables`, `data-access.component`, `data-access.service`, `data-subsetter.component`, and `earthdata-login.component`).
    - **Scope / A/C**:
        - Resolve all 16 TypeScript errors in those 6 test files (unused imports, untyped `Array.from(...).find(...)` callbacks, and partial `SubsetJobStatus` mock types).
        - Update `package.json` so `npm run typecheck` checks both production and test TypeScript configurations without errors.

- [ ] **1.2 Extract shared network & query test factories into `src/test/`**
    - **Context**: `okJson()`, isolated `QueryClient` host builders (`makeHost()`), and URL-matching `fetch` stubs for CMR, Harmony, and Giovanni are currently duplicated across [`data-subsetter.component.test.ts`](../src/components/data-subsetter/__tests__/data-subsetter.component.test.ts), [`browse-variables.component.test.ts`](../src/components/browse-variables/__tests__/browse-variables.component.test.ts), and [`variable-combobox.component.test.ts`](../src/components/variable-combobox/__tests__/variable-combobox.component.test.ts).
    - **Scope / A/C**:
        - Create `src/test/query-helpers.ts` exporting `createTestQueryClient()` (`retry: false`) and `makeQueryHost()`.
        - Create `src/test/http-helpers.ts` exporting `okJson(body, init?)`, `errorJson(status, body?)`, and composable CMR/Harmony `fetch` route stubbers with `Partial<T>` payload factories.
        - Refactor at least one existing test suite to validate the shared helpers.

---

## Phase 2: Core Form Controls & Interactive Primitives (Good First Issues)

Self-contained UI components with zero external network dependencies. These are ideal first issues and should leverage [`runFormControlBaseTests`](../src/internal/test/form-control-base-tests.ts), [`src/internal/test.ts`](../src/internal/test.ts) (`clickOnElement`, `dragElement`), `sendKeys`, and `await expect(el).to.be.accessible()`.

- [ ] **2.1 `<terra-button>` (`src/components/button/__tests__/button.component.test.ts`)**
    - **Context**: Currently a 0-byte file.
    - **Scope / A/C**:
        - Run `runFormControlBaseTests` for both standard button mode and `href` link mode.
        - Verify rendering of `variant`, `size`, `shape`, `outline`, `circle`, `caret`, and `loading` states, plus `prefix`/`suffix`/default slots.
        - Verify `href` renders an `<a>` tag with `target`, `rel`, and `download` attributes.
        - Verify `disabled` and `loading` prevent click activation and form submission.
        - Verify `terra-focus` and `terra-blur` emission and `await expect(el).to.be.accessible()`.

- [ ] **2.2 `<terra-input>` (`src/components/input/__tests__/input.component.test.ts`)**
    - **Context**: Currently a 10-line stub.
    - **Scope / A/C**:
        - Run `runFormControlBaseTests('terra-input')`.
        - Verify `label`, `helpText`, `errorText`, `placeholder`, `disabled`, `readonly`, and `required` rendering and ARIA attributes.
        - Verify real keyboard typing (`sendKeys`) updates `value` and emits `terra-input` and `terra-change`.
        - Verify `clearable` button clears the input and emits `terra-clear`.
        - Verify `passwordToggle` toggles input `type` between `password` and `text`.
        - Verify `await expect(el).to.be.accessible()` in default and error states.

- [ ] **2.3 `<terra-slider>` (`src/components/slider/__tests__/slider.component.test.ts`)**
    - **Context**: Currently a 10-line stub.
    - **Scope / A/C**:
        - Verify single-value (`value`) and range (`mode="range"`, `startValue`/`endValue`) initialization within `min`/`max`/`step`.
        - Verify `showInputs` numeric inputs synchronize with slider values and emit `terra-slider-change`.
        - Verify `disabled` state prevents interaction and `await expect(el).to.be.accessible()`.

- [ ] **2.4 Selection Form Controls: `<terra-checkbox>`, `<terra-toggle>`, `<terra-radio>`, `<terra-radio-group>`**
    - **Context**: Currently have no test files.
    - **Scope / A/C**:
        - Create `__tests__/<name>.component.test.ts` for each component.
        - Run `runFormControlBaseTests` on `terra-checkbox`, `terra-toggle`, and `terra-radio-group`.
        - Test pointer click (`clickOnElement`) and keyboard (`Space` / arrow key roving tabindex in `terra-radio-group`) toggling `checked` state and emitting `terra-change` / `terra-input`.
        - Test `indeterminate` state on `terra-checkbox` and `disabled`/`required` constraints across all four.
        - Assert `await expect(el).to.be.accessible()` on each.

- [ ] **2.5 Text & Choice Controls: `<terra-textarea>`, `<terra-select>` + `<terra-option>`, `<terra-combobox>`, `<terra-file-upload>`**
    - **Context**: Currently have no test files.
    - **Scope / A/C**:
        - Create `__tests__/<name>.component.test.ts` for each component.
        - For `terra-textarea` and `terra-select`: run `runFormControlBaseTests`, verify keyboard input/selection, `clearable` behavior, `multiple` mode (on `terra-select`), and `terra-change`/`terra-input`/`terra-clear` events.
        - For `terra-combobox`: verify filtering/searching options via keyboard, selection emission via `terra-combobox-change`, and empty/status states.
        - For `terra-file-upload`: verify file selection/drop handling, file list rendering, and `clearFiles()` cleanup.

- [ ] **2.6 Overlays, Menus & Navigation: `<terra-dropdown>`, `<terra-menu>` + `<terra-menu-item>`, `<terra-popup>`, `<terra-tooltip>`, `<terra-toast>`, `<terra-pagination>`**
    - **Context**: Currently have no test files.
    - **Scope / A/C**:
        - Create `__tests__/<name>.component.test.ts` for each component.
        - Verify open/close lifecycles (`show()`/`hide()`, `open` attribute, `Escape` key dismissal, outside-click dismissal) and `terra-show` / `terra-after-show` / `terra-hide` / `terra-after-hide` events.
        - Verify keyboard navigation (`ArrowDown`, `ArrowUp`, `Home`, `End`, `Enter`) across `terra-menu` and `terra-menu-item` (`terra-select`).
        - Verify page calculation and `terra-page-change` event emission on `terra-pagination`.

---

## Phase 3: Untested Controllers, Services & API Clients

Pure TypeScript modules and ReactiveControllers that can be unit-tested quickly without DOM overhead, emulating [`src/controllers/__tests__/harmony-request.controller.test.ts`](../src/controllers/__tests__/harmony-request.controller.test.ts).

- [ ] **3.1 Query & Collection Controllers (`src/controllers/__tests__/`)**
    - **Targets**:
        - [`src/controllers/query.controller.ts`](../src/controllers/query.controller.ts) → `src/controllers/__tests__/query.controller.test.ts`
        - [`src/controllers/mutation.controller.ts`](../src/controllers/mutation.controller.ts) → `src/controllers/__tests__/mutation.controller.test.ts`
        - [`src/controllers/collection.controller.ts`](../src/controllers/collection.controller.ts) → `src/controllers/__tests__/collection.controller.test.ts`
    - **Scope / A/C**:
        - Test host lifecycle attachment (`hostConnected` / `hostDisconnected`) and `requestUpdate()` triggering when query/mutation state transitions (`pending` → `success` / `error`).
        - For `CollectionController`: verify parallel resolution of CMR UMM-C collection metadata and Harmony capabilities into `collectionWithServices`, including partial-failure and `enabled` guard behavior.

- [ ] **3.2 Data Services & Auth (`src/services/__tests__/` & `src/auth/__tests__/`)**
    - **Targets**:
        - [`src/services/cmr-variable.service.ts`](../src/services/cmr-variable.service.ts) → `src/services/__tests__/cmr-variable.service.test.ts`
        - [`src/services/harmony.service.ts`](../src/services/harmony.service.ts) → `src/services/__tests__/harmony.service.test.ts`
        - [`src/auth/auth.service.ts`](../src/auth/auth.service.ts) → `src/auth/__tests__/auth.service.test.ts`
    - **Scope / A/C**:
        - Stub API client / `fetch` boundaries to verify request parameter normalization, response transformation, and HTTP error propagation.
        - For `auth.service.ts`: verify token storage/retrieval, URL query parameter cleanup on redirect, and expiration handling.

- [ ] **3.3 Boundary API Clients (`src/apis/__tests__/`)**
    - **Targets**:
        - [`src/apis/cmr.api.ts`](../src/apis/cmr.api.ts) → `src/apis/__tests__/cmr.api.test.ts`
        - [`src/apis/giovanni.api.ts`](../src/apis/giovanni.api.ts) → `src/apis/__tests__/giovanni.api.test.ts`
        - [`src/apis/gesdisc.api.ts`](../src/apis/gesdisc.api.ts) → `src/apis/__tests__/gesdisc.api.test.ts`
    - **Scope / A/C**:
        - Emulate [`src/apis/__tests__/harmony.api.test.ts`](../src/apis/__tests__/harmony.api.test.ts).
        - Stub `globalThis.fetch` / `apiClient` to verify URL construction, headers (`Authorization`, `Client-Id`), UMM JSON parsing, `CONCEPT_ID_PATTERN` validation, and `HttpException` throwing on non-2xx responses.

---

## Phase 4: Complex Earthdata & Visualization Components

Integration tests for data-intensive components and third-party visualization wrappers (Plotly, AG Grid, OpenLayers, noUiSlider).

- [ ] **4.1 Visualization Wrappers: `<terra-plot>`, `<terra-plot-toolbar>`, `<terra-data-grid>`, `<terra-date-range-slider>`**
    - **Context**: Currently have no test files.
    - **Scope / A/C**:
        - `plot.component.test.ts`: Verify `data`, `layout`, `config`, and `plotTitle` rendering and `terra-plot-relayout` event forwarding.
        - `plot-toolbar.component.test.ts`: Verify toolbar actions and `terra-plot-toolbar-export-image` event emission.
        - `data-grid.component.test.ts`: Verify `columnDefs`/`rowData` initialization, selection, sorting/filtering events (`terra-grid-ready`, `terra-selection-changed`, `terra-sort-changed`), and loading overlay state.
        - `date-range-slider.component.test.ts`: Verify date bound initialization, handle updates, `disabled` state, and `terra-date-range-change` emission.

- [ ] **4.2 Earthdata Workflow Components: `<terra-spatial-picker>`, `<terra-data-subsetter-history>`, `<terra-variable-keyword-search>`, `<terra-login>`**
    - **Context**: `spatial-picker.service.test.ts` exists, but none of these four components have `.component.test.ts` files.
    - **Scope / A/C**:
        - `spatial-picker.component.test.ts`: Verify bounding box / point input parsing, map synchronization, and `terra-map-change` emission.
        - `data-subsetter-history.component.test.ts`: Verify job list rendering from stubbed storage/API, job selection (`terra-harmony-job-select`), and deletion (`terra-harmony-job-delete`).
        - `variable-keyword-search.component.test.ts`: Verify search input debouncing/submission and `terra-variable-keyword-search-change` emission.
        - `login.component.test.ts`: Verify authenticated vs. unauthenticated rendering and `terra-login` event emission.

- [ ] **4.3 Decouple Private State Mutations in Existing Data Component Suites**
    - **Targets**:
        - [`src/components/time-average-map/__tests__/time-average-map.component.test.ts`](../src/components/time-average-map/__tests__/time-average-map.component.test.ts)
        - [`src/components/browse-variables/__tests__/browse-variables.component.test.ts`](../src/components/browse-variables/__tests__/browse-variables.component.test.ts)
    - **Scope / A/C**:
        - Replace direct mutations of internal `@state()` properties (such as setting `el.timeAverageMapError` or `el.showVariablesBrowse` directly) with public property inputs and stubbed controller/fetch responses, per Principle 1 in [`context/testing-guidelines.md`](./testing-guidelines.md#principle-1-test-deep-modules-through-narrow-contracts-information-hiding).

---

## Phase 5: Presentational Primitives & Suite Gardening

Lower-complexity display components and opportunistic cleanup of older, verbose test suites.

- [ ] **5.1 Presentational Components**
    - **Targets**: `caption`, `chip`, `icon`, `scroll-hint`, `site-header`, `site-navigation`, `skeleton`, `status-indicator`, `tag`.
    - **Scope / A/C**:
        - Create concise `__tests__/<name>.component.test.ts` files (typically 30–80 lines each) covering default rendering, slots, interactive removal where applicable (`terra-remove` on `terra-tag` / `terra-chip`), and `await expect(el).to.be.accessible()`.

- [ ] **5.2 Opportunistic Gardening of Oversized Suites**
    - **Targets**: [`date-picker.component.test.ts`](../src/components/date-picker/__tests__/date-picker.component.test.ts) and [`alert.component.test.ts`](../src/components/alert/__tests__/alert.component.test.ts).
    - **Scope / A/C**:
        - When modifying these components, consolidate redundant default-property `it()` blocks and extract shared setup helpers to improve readability and reduce execution time without reducing behavioral coverage.
