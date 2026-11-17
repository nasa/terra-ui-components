import { get as getProjection } from 'ol/proj.js'
import { register } from 'ol/proj/proj4.js'
import proj4 from 'proj4'

// EPSG:3413 (NSIDC Sea Ice Polar Stereographic North) and EPSG:3031
// (Antarctic Polar Stereographic) aren't built into OpenLayers (only
// EPSG:4326/EPSG:3857 are), so register them via proj4. This is required
// for GibsLayer.forProjection() to request/display GIBS imagery that's
// only published in a polar projection.
proj4.defs(
    'EPSG:3413',
    '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
)
proj4.defs(
    'EPSG:3031',
    '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
)

register(proj4)

// proj4-registered projections have no extent by default. Match NASA's GIBS
// web examples (arctic-epsg3413.js / antarctic-epsg3031.js), which set this
// so the polar views' world-wrap clamping (`noWorldWrap`) and default view
// fitting behave correctly instead of being unbounded.
const POLAR_EXTENT: [number, number, number, number] = [
    -4194304, -4194304, 4194304, 4194304,
]
getProjection('EPSG:3413')?.setExtent(POLAR_EXTENT)
getProjection('EPSG:3031')?.setExtent(POLAR_EXTENT)
