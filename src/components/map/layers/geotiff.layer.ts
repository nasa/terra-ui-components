import WebGLTileLayer from 'ol/layer/WebGLTile.js'
import type { Extent } from 'ol/extent.js'
import type { ProjectionLike } from 'ol/proj.js'

type CommonConfig = {
    /** Unique name for this layer, used for add/remove/update diffing and `getLayer()`. */
    name: string
    /** Where to place the layer relative to the borders/labels layers. Defaults to 'below-borders'. */
    position?: 'below-borders' | 'top'
}

export type GeoTiffLayerConfig = CommonConfig & {
    /**
     * URL to a GeoTIFF / Cloud-Optimized GeoTIFF. This can be a direct link
     * to a file hosted anywhere (e.g. an external data provider), or an
     * object URL created from a `Blob` (`URL.createObjectURL(blob)`).
     */
    url: string
    /** Which band(s) to read. Defaults to `[1]` (single-band rasters). */
    bands?: number[]
    /** Pixel value that should be treated as "no data" and excluded from rendering/min-max. */
    noDataValue?: number
    /** Layer opacity, 0-1. Defaults to 1. */
    opacity?: number
    /** Name of a `colormap` package colormap, e.g. 'viridis', 'jet'. Defaults to 'viridis'. */
    colorMapName?: string
    /** Number of discrete color stops to interpolate between. Defaults to 72. */
    colorSteps?: number
    /** Reverse the colormap's color order. Defaults to false. */
    reverseColors?: boolean
    /**
     * If true, the map's view will be fit to the GeoTIFF's native extent
     * once it's loaded. Defaults to false, since fitting isn't always
     * desirable when multiple layers are present.
     */
    fitView?: boolean
}

export type GeoTiffLegendEntry = {
    value: string
    rgb: number[]
}

export type GeoTiffLayerInfo = {
    layer: WebGLTileLayer
    /** The GeoTIFF's native extent, in `projection`, when it could be determined. */
    extent?: Extent
    projection: ProjectionLike
    min: number
    max: number
    /**
     * Interpolation stops as built for the OL WebGL style:
     * `[value, [r,g,b,a], value, [r,g,b,a], ...]`.
     */
    colorStops: Array<number | number[]>
    /** Convenience legend entries (highest value first), ready to render a color-ramp legend. */
    legendValues: GeoTiffLegendEntry[]
}

/**
 * Reads the `GDAL_NODATA` tag off the GeoTIFF's first image, falling back
 * to the configured `noDataValue` if the tag isn't present.
 */
async function getNoDataValue(
    gtSource: InstanceType<typeof import('ol/source/GeoTIFF.js').default>,
    fallback?: number
): Promise<number | undefined> {
    await gtSource.getView()
    const gtImage = (gtSource as any).sourceImagery_[0][0]
    const tagValue = gtImage.fileDirectory?.GDAL_NODATA

    return tagValue !== undefined ? parseFloat(tagValue) : fallback
}

/**
 * Computes the [min, max] range of a band's pixel values, skipping NaN and
 * the configured no-data value. Exported as a pure function (no OpenLayers
 * dependency) so the data-range logic can be unit-tested without a real
 * GeoTIFF file/network call.
 */
export function computeMinMax(
    pixels: ArrayLike<number>,
    noDataValue: number | undefined
): { min: number; max: number } {
    let min = Infinity
    let max = -Infinity

    for (let i = 0; i < pixels.length; i++) {
        const val = pixels[i]
        if (!Number.isNaN(val) && val !== noDataValue) {
            if (val < min) min = val
            if (val > max) max = val
        }
    }

    return { min, max }
}

async function getMinMax(
    gtSource: InstanceType<typeof import('ol/source/GeoTIFF.js').default>,
    noDataValue: number | undefined
): Promise<{ min: number; max: number }> {
    await gtSource.getView()
    const gtImage = (gtSource as any).sourceImagery_[0][0]

    const rasterData = await gtImage.readRasters({ samples: [0] })

    return computeMinMax(rasterData[0], noDataValue)
}

/**
 * Builds interpolation stops and legend entries from an already-generated
 * array of colors spanning `[min, max]`. Exported as a pure function (no
 * dependency on the `colormap` package or OpenLayers) so the stop/legend
 * math can be unit-tested directly, independent of color generation.
 *
 * Referencing workshop example from https://openlayers.org/workshop/en/cog/colormap.html
 */
export function buildStopsFromColors(
    colors: number[][],
    min: number,
    max: number
): { stops: Array<number | number[]>; legendValues: GeoTiffLegendEntry[] } {
    const steps = colors.length
    const delta = (max - min) / (steps - 1)
    const stops: Array<number | number[]> = new Array(steps * 2)

    const dataVals: string[] = []

    for (let i = 0; i < steps; i++) {
        stops[i * 2] = min + i * delta
        stops[i * 2 + 1] = colors[i]
        dataVals.push((min + i * delta).toExponential(2))
    }

    const legendValues: GeoTiffLegendEntry[] = []
    for (let i = colors.length - 1; i > 0; i--) {
        const curVal = parseFloat(dataVals[i])
        if (curVal >= min && curVal <= max) {
            legendValues.push({ value: dataVals[i], rgb: colors[i] })
        }
    }

    return { stops, legendValues }
}

async function buildColorStops(
    colorMapName: string,
    min: number,
    max: number,
    steps: number,
    reverse: boolean
): Promise<{ stops: Array<number | number[]>; legendValues: GeoTiffLegendEntry[] }> {
    const { default: colormap } = await import('colormap')

    // the ambient `colormap` type declaration (src/declaration.d.ts) only
    // covers its default hex-string output; `format: 'rgba'` actually
    // returns `number[][]` ([r, g, b, a] tuples), which is what we need here.
    const colors = colormap({
        colormap: colorMapName,
        nshades: steps,
        format: 'rgba',
    }) as unknown as number[][]

    if (reverse) {
        colors.reverse()
    }

    return buildStopsFromColors(colors, min, max)
}

/**
 * Builds a `WebGLTileLayer` rendering a single-band GeoTIFF/COG from a URL,
 * with a colormap-based style computed from the raster's actual data range.
 *
 * This is the generic counterpart to `buildGibsLayer()` for raster tile
 * imagery - use this for any standalone GeoTIFF file, regardless of where
 * it came from (a public COG URL, or an object URL from a fetched `Blob`).
 */
export async function buildGeoTiffLayer(
    config: GeoTiffLayerConfig
): Promise<GeoTiffLayerInfo> {
    const {
        url,
        bands = [1],
        noDataValue,
        opacity,
        colorMapName = 'viridis',
        colorSteps = 72,
        reverseColors = false,
    } = config

    const { default: GeoTIFF } = await import('ol/source/GeoTIFF.js')

    const gtSource = new GeoTIFF({
        sources: [{ url, bands, nodata: noDataValue }],
        // Enable wrapping so the GeoTIFF is always visible when scrolling
        wrapX: true,
        interpolate: false,
        normalize: false,
    })

    const layer = new WebGLTileLayer({ source: gtSource })

    if (opacity !== undefined) {
        layer.setOpacity(opacity)
    }

    const resolvedNoDataValue = await getNoDataValue(gtSource, noDataValue)
    const { min, max } = await getMinMax(gtSource, resolvedNoDataValue)
    const { stops: colorStops, legendValues } = await buildColorStops(
        colorMapName,
        min,
        max,
        colorSteps,
        reverseColors
    )

    layer.setStyle({
        color: [
            'case',
            ['==', ['band', 2], 0],
            [0, 0, 0, 0],
            ['interpolate', ['linear'], ['band', 1], ...colorStops],
        ],
    })

    const view = await gtSource.getView()

    return {
        layer,
        extent: view.extent as Extent,
        projection: view.projection as ProjectionLike,
        min,
        max,
        colorStops,
        legendValues,
    }
}
