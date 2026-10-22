import Feature from 'ol/Feature.js'
import { Polygon } from 'ol/geom.js'
import { transform, type ProjectionLike } from 'ol/proj.js'
import { Fill, Stroke, Style } from 'ol/style.js'
import type { Extent } from 'ol/extent.js'

/**
 * The 5-color palette NASA Earthdata Search cycles through (by index) for
 * granule boundary polygons. Shared here so any boundary-style feature in
 * `terra-map` - GIBS extent outlines today, granule boundaries eventually -
 * looks the same way EDSC's does.
 */
export const BOUNDARY_COLORS: ReadonlyArray<readonly [number, number, number]> = [
    [46, 204, 113], // green
    [52, 152, 219], // blue
    [230, 126, 34], // orange
    [231, 76, 60], // red
    [155, 89, 182], // purple
]

export type BoundaryVariant = 'normal' | 'deemphasized' | 'highlighted' | 'background'

function rgba(color: readonly [number, number, number], alpha: number) {
    const [r, g, b] = color
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Builds the `ol/style.Style` for a boundary feature at the given palette
 * `index` (cycled mod the palette length - pass a raw incrementing index,
 * no hashing needed) and `variant`:
 *
 * - `normal` (default): solid stroke, width 2
 * - `deemphasized`: translucent stroke, width 1 - for boundaries the user
 *   isn't focused on (e.g. unselected granules)
 * - `highlighted`: thick stroke (still indexed by color) plus a translucent
 *   green fill, regardless of index - for hover/focus
 * - `background`: fixed gray, width 1, regardless of index - for an
 *   unstyled/base boundary
 */
export function getBoundaryStyle(
    index: number,
    variant: BoundaryVariant = 'normal'
): Style {
    const color = BOUNDARY_COLORS[index % BOUNDARY_COLORS.length]!

    if (variant === 'background') {
        return new Style({
            stroke: new Stroke({ color: 'rgba(128, 128, 128, 0.6)', width: 1 }),
        })
    }

    if (variant === 'highlighted') {
        return new Style({
            stroke: new Stroke({ color: rgba(color, 1), width: 4 }),
            fill: new Fill({ color: 'rgba(46, 204, 113, 0.2)' }),
        })
    }

    if (variant === 'deemphasized') {
        return new Style({
            stroke: new Stroke({ color: rgba(color, 0.5), width: 1 }),
        })
    }

    // normal
    return new Style({
        stroke: new Stroke({ color: rgba(color, 1), width: 2 }),
    })
}

/**
 * Builds a closed-ring `Polygon` feature outlining `extent`
 * (`[west, south, east, north]`, in `extentProjection` - defaults to
 * EPSG:4326, matching GIBS' own `extent` convention), reprojected into
 * `viewProjection`. Mirrors `DrawToolbarControl.buildBBoxFeature()`, but
 * works off a raw `Extent` instead of a `LatLngBounds` so it isn't tied to
 * the draw toolbar - any extent-shaped boundary (a GIBS clip box today,
 * granule bounding boxes eventually) can reuse this.
 */
export function buildExtentFeature(
    extent: Extent,
    viewProjection: ProjectionLike,
    extentProjection: ProjectionLike = 'EPSG:4326'
): Feature {
    const [west, south, east, north] = extent
    const coordinates = [
        [west, south],
        [west, north],
        [east, north],
        [east, south],
        [west, south],
    ].map(coord => transform(coord, extentProjection, viewProjection))

    const polygon = new Polygon([coordinates])
    return new Feature({ geometry: polygon })
}
