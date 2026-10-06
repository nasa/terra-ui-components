# Layer support for terra-map (GIBS tiles + Harmony GeoTIFFs)

## Context

`terra-map` already exposes a generic, imperative layer API: `addLayer(layer, { name, position })`, `removeLayer(name)`, and `getLayer(name)` (`src/components/map/map.component.ts`, backed by `MapService` in `src/components/map/map.service.ts`). The caller builds a real OpenLayers layer object however it likes and hands it to `terra-map`, which just hosts it in its layer stack (`[base, borders, labels, graticule, shapes, draw]`, with new layers inserted above `base` and below `borders`/`labels` by default, or on top via `position: 'top'`). `time-average-map` already uses exactly this API today for its GeoTIFF overlay and its profile-line vector layer (`time-average-map.component.ts`, `innerMap.addLayer(...)` / `innerMap.removeLayer(...)`).

Toggling visibility/opacity needs no new API: `getLayer(name)` returns the actual OL layer, which already has `.setVisible()`/`.setOpacity()`.

What's missing is the *construction* side for two specific kinds of layers, so consumers don't have to hand-roll OpenLayers source/layer setup or Harmony job polling themselves:

- **GIBS tile layers** — nothing for this exists in the repo today. Scope for this pass: caller supplies a fully-resolved XYZ tile URL template (GIBS-specific params like `{Time}` already baked in). Resolving a bare CMR collection/concept id to a GIBS layer automatically is out of scope — no code in this repo maps a collection to a GIBS layer today, and it needs verification against real CMR data first.
- **Harmony-resolved GeoTIFF layers** — the construction and polling logic exists today, but it's private to `time-average-map.controller.ts` / `time-average-map.component.ts` and entangled with that component's graticule-fit/pixel-value/thumbnail extras. It needs a reusable core extracted so any component can add a Harmony-backed GeoTIFF layer to a `terra-map` via `addLayer()`.

## Implementation

### 1. GIBS tile layer builder — `src/components/map/layers/gibs.layer.ts` (new)

Follow the existing pattern in `src/components/map/layers/base.layer.ts` (plain `ol/layer/Tile.js` + `ol/source/ImageTile.js` — not `WebGLTileLayer`; WebGL in this codebase is only used for the GeoTIFF raster layer, where band selection needs it):

```ts
export type GibsLayerOptions = {
    url: string // fully-resolved XYZ template ({z}/{x}/{y}); caller bakes in GIBS-specific params (e.g. {Time})
    noWorldWrap?: boolean
}

export class GibsLayer extends TileLayer {
    constructor(options: GibsLayerOptions) {
        super({
            source: new ImageTile({
                url: options.url,
                ...(options.noWorldWrap ? { wrapX: false } : {}),
            }),
        })
    }
}
```

Pure and synchronous — OL tile sources fetch lazily per-tile, no loading state needed. Consumer usage: `map.addLayer(new GibsLayer({ url }), { name: 'gibs-aerosol' })`.

GIBS is a public NASA service with permissive CORS headers, so no `crossOrigin`/CORS spike is needed here — no different from the existing ArcGIS-backed `base.layer.ts`.

### 2. GeoTIFF layer builder — `src/components/map/layers/geotiff.layer.ts` (new)

Extract the layer-construction core out of `time-average-map.component.ts`'s `updateGeoTIFFLayer` (currently ~lines 726-780) into a standalone async factory — a factory function, not a class, since it needs the dynamic `import('ol/source/GeoTIFF.js')` `time-average-map` already does:

```ts
export type GeoTiffLayerOptions = {
    bands?: number[] // default [1]
    nodata?: number
}

export async function createGeoTiffLayer(
    blob: Blob,
    options: GeoTiffLayerOptions = {}
): Promise<WebGLTileLayer> {
    const { default: GeoTIFF } = await import('ol/source/GeoTIFF.js')
    // same GeoTIFF source + WebGLTileLayer construction as today's
    // updateGeoTIFFLayer, minus the graticule/border-fit/pixel-value extras
}
```

Refactor `time-average-map.component.ts#updateGeoTIFFLayer` to call this instead of constructing the source/layer inline, keeping its own fit-to-extent/pixel-value/thumbnail logic wrapped around the call — mechanical, behavior-preserving.

### 3. Harmony job polling utils — `src/lib/harmony/harmony-job-polling.ts` (new)

Extract the host-agnostic pieces of `time-average-map.controller.ts`'s Harmony polling (`#waitForHarmonyJob`, `#sleep`, and the `Status.FAILED`/`Status.COMPLETE_WITH_ERRORS` branching currently duplicated twice in that file) into plain functions, decoupled from `HarmonyRequestController` so they're reusable:

```ts
export async function waitForHarmonyJob(
    jobId: string,
    getStatus: () => SubsetJobStatus | null,
    signal: AbortSignal,
    options?: { intervalMs?: number; onUpdate?: (status: SubsetJobStatus) => void }
): Promise<SubsetJobStatus>

export function getHarmonyJobError(
    jobStatus: SubsetJobStatus
): { message: string; jobErrors?: SubsetJobError[] } | null
```

Update `time-average-map.controller.ts` to call these instead of its private equivalents — mechanical refactor, add test coverage here since none exists today for this logic (see Testing).

Leave `#fetchJobBlob` and `HARMONY_LINK_PROXY_URL` completely untouched, private to `time-average-map.controller.ts` — do not extract, refactor, or reuse them. That proxy covers two specific, internal cases that only `time-average-map` needs:

1. **Anonymous/unauthenticated users** — `time-average-map` is the one place in this codebase that allows anonymous access; that's not normal behavior anywhere else and must not be assumed for a new, general-purpose `terra-map` layer helper.
2. **Certain Giovanni-hosted files** — some Harmony job data links point at Giovanni infrastructure that needs proxying independent of auth.

Neither case applies to GIBS layers or to the new public `GeoTiffLayerRequestController` (Step 4), and neither should ever be exposed to a `terra-map` consumer. The new pieces below are for authenticated (`bearerToken`-required), direct-fetch-only use and must stay proxy-agnostic and Giovanni-agnostic. Because `#fetchJobBlob`/`HARMONY_LINK_PROXY_URL` aren't touched by this work, `time-average-map`'s existing anonymous-access and Giovanni-file behavior is unaffected — Steps 2 and 3 only extract layer-construction and polling-loop logic that sits *around* the untouched fetch call, never the fetch itself. Confirm this explicitly in testing (see Testing section) rather than assuming it.

### 4. Reusable GeoTIFF-layer-resolution controller — `src/controllers/geotiff-layer-request.controller.ts` (new)

A Lit `ReactiveController`, living alongside `harmony-request.controller.ts`/`mutation.controller.ts`/`query.controller.ts` (matches that directory's convention — reusable controllers used by more than one component, vs. `time-average-map.controller.ts`'s colocated one-component controller):

```ts
class GeoTiffLayerRequestController implements ReactiveController {
    constructor(host: ReactiveControllerHost & QueryClientHost)

    async resolveFromUrl(
        url: string,
        options: { bearerToken: string; signal?: AbortSignal } & GeoTiffLayerOptions
    ): Promise<WebGLTileLayer>

    async resolveFromHarmonyJob(
        jobId: string,
        options: { bearerToken: string; signal?: AbortSignal } & GeoTiffLayerOptions
    ): Promise<WebGLTileLayer>
}
```

- `resolveFromUrl`: `fetch(url, { signal, headers: { Authorization: \`Bearer ${bearerToken}\` } })` → blob → `createGeoTiffLayer`. Fails fast (rejects) if `bearerToken` isn't provided rather than issuing an anonymous request — no code path fetches a GeoTIFF without an `Authorization` header.
- `resolveFromHarmonyJob`: owns a `HarmonyRequestController` internally, calls `.startPollForJobStatus(jobId, { bearerToken })`, then `waitForHarmonyJob`/`getHarmonyJobError` from Step 3, then fetches the job's `data` link **directly** (no proxy, no anonymous fallback — `fetch(dataLink, { signal, headers: { Authorization: \`Bearer ${bearerToken}\` } })`), then `createGeoTiffLayer`. This controller is a public-facing helper for authenticated use only; it never routes through `HARMONY_LINK_PROXY_URL` and never fetches without a `bearerToken` — that proxy path stays internal to `time-average-map` (see Step 3). This is a new, small, separate fetch (see Risks: verify this works before relying on it).
- Both methods reject with a normal `Error` on failure (missing token, Harmony FAILED/COMPLETE_WITH_ERRORS, fetch failure) — caller decides how to surface it (event, state, etc.); this controller doesn't own any UI or emit any `terra-map-*` events itself.
- `time-average-map` itself is **not** refactored to use this controller in this pass — it already has working, tested polling logic (including its proxy path for the unauthenticated case), and switching it over is a separable, lower-priority follow-up once this controller has a second real consumer proving it out. Don't force that migration here.

### 5. Docs — `docs/pages/components/map.md`

Add two new `html:preview` examples next to the existing custom-layer example (around line 96), in the same "build a layer, call `addLayer()`" style — not a new props/attributes table, since there's no new `terra-map` component API:

- One showing a GIBS layer: construct `new GibsLayer({ url })`, `map.addLayer(layer, { name: '...' })`, with a checkbox wired to `map.getLayer(name).setVisible(...)`.
- One showing a Harmony-resolved GeoTIFF layer: `bearerToken` input, call `GeoTiffLayerRequestController#resolveFromHarmonyJob` (or `resolveFromUrl`), then `map.addLayer(layer, { name: '...' })` on success.

**Do not mention `HARMONY_LINK_PROXY_URL`, the unauthenticated/proxy path, or `time-average-map`'s internal handling of it anywhere in this public doc.** That proxy is internal, first-party infrastructure — public consumers of `terra-map` should only ever see the authenticated (`bearerToken`) path documented here.

### 6. React wrapper — `src/react/map/index.ts`

Separately from GIBS/GeoTIFF: fix the currently-empty `events: {}` passed to `createComponent` to include `terra-map-change` and `terra-map-pointer-move`, following `src/react/time-series/index.ts`'s `EventName<...>` pattern. Small, pre-existing gap unrelated to this feature but worth closing in the same pass since it blocks React consumers from using `terra-map` layer examples effectively (no way to react to pointer/draw events).

## Risks to verify early (before finalizing Step 4)

- **Direct (non-proxied), authenticated fetch of a Harmony job's data link from the browser** — `time-average-map` routes its own (proxy-eligible, potentially-unauthenticated) case through `HARMONY_LINK_PROXY_URL` today, but that doesn't necessarily mean an authenticated direct fetch is also blocked by CORS — it may simply be that the proxy predates/duplicates auth support, or exists for the unauthenticated case specifically. Verify against a real Harmony job early, with a `bearerToken` attached, before relying on `GeoTiffLayerRequestController#resolveFromHarmonyJob` doing a direct fetch. If even the authenticated direct fetch is blocked by CORS, that's a real blocker for this whole approach — raise it with the user rather than silently adding a proxy dependency to the new, public-facing controller.
- **Test mocking infra** — no existing test in this repo stubs `fetch` or a dynamic `import('ol/source/GeoTIFF.js')`; this needs to be established fresh (small spike test) rather than copied from precedent.

## Testing

Follow this codebase's `__tests__/` subfolder convention (`@open-wc/testing`):

- New `src/components/map/layers/__tests__/gibs.layer.test.ts` — pure construction test (source URL, `noWorldWrap` behavior).
- New `src/components/map/layers/__tests__/geotiff.layer.test.ts` — construction from a blob, `bands`/`nodata` defaults, mocking the dynamic `GeoTIFF` import (spike this mocking approach first).
- New `src/lib/harmony/__tests__/harmony-job-polling.test.ts` — polling loop (RUNNING → SUCCESS/FAILED/COMPLETE_WITH_ERRORS), using `sinon.useFakeTimers()`.
- New `src/controllers/__tests__/geotiff-layer-request.controller.test.ts` — both `resolveFromUrl` and `resolveFromHarmonyJob` paths, including the direct (non-proxied) data-link fetch with an `Authorization` header, success and error branches (including missing-`bearerToken` fail-fast).
- Extend `time-average-map.test.ts` only as needed to confirm its refactored `updateGeoTIFFLayer` still behaves identically after calling the new `createGeoTiffLayer` factory, **and explicitly confirm `#fetchJobBlob`'s proxy path is still exercised unchanged** — anonymous (no `bearerToken`) jobs and Giovanni-file-link jobs must still resolve through `HARMONY_LINK_PROXY_URL` exactly as before. This is expected to be a no-op given Steps 2/3 don't touch `#fetchJobBlob`, but confirm it rather than assume it.
- Manually verify in the dev server (`npm start`) with a real GIBS tile URL and a real Harmony job id/GeoTIFF URL before calling this done.

## Execution order

`GibsLayer` + tests → Harmony data-link direct-fetch spike (resolve CORS risk) → `harmony-job-polling.ts` + tests → `time-average-map.controller.ts` refactor to use it → `geotiff.layer.ts` factory + tests → `time-average-map.component.ts` refactor to use it → `GeoTiffLayerRequestController` + tests → docs → React wrapper events fix.
