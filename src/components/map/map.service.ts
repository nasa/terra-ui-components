import { Feature, Graticule, Map, View } from 'ol'
import WebGLTileLayer from 'ol/layer/WebGLTile.js'
import {
    transform,
    transformExtent,
    type ProjectionLike,
    get as getProjection,
} from 'ol/proj.js'
import OSM from 'ol/source/OSM.js'
import { Stroke, Fill, Style } from 'ol/style.js'
import { isResizeObserverSupported } from '../../utilities/feature.js'
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector.js'
import VectorLayer from 'ol/layer/Vector.js'
import { Circle, Point, Polygon, type Geometry } from 'ol/geom.js'
import { DrawToolbarControl } from './controls/draw-toolbar.control.js'
import { MapEventType, type MapEventDetail } from './type.js'
import { LatLngBounds } from './models/LatLngBounds.js'
import { LatLng } from './models/LatLng.js'
import { BadRequestException } from '../../exceptions/http.exception.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { isEmpty } from 'ol/extent.js'
import * as turf from '@turf/turf'

type MapOptions = {
    projection?: ProjectionLike
    zoom?: number
    minZoom?: number
    maxZoom?: number
    showGraticule?: boolean
    showBoundingBoxSelection?: boolean
    showPolygonSelection?: boolean
    showPointSelection?: boolean
    showCircleSelection?: boolean
    showBoundaries?: boolean
    noWorldWrap?: boolean
    value?: string
    fitToValue?: boolean
    getGeoJson?: (shapeId: string) => Promise<unknown>
    onShapeLoading?: (loading: boolean) => void
    onBoundaryLoading?: (loading: boolean) => void
    onMouseMove?: (coordinate: [number, number]) => void
    onDraw?: (detail: MapEventDetail) => void
    onPolySelect?: (detail: MapEventDetail) => void
}

export class MapService {
    #el: HTMLElement // the map component's root element
    #map: Map
    #drawToolbarControl: DrawToolbarControl
    #options: MapOptions
    #shapeLayer: VectorLayer
    #boundaryLayer: VectorLayer
    #onDraw: MapOptions['onDraw']
    #onShapeLoading: MapOptions['onShapeLoading']
    #onBoundaryLoading: MapOptions['onBoundaryLoading']

    constructor(el: HTMLElement, options: MapOptions) {
        this.#el = el
        this.#options = options

        this.#map = this.#createMap(options)

        this.#updateMapSizeOnResize()
    }

    toggleLayerVisibility(name: string, show: boolean) {
        const layer = this.#getLayerByName(name)

        if (layer) {
            layer.setVisible(show)
        }
    }

    setZoom(zoom: number) {
        this.#map.getView().setZoom(zoom)
    }

    setValue(value: string) {
        if (!value) {
            this.#drawToolbarControl.clearValue()
            return
        }

        const location = this.parseLocationString(value)

        this.#drawToolbarControl.setValue(location, this.#options.fitToValue)
    }

    /**
     * takes a string and parses it into a point, bounding box
     * TODO: support parsing circle and polygon
     */
    parseLocationString(location: string) {
        try {
            const locationParts = location
                .split(',')
                .map((part) => parseFloat(part.trim()))

            // handle lat/lng points
            if (locationParts.length === 2) {
                return new LatLng(locationParts[0], locationParts[1])
            }

            // handle bounding box
            if (locationParts.length === 4) {
                return new LatLngBounds([
                    locationParts[0],
                    locationParts[1],
                    locationParts[2],
                    locationParts[3],
                ])
            }

            throw new Error(
                `Provided location had invalid length of ${locationParts.length}. Should have 2 or 4 items.`,
            )
        } catch (e) {
            throw new BadRequestException({
                message:
                    'Failed to parse location string. Location must be in format: `lat,lng` for a point or `west,south,east,north` for a bounding box',
                cause: e,
            })
        }
    }

    updateDrawToolbarVisibility(options: {
        showBoundingBoxSelection?: boolean
        showPolygonSelection?: boolean
        showPointSelection?: boolean
        showCircleSelection?: boolean
    }) {
        this.#drawToolbarControl.setOptions({
            showBboxTool: options.showBoundingBoxSelection,
            showPolygonTool: options.showPolygonSelection,
            showPointTool: options.showPointSelection,
            showCircleTool: options.showCircleSelection,
        })
    }

    async handleShapeSelect(event: Event) {
        const select = event.target as HTMLSelectElement
        const selectedShape = select.value

        if (!selectedShape) return

        // Clear any previously loaded shape
        this.#shapeLayer.getSource()!.clear()

        this.#onShapeLoading?.(true)

        try {
            const shapeGeoJson = await this.#options.getGeoJson?.(selectedShape)

            if (!shapeGeoJson) return

            // Parse the GeoJSON into OpenLayers features, reprojecting from WGS84 to the map projection
            const format = new GeoJSON()
            const features = format.readFeatures(shapeGeoJson, {
                featureProjection: 'EPSG:3857',
            })

            const source = this.#shapeLayer.getSource()!
            source.addFeatures(features)

            // Fit the view to the shape's extent
            let extent = source.getExtent()

            if (!extent) {
                return
            }

            this.#map.getView().fit(extent, {
                padding: [20, 20, 20, 20],
                duration: 250,
            })

            // Emit the shape as a polygon draw event so listeners can react
            this.#onDraw?.({
                cause: 'draw',
                type: MapEventType.POLYGON,
                latLngs: [],
                geoJson: shapeGeoJson as object,
                label: select.options[select.selectedIndex]?.text,
            })
        } finally {
            this.#onShapeLoading?.(false)
        }
    }

    /*
     * Build polygons in support of file boundary display
     */    
    async buildPolygonFeatures(event: any) {

        if (!event) {console.log("map.service.buildPolygonFeatures: no event"); return}
        if (!event.detail.data) {console.log("map.service.buildPolygonFeatures: no event data"); return}
        if (!event.detail.data.umm) {console.log("map.service.buildPolygonFeatures: no umm from event data"); return}

        const geom = event.detail.data.umm.SpatialExtent.HorizontalSpatialDomain.Geometry
        const meta = event.detail.data.meta
        const ummData = event.detail.data.umm
        //const defaultExtent = [-180,-90,180,90]

        let boundaryGeoJson = {
                "type": "FeatureCollection",
                "bbox": [] as number[],
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": "EPSG:4326",
                    },
                },
                "features": [] as object[],
                "properties": {
                    "concept-id": meta["concept-id"],
                    "file-id": ummData.GranuleUR,
                    "provider-id": meta["provider-id"],
                    "collection-shortname": ummData.CollectionReference.ShortName,
                    "collection-version": ummData.CollectionReference.Version,
                    "last-updated": ummData.ProviderDates[1].Date ?? 'unknown',
                    "pge-version": ummData.PGEVersionClass?.PGEVersion ?? 'unknown',
                }
            }

        if (geom && geom.GPolygons) {
            // GOT POLYGONS
            const pointsArray = event.detail.data.umm.SpatialExtent.HorizontalSpatialDomain.Geometry.GPolygons.map((gp:any) => {
                return gp.Boundary.Points.map((pt:any) => {
                    let ptArr = [ parseFloat(pt.Longitude), parseFloat(pt.Latitude) ]
                    return ptArr
                })
            })

            /* *
             * For every group of points in the zone, define a polygon feature.  If line segments 
             * of the polygon cross the antimeridian (+/- 180), split the polygon into two, 
             * one for zone1 and one for zone2 (across the antimeridian).  Return the polygons
             * for both zones (1 and 2).
             * */
            const [zone1Polygons, zone2Polygons] = this.#fetchGeoJsonPolygons(pointsArray, boundaryGeoJson.properties)

            boundaryGeoJson.features = zone1Polygons.concat(zone2Polygons)
            if (!boundaryGeoJson.bbox) {
                boundaryGeoJson.bbox = [-180,-90,180,90]  // set the bounding box to the world extent for now
            }

        } else if (geom && geom.BoundingRectangles) {
            // GOT RECTANGLE/BBOX
            geom.BoundingRectangles.map((br:any) => {

                let extentBbox = [
                    br.WestBoundingCoordinate, 
                    br.SouthBoundingCoordinate, 
                    br.EastBoundingCoordinate, 
                    br.NorthBoundingCoordinate
                ]
                boundaryGeoJson.bbox = extentBbox

                let points = [  
                    [br.WestBoundingCoordinate, br.NorthBoundingCoordinate],
                    [br.WestBoundingCoordinate, br.SouthBoundingCoordinate],
                    [br.EastBoundingCoordinate, br.SouthBoundingCoordinate],
                    [br.EastBoundingCoordinate, br.NorthBoundingCoordinate],
                ]                                  

                boundaryGeoJson.features.push(
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                    points
                            ]
                        },
                        "properties": {
                            "File Name": ummData.GranuleUR,
                            "Coordinates": points.map((pt) => ("(" + pt[0] + ", " + pt[1] + ") ")),
                            "Extent": extentBbox,
                            "Provider": meta["provider-id"],
                            "Collection Shortname": ummData.CollectionReference.ShortName,
                            "Collection Version ": ummData.CollectionReference.Version,
                            "Collection Concept ID": meta["concept-id"],
                            "Last Updated": ummData.ProviderDates[1].Date ?? 'unknown',
                            "PGE Version": ummData.PGEVersionClass?.PGEVersion ?? 'unknown',
                        }
                    }
                )

            })

        } else {
            console.log("map.service.buildPolygonFeatures, can't find a geometry")
            return
        }

        // Clear any previously loaded shape
        this.#boundaryLayer.getSource()!.clear()

        this.#onBoundaryLoading?.(true)

        try {
            // Parse the GeoJSON into OpenLayers features, reprojecting from WGS84 to the map projection
            const format = new GeoJSON()
            const features = format.readFeatures(boundaryGeoJson, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:4326',
                //extent: [-180,-90,180,90]
            })
            const source = this.#boundaryLayer.getSource()!
            source.addFeatures(features)

            // Fit the view to the shape's extent
            let extent = source.getExtent()
            if (!extent || isEmpty(extent)) {
                extent = boundaryGeoJson.bbox
                if (!extent) {
                    extent = [-180, -90, 180, 90]  // set the bounding box to the world extent for now
                } else if (extent && 
                    extent[0] === Infinity && 
                    extent[1] === Infinity && 
                    extent[2] === -Infinity && 
                    extent[3] === -Infinity) {
                    extent = [-180, -90, 180, 90]
                }
            }
            console.log("map.service.buildPolygonFeatures, extent: ", extent)
           // if (!extent) {
           //     return
           // }

            this.#map.getView().fit(extent, {
                // optional: add padding or duration as needed
                // padding: [20, 20, 20, 20],
                // duration: 250,
                // use maxZoom instead of center/zoom which are not valid FitOptions
                maxZoom: 2,
            })
        } catch (err) {
            console.log("map.service.buildPolygonFeatures, error: ", err)
        } finally {
            this.#onBoundaryLoading?.(false)
        }
    }

    #createMap(options: MapOptions) {
        this.#onDraw = options.onDraw
        this.#onShapeLoading = options.onShapeLoading
        this.#onBoundaryLoading = options.onBoundaryLoading
        //this.#onPolySelect = options.onPolySelect

        const baseLayer = this.#createBaseLayer(options)
        const graticuleLayer = this.#createGraticuleLayer(options)
        const drawLayer = this.#createDrawLayer()
        this.#shapeLayer = this.#createShapeLayer()
        this.#boundaryLayer = this.#createBoundaryLayer()

        const projection = getProjection('EPSG:4326')
        const worldExtent = projection?.getExtent()

        const map = new Map({
            target: this.#el,
            layers: [baseLayer, graticuleLayer, this.#shapeLayer, drawLayer, this.#boundaryLayer],
            view: new View({
                center: [0, 0],
                zoom: options.zoom,
                //projection: options.projection ?? 'EPSG:3857',
                projection: 'EPSG:4326',
                minZoom: options.minZoom,
                maxZoom: options.maxZoom,
                ...(options.noWorldWrap ? { extent: worldExtent } : {}),
            }),
        })

        this.#drawToolbarControl = new DrawToolbarControl(drawLayer, {
            showBboxTool: options.showBoundingBoxSelection,
            showPolygonTool: options.showPolygonSelection,
            showPointTool: options.showPointSelection,
            showCircleTool: options.showCircleSelection,
        })

        map.addControl(this.#drawToolbarControl)

        if (options.value !== undefined) {
            this.setValue(options.value)
        }

        // listen for when any drawing is completed and dispatch a custom event with the drawn geometry
        drawLayer
            .getSource()!
            .on('addfeature', (event: VectorSourceEvent<Feature<Geometry>>) => {
                const drawtool = event.feature?.get('drawtool')

                if (!drawtool) {
                    // something else added this feature, we can safely ignore it
                    return
                }

                const geometry = event.feature!.getGeometry()!

                if (drawtool === 'bbox') {
                    // transform the extent into lat/lng bounds
                    const extent = event.feature!.getGeometry()!.getExtent()!
                    const bbox4326 = transformExtent(
                        extent,
                        'EPSG:3857',
                        'EPSG:4326',
                    )

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.BBOX,
                        bounds: new LatLngBounds(bbox4326),
                    })
                } else if (geometry instanceof Polygon) {
                    const coordinates = geometry
                        .getCoordinates()[0]
                        .slice(0, -1) // remove last point (duplicate of first)

                    const latLngs = coordinates.map(([x, y]) => {
                        const [lng, lat] = transform(
                            [x, y],
                            'EPSG:3857',
                            'EPSG:4326',
                        )
                        return new LatLng(lat, lng)
                    })

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.POLYGON,
                        latLngs,
                    })
                } else if (geometry instanceof Point) {
                    const coords = geometry.getCoordinates()
                    const [lng, lat] = transform(
                        coords,
                        'EPSG:3857',
                        'EPSG:4326',
                    )

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.POINT,
                        latLng: new LatLng(lat, lng),
                    })
                } else if (geometry instanceof Circle) {
                    const radius = geometry.getRadius()
                    const [lng, lat] = transform(
                        geometry.getCenter(),
                        'EPSG:3857',
                        'EPSG:4326',
                    )

                    options.onDraw?.({
                        cause: 'draw',
                        type: MapEventType.CIRCLE,
                        center: new LatLng(lat, lng),
                        radius,
                    })
                } else {
                    console.warn('Unhandled draw type! ', event.feature)
                }
            })

        return map
    }

    #createBaseLayer(options: MapOptions) {
        return new WebGLTileLayer({
            source: new OSM({
                ...(options.noWorldWrap ? { wrapX: false } : {}),
            }) as any,
        })
    }

    #createGraticuleLayer(options: MapOptions) {
        const layer = new Graticule({
            visible: options.showGraticule ?? false,
            strokeStyle: new Stroke({
                color: 'rgba(0,0,0,0.2)',
                width: 2,
                lineDash: [0.5, 4],
            }),
            showLabels: true,
            wrapX: true,
        })

        layer.set('name', 'graticule')

        return layer
    }

    #createDrawLayer() {
        const source = new VectorSource({
            wrapX: false,
        })

        return new VectorLayer({
            source: source,
        })
    }

    #createShapeLayer() {
        const source = new VectorSource()

        const layer = new VectorLayer({
            source,
        })

        layer.set('name', 'shapes')

        return layer
    }

    #createBoundaryLayer() {

        const source = new VectorSource({
            //url: 'https://openlayers.org/data/vector/ecoregions.json',
            format: new GeoJSON(),
        })

        const polyStyle = 
            new Style ({
                stroke: new Stroke({
                    color: 'blue',
                    width: 3,
                }),
                fill: new Fill({
                    color: 'rgba(200, 200, 255, 0.3)',
                }),
            })

        const layer = new VectorLayer({
            source,
            style: polyStyle
        })

        layer.set('name', 'boundaries')

        return layer
    }

    #updateMapSizeOnResize() {
        if (isResizeObserverSupported()) {
            // anytime the element is resized, update the map size
            const resizeObserver = new ResizeObserver(() => {
                this.#map.updateSize()
            })
            resizeObserver.observe(this.#el)
        }
    }

    #getLayerByName(name: string) {
        return this.#map
            .getLayers()
            .getArray()
            .find((layer) => layer.get('name') === name)
    }

    /* 
     * From the points gathered from the selected file (granule), build the polygon featuress
     * Make sure to split polygons that cross the antimeridian and properly cross the poles
     */
    #fetchGeoJsonPolygons(boundaryPoints: Array<Array<[number,number]>>, options: Object): [Array<object>, Array<object>] {
        let zone1PolyFeatures: Array<object> = []
        let zone2PolyFeatures: Array<object> = []
        let lat = 0; // lat to add to coordinates
        let lon = 0; // lon to add to coordinates
        let oldlat = 0; // keep track of the last added lat
        let oldlon = 0; // keep track of the last added lon
        let zoneToggle = false; // can toggle between two hemispheres (on either side of antimeridian)

        boundaryPoints.forEach((boundaryPoly) => {
            let zone1Poly: Array<[number, number]> = []
            let zone2Poly: Array<[number, number]> = [] 
            boundaryPoly.forEach((pair) => {
               lat = pair[1]
               lon = pair[0]
               let crossingPoints = this.#handleAntiMeridianCrossing(oldlat, oldlon, lat, lon)
                // If there are no crossing points, push coordinates according to zoneToggle
                if (crossingPoints.length === 1) { // no crossing, push points to the current zone
                    if (zoneToggle) zone2Poly.push([lon, lat]);
                    else zone1Poly.push([lon, lat]);
                } else if (crossingPoints.length === 2) { // if there is a cross, handle it
                    if (zoneToggle) { // represents the first time there is a split; push to secondary first
                      zone2Poly.push(crossingPoints[0]);
                      zone1Poly.push(crossingPoints[1]);
                      zone1Poly.push([lon, lat]);
                    } else { // zoneToggle starts out as false; push to primary first...
                      // push the first split point to primary
                      zone1Poly.push(crossingPoints[0]);
                      // then push second split point to secondary
                      zone2Poly.push(crossingPoints[1]);
                      // then push the end of the test segment to secondary
                      zone2Poly.push([lon, lat]);
                    }
                    zoneToggle = !zoneToggle;
                }
                /* remember the current point for comparison in the next loop */
                oldlat = lat;
                oldlon = lon;
           })

            /* *
             * Check the secondary set of coordinates
             * for clockwise (CW) order.
             * If this order is CW, the polygon probably encompasses a pole,
             * and so we need to walk the antimeridian/90 degree border
             * */
            const isClockwise = (turf as any).booleanClockwise ?? ((ring: Array<[number, number]>) => {
                const signedArea = ring.reduce((sum, [lon, lat], index) => {
                    const [nextLon, nextLat] = ring[(index + 1) % ring.length]
                    return sum + lon * nextLat - nextLon * lat
                }, 0)

                return signedArea < 0
            })

            if (zone2Poly.length >= 2 && isClockwise(zone2Poly)) {
                  // use zone1 and zone2 points to walk the pole; results stored in primary
                zone1Poly = this.wrapPole(zone1Poly, zone2Poly);
                  // zero the secondary; just use the primary to represent the wrapped polygon
                zone2Poly = [];
            }


           if (zone1Poly.length > 2) {
              zone1PolyFeatures.push(this.getPolyFeature(zone1Poly, options))
           }
           if (zone2Poly.length > 2) {
               zone2PolyFeatures.push(this.getPolyFeature(zone2Poly, options))
           }
        });

        return [zone1PolyFeatures, zone2PolyFeatures]
    }

    /* 
     * Split the line defined by start/stop coordinates, as necessary
     * i.e., if there is antimeridian crossing 
    */
    #handleAntiMeridianCrossing(lat1: number, lon1: number, lat2: number, lon2: number): Array<[number, number]> {
        /* determine whether there is a crossing */
        if (this.crossCheck(lat1, lon1, lat2, lon2)) {
        //if (Math.abs(lon1 - lon2) > 180.0) {
          /* start point distance to antimeridian */
          const start_dist_to_antimeridian = lon1 > 0 ? 180 - lon1 : 180 + lon1;
          /* end point distance to antimeridian */
          const end_dist_to_antimeridian = lon2 > 0 ? 180 - lon2 : 180 + lon2;
          /* abs distance between first lat and second lat */
          const lat_difference = Math.abs(lat1 - lat2);
          /* determine the angle from the horizontal */
          //var alpha_angle = Math.atan(lat_difference / (start_dist_to_antimeridian + end_dist_to_antimeridian)) * (180 / Math.PI) * (lon1 > 0 ? 1 : -1);
          let alpha_angle = Math.atan(lat_difference / (start_dist_to_antimeridian + end_dist_to_antimeridian)) * (180 / Math.PI);
          //if ((lat1 - lat2) < 0  && alpha_angle < 90) alpha_angle = alpha_angle * -1; // angle calc assumes closewise orientation, but poly points are guaranteed counterclockwise
          /* determine lat difference at the antimeridian */
          const lat_diff_at_antimeridian = Math.tan(alpha_angle * Math.PI / 180) * start_dist_to_antimeridian;
          /* calculate the intersecting lat at the antimeridian */
          const intersection_lat = lat1 + (lat_diff_at_antimeridian * (lat1 > lat2 ? -1 : 1));
          /* determine the end lon of the first point */
          const first_line_end: [number, number] = [intersection_lat, lon1 > 0 ? 180 : -180];
          /* determine the start lon of the second point */
          const second_line_start: [number, number] = [intersection_lat, lon2 > 0 ? 180 : -180];
          /* return the new ending and starting points (they split the crossing line */
          return [ [first_line_end[1], intersection_lat] as [number, number], [second_line_start[1], intersection_lat] as [number, number] ];
        } else {
          return [[lon2, lat2] as [number, number]];
        }
    }

    /* Check if a line segment crosses the antimeridian */
    crossCheck(lat1: number, lon1: number, lat2: number, lon2: number) {
        var distance = Math.abs(lon1 - lon2);
        if (lat1 == 0 || lat2 == 0) { // artifact of loop processing; return false
          return false;
        }
        return distance > 180;
      }

    /* *
     * Connect the coordinates between primary and secondary
     * to 'wrap' the pole
     * */
    wrapPole(zone1: Array<[number,number]>, zone2: Array<[number,number]>) {
        var wrapped = zone1.concat([]);
        if (zone1[zone1.length - 1][1] < 0) {
          wrapped.push([-179.5,-89.5]);
          wrapped.push([179.5,-89.5]);
        } else {
          wrapped.push([179.5,89.5]);
          wrapped.push([-179.5,89.5]);
        }
        wrapped = wrapped.concat(zone2);
        //console.log("     created pole wrapping merged zone1: " + wrapped.join(", " ) + "\n\n");
        return wrapped;
    }

    /* Return a geojson polygon feature given a set of geodetic cartesian coordinates */
    getPolyFeature(points:Array<[number, number]>, options: Record<string, any>) {
        return {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                        points                 
                ]
            },
            "properties": {
                "File Name": options["file-id"],
                "Coordinates": points.map((pt) => "(" + pt[0] + ', ' + pt[1] + ") "),
                "Provider": options["provider-id"],
                "Collection Shortname": options["collection-shortname"],
                "Collection Version": options["collection-version"],
                "Collection Concept ID": options["concept-id"],
                "Last Updated": options["last-updated"],
                "PGE Version": options["pge-version"],
            },
        }
    }

}
