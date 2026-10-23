import TileLayer from 'ol/layer/Tile.js'
import ImageTile from 'ol/source/ImageTile.js'
import { transformExtent, type ProjectionLike } from 'ol/proj.js'
import type { Extent } from 'ol/extent.js'

export type Options = {
    /** Tile URL template containing {z}, {y}, {x} placeholders. */
    urlTemplate: string
    attributions?: string[]
    noWorldWrap?: boolean
    /** Bounding box to clip rendering to, in `extentProjection` (defaults to EPSG:4326). */
    extent?: Extent
    /** Projection of `extent`. Defaults to 'EPSG:4326'. Reprojected to `targetProjection`. */
    extentProjection?: string
    /** Projection `extent` is reprojected to, i.e. the map's view projection. Defaults to 'EPSG:3857'. */
    targetProjection?: ProjectionLike
}

/**
 * A generic tile layer for any XYZ-style ({z}/{y}/{x}) tile source, e.g. a
 * third-party basemap or imagery service. For NASA GIBS imagery, see GibsLayer.
 */
export class XYZLayer extends TileLayer {
    constructor(options: Options) {
        const {
            urlTemplate,
            attributions,
            noWorldWrap,
            extent,
            extentProjection = 'EPSG:4326',
            targetProjection = 'EPSG:3857',
        } = options

        super({
            source: new ImageTile({
                url: urlTemplate,
                attributions,
                ...(noWorldWrap ? { wrapX: false } : {}),
            }),
            ...(extent
                ? {
                      extent: transformExtent(
                          extent,
                          extentProjection,
                          targetProjection
                      ),
                  }
                : {}),
        })
    }
}
