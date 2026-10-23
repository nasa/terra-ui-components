import { expect, waitUntil } from '@open-wc/testing'
import { MapService } from '../map.service.js'
import sinon, { type SinonSpy } from 'sinon'
import { LatLng } from '../models/LatLng.js'
import { LatLngBounds } from '../models/LatLngBounds.js'
import { Map, View } from 'ol'
import { DrawToolbarControl } from '../controls/draw-toolbar.control.js'
import { Layer } from 'ol/layer.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import Draw from 'ol/interaction/Draw.js'
import Collection from 'ol/Collection.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { transformExtent, type Projection } from 'ol/proj.js'
import Feature from 'ol/Feature.js'
import Point from 'ol/geom/Point.js'
import type { Stroke, Style } from 'ol/style.js'

describe('Map Service', () => {
    let el: HTMLElement
    let service: MapService
    let onMouseMove: SinonSpy
    let onDraw: SinonSpy
    let onReady: SinonSpy
    let onClick: SinonSpy
    let onDoubleClick: SinonSpy
    let onMoveEnd: SinonSpy
    let onZoomChange: SinonSpy
    let onLayerClick: SinonSpy
    let onLayerError: SinonSpy

    beforeEach(() => {
        el = document.createElement('div')
        el.style.width = '100px'
        el.style.height = '100px'
        document.body.appendChild(el)

        onMouseMove = sinon.spy()
        onDraw = sinon.spy()
        onReady = sinon.spy()
        onClick = sinon.spy()
        onDoubleClick = sinon.spy()
        onMoveEnd = sinon.spy()
        onZoomChange = sinon.spy()
        onLayerClick = sinon.spy()
        onLayerError = sinon.spy()

        service = new MapService(el, {
            zoom: 5,
            onMouseMove,
            onDraw,
            onReady,
            onClick,
            onDoubleClick,
            onMoveEnd,
            onZoomChange,
            onLayerClick,
            onLayerError,
        })
    })

    afterEach(() => {
        sinon.restore()
        document.body.innerHTML = ''
    })

    describe('parseLocationString', () => {
        it('parses point coordinates', () => {
            const result = service.parseLocationString('40.7128, -74.006')

            expect(result).to.be.instanceOf(LatLng)
            expect((result as LatLng).lat).to.equal(40.7128)
            expect((result as LatLng).lng).to.equal(-74.006)
        })

        it('parses bounding box coordinates', () => {
            const result = service.parseLocationString('1, 2, 3, 4')

            expect(result).to.be.instanceOf(LatLngBounds)
            expect((result as LatLngBounds).getWest()).to.equal(1)
            expect((result as LatLngBounds).getSouth()).to.equal(2)
            expect((result as LatLngBounds).getEast()).to.equal(3)
            expect((result as LatLngBounds).getNorth()).to.equal(4)
        })

        it('throws a BadRequestException for invalid input length', () => {
            expect(() => service.parseLocationString('1,2,3')).to.throw(
                'Failed to parse location string. Location must be in format: `lat,lng` for a point or `west,south,east,north` for a bounding box'
            )
        })
    })

    it('sets the zoom level on the map view', () => {
        const setZoomSpy = sinon.spy(View.prototype, 'setZoom')

        service.setZoom(6)

        expect(setZoomSpy.calledOnce).to.be.true
        expect(setZoomSpy.calledWith(6)).to.be.true
    })

    it('animates the zoom level when a duration is given', () => {
        const setZoomSpy = sinon.spy(View.prototype, 'setZoom')
        const animateSpy = sinon.spy(View.prototype, 'animate')

        service.setZoom(6, { duration: 200 })

        expect(animateSpy.calledWith({ zoom: 6, duration: 200 })).to.be.true
        expect(setZoomSpy.called).to.be.false
    })

    it('sets a LatLng value on the draw toolbar control', () => {
        const setValueSpy = sinon.spy(DrawToolbarControl.prototype, 'setValue')

        service.setValue('40.7128, -74.006')

        expect(setValueSpy.calledOnce).to.be.true
        expect(setValueSpy.calledWith(sinon.match.instanceOf(LatLng))).to.be.true
    })

    it('sets a LatLngBounds value on the draw toolbar control', () => {
        const setValueSpy = sinon.spy(DrawToolbarControl.prototype, 'setValue')

        service.setValue('12, 13, 14, 15')

        expect(setValueSpy.calledOnce).to.be.true
        expect(setValueSpy.calledWith(sinon.match.instanceOf(LatLngBounds))).to.be
            .true
    })

    it('updates the draw toolbar visibility', () => {
        const setOptionsSpy = sinon.spy(DrawToolbarControl.prototype, 'setOptions')

        service.updateDrawToolbarVisibility({
            showBoundingBoxSelection: true,
            showPolygonSelection: false,
            showPointSelection: true,
            showCircleSelection: false,
        })

        expect(setOptionsSpy.calledOnce).to.be.true
        expect(
            setOptionsSpy.calledWith({
                showBboxTool: true,
                showPolygonTool: false,
                showPointTool: true,
                showCircleTool: false,
            })
        ).to.be.true
    })

    it('sets the layer visibility', () => {
        const setVisibleSpy = sinon.spy(Layer.prototype, 'setVisible')

        service.setLayerVisibility('graticule', true)

        expect(setVisibleSpy.calledOnce).to.be.true
        expect(setVisibleSpy.calledWith(true)).to.be.true
    })

    it('does nothing when layer name does not exist', () => {
        const setVisibleSpy = sinon.spy(Layer.prototype, 'setVisible')

        service.setLayerVisibility('nonexistent', true)

        expect(setVisibleSpy.called).to.be.false
    })

    it('hides a layer', () => {
        const setVisibleSpy = sinon.spy(Layer.prototype, 'setVisible')

        service.setLayerVisibility('graticule', false)

        expect(setVisibleSpy.calledWith(false)).to.be.true
    })

    it.skip('calls onMouseMove when pointer moves', () => {
        // TODO
    })

    describe('addLayer / removeLayer / getLayer', () => {
        it('inserts a custom layer below the borders layer by default', () => {
            // the map is created with 7 built-in layers (base, borders,
            // labels, graticule, shapes, boundaries, draw), with borders at index 1
            const insertAtSpy = sinon.spy(Collection.prototype, 'insertAt')
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, { name: 'custom' })

            expect(insertAtSpy.calledWith(1, customLayer)).to.be.true
        })

        it('inserts a custom layer above everything when position is "top"', () => {
            const insertAtSpy = sinon.spy(Collection.prototype, 'insertAt')
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, { name: 'custom-top', position: 'top' })

            // 7 built-in layers occupy indices 0-6 (base, borders, labels,
            // graticule, shapes, boundaries, draw), so pushing onto the end
            // inserts at index 7
            expect(insertAtSpy.calledWith(7, customLayer)).to.be.true
        })

        it('finds a named layer with getLayer', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })
            service.addLayer(customLayer, { name: 'custom' })

            expect(service.getLayer('custom')).to.equal(customLayer)
            expect(service.getLayer('nonexistent')).to.be.undefined
        })

        it('removes a named layer', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })
            service.addLayer(customLayer, { name: 'custom' })

            service.removeLayer('custom')

            expect(service.getLayer('custom')).to.be.undefined
        })
    })

    describe('layer boundaries (extent outlines)', () => {
        function boundaryFeatures() {
            const boundaryLayer = service.getLayer('boundaries') as VectorLayer
            return boundaryLayer.getSource()!.getFeatures()
        }

        it('draws a boundary feature when extent is given', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, {
                name: 'custom',
                extent: [-10, -10, 10, 10],
            })

            const features = boundaryFeatures()
            expect(features.length).to.equal(1)
            expect(features[0].get('layerName')).to.equal('custom')
        })

        it('adds no boundary feature when extent is omitted', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, { name: 'custom' })

            expect(boundaryFeatures().length).to.equal(0)
        })

        it("removes only the removed layer's boundary feature", () => {
            const layerA = new VectorLayer({ source: new VectorSource() })
            const layerB = new VectorLayer({ source: new VectorSource() })

            service.addLayer(layerA, { name: 'a', extent: [-10, -10, 10, 10] })
            service.addLayer(layerB, { name: 'b', extent: [-20, -20, 20, 20] })

            service.removeLayer('a')

            const features = boundaryFeatures()
            expect(features.length).to.equal(1)
            expect(features[0].get('layerName')).to.equal('b')
        })

        it('removing a layer with no boundary does not throw', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })
            service.addLayer(customLayer, { name: 'custom' })

            expect(() => service.removeLayer('custom')).to.not.throw()
        })

        it('styles the boundary feature by boundaryColorIndex', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, {
                name: 'custom',
                extent: [-10, -10, 10, 10],
                boundaryColorIndex: 1,
            })

            const style = boundaryFeatures()[0].getStyle() as Style
            expect((style.getStroke() as Stroke).getColor()).to.equal(
                'rgba(52, 152, 219, 1)'
            )
        })

        it('defaults boundaryColorIndex to 0', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, {
                name: 'custom',
                extent: [-10, -10, 10, 10],
            })

            const style = boundaryFeatures()[0].getStyle() as Style
            expect((style.getStroke() as Stroke).getColor()).to.equal(
                'rgba(46, 204, 113, 1)'
            )
        })

        it('draws a boundary from a sourceExtent tag on the layer when extent is omitted', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })
            customLayer.set('sourceExtent', [-10, -10, 10, 10])

            service.addLayer(customLayer, { name: 'custom' })

            const features = boundaryFeatures()
            expect(features.length).to.equal(1)
            expect(features[0].get('layerName')).to.equal('custom')
        })

        it('prefers an explicit extent over a sourceExtent tag', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })
            customLayer.set('sourceExtent', [-10, -10, 10, 10])

            service.addLayer(customLayer, {
                name: 'custom',
                extent: [-20, -20, 20, 20],
            })

            const expected = transformExtent(
                [-20, -20, 20, 20],
                'EPSG:4326',
                'EPSG:3857'
            )
            const actual = boundaryFeatures()[0].getGeometry()!.getExtent()

            expect(actual[0]).to.be.closeTo(expected[0]!, 1)
            expect(actual[1]).to.be.closeTo(expected[1]!, 1)
            expect(actual[2]).to.be.closeTo(expected[2]!, 1)
            expect(actual[3]).to.be.closeTo(expected[3]!, 1)
        })

        it('suppresses the boundary when showBoundary is false, even with a sourceExtent tag', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })
            customLayer.set('sourceExtent', [-10, -10, 10, 10])

            service.addLayer(customLayer, { name: 'custom', showBoundary: false })

            expect(boundaryFeatures().length).to.equal(0)
        })

        it('suppresses the boundary when showBoundary is false, even with an explicit extent', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })

            service.addLayer(customLayer, {
                name: 'custom',
                extent: [-10, -10, 10, 10],
                showBoundary: false,
            })

            expect(boundaryFeatures().length).to.equal(0)
        })
    })

    it('fits the view to a reprojected extent', () => {
        const fitSpy = sinon.spy(View.prototype, 'fit')

        service.fitToExtent([-74, 40, -73, 41], { projection: 'EPSG:4326' })

        expect(fitSpy.calledOnce).to.be.true
    })

    it('adds and removes an interaction', () => {
        const draw = new Draw({
            source: new VectorSource(),
            type: 'Point',
        })

        const addSpy = sinon.spy(Map.prototype, 'addInteraction')
        const removeSpy = sinon.spy(Map.prototype, 'removeInteraction')

        service.addInteraction(draw)
        service.removeInteraction(draw)

        expect(addSpy.calledWith(draw)).to.be.true
        expect(removeSpy.calledWith(draw)).to.be.true
    })

    it('returns the map size and canvas/svg elements', () => {
        expect(service.getSize()).to.exist
        expect(service.getCanvasElements()).to.have.keys(['canvases', 'svgs'])
    })

    it('delegates getFeaturesAtPixel to the underlying map', () => {
        const getFeaturesAtPixelSpy = sinon.spy(Map.prototype, 'getFeaturesAtPixel')

        service.getFeaturesAtPixel([10, 10])

        expect(getFeaturesAtPixelSpy.calledWith([10, 10])).to.be.true
    })

    it.skip('dispatches onDraw for bbox geometry', () => {
        // TODO
    })

    it.skip('dispatches onDraw for point geometry', () => {
        // TODO
    })

    it.skip('dispatches onDraw for circle geometry', () => {
        // TODO
    })

    it.skip('dispatches onDraw for polygon geometry', () => {
        // TODO
    })

    describe('projection', () => {
        it('defaults the view to EPSG:3857', () => {
            expect(service.getView().getProjection().getCode()).to.equal('EPSG:3857')
        })

        it('uses the configured projection for the view', () => {
            const el2 = document.createElement('div')
            document.body.appendChild(el2)
            const polarService = new MapService(el2, {
                projection: 'EPSG:4326',
                onMouseMove: sinon.spy(),
                onDraw: sinon.spy(),
            })

            expect(polarService.getView().getProjection().getCode()).to.equal(
                'EPSG:4326'
            )
        })

        it('builds the view with noWorldWrap on a non-EPSG:3857 projection without throwing', () => {
            const el2 = document.createElement('div')
            document.body.appendChild(el2)

            expect(
                () =>
                    new MapService(el2, {
                        projection: 'EPSG:4326',
                        noWorldWrap: true,
                        onMouseMove: sinon.spy(),
                        onDraw: sinon.spy(),
                    })
            ).to.not.throw()
        })

        it('reprojects a loaded shape into the configured view projection, not a hardcoded EPSG:3857', async () => {
            const el2 = document.createElement('div')
            document.body.appendChild(el2)
            const readFeaturesSpy = sinon.spy(GeoJSON.prototype, 'readFeatures')
            const polarService = new MapService(el2, {
                projection: 'EPSG:4326',
                onMouseMove: sinon.spy(),
                onDraw: sinon.spy(),
                getGeoJson: async () => ({
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {},
                            geometry: { type: 'Point', coordinates: [10, 20] },
                        },
                    ],
                }),
            })

            await polarService.handleShapeSelect({
                target: { value: 'some-shape', options: [], selectedIndex: 0 },
            } as unknown as Event)

            expect(
                readFeaturesSpy.calledWith(
                    sinon.match.any,
                    sinon.match({ featureProjection: sinon.match.has('getCode') })
                )
            ).to.be.true
            const featureProjection = readFeaturesSpy.firstCall?.args[1]
                ?.featureProjection as Projection
            expect(featureProjection.getCode()).to.equal('EPSG:4326')
        })
    })

    describe('navigation', () => {
        it('sets and gets the center (round-trips within tolerance)', () => {
            service.setCenter(-74, 40.7)

            const center = service.getCenter()

            expect(center.equals(new LatLng(40.7, -74), 1e-6)).to.be.true
        })

        it('animates the center when a duration is given', () => {
            const animateSpy = sinon.spy(View.prototype, 'animate')

            service.setCenter(-74, 40.7, { duration: 200 })

            expect(animateSpy.calledOnce).to.be.true
        })

        it('gets the zoom level', () => {
            expect(service.getZoom()).to.equal(5)
        })

        it('zooms in and out relative to the current zoom', () => {
            service.zoomIn()
            expect(service.getZoom()).to.equal(6)

            service.zoomOut()
            expect(service.getZoom()).to.equal(5)
        })

        it('fits the view to a LatLngBounds', () => {
            const fitSpy = sinon.spy(View.prototype, 'fit')

            service.fitBounds(new LatLngBounds([-74, 40, -73, 41]))

            expect(fitSpy.calledOnce).to.be.true
        })

        it('gets the current view bounds as a LatLngBounds', () => {
            expect(service.getBounds()).to.be.instanceOf(LatLngBounds)
        })

        it('resets the view to its initial center/zoom/rotation', () => {
            service.setZoom(10)
            service.setCenter(10, 20)

            service.resetView()

            expect(service.getZoom()).to.equal(5)
            expect(service.getCenter().equals(new LatLng(0, 0), 1e-6)).to.be.true
        })

        it('sets and gets rotation', () => {
            service.setRotation(Math.PI / 4)

            expect(service.getRotation()).to.equal(Math.PI / 4)
        })
    })

    describe('layer management', () => {
        it('getLayers() is empty on a fresh service', () => {
            expect(service.getLayers()).to.deep.equal([])
        })

        it('getLayers() reflects only addLayer()-added layers', () => {
            const customLayer = new VectorLayer({ source: new VectorSource() })
            service.addLayer(customLayer, { name: 'custom' })

            const layers = service.getLayers()

            expect(layers).to.have.lengthOf(1)
            expect(layers[0]).to.equal(customLayer)
        })

        it('sets layer opacity', () => {
            const setOpacitySpy = sinon.spy(Layer.prototype, 'setOpacity')
            const customLayer = new VectorLayer({ source: new VectorSource() })
            service.addLayer(customLayer, { name: 'custom' })

            service.setLayerOpacity('custom', 0.5)

            expect(setOpacitySpy.calledWith(0.5)).to.be.true
        })

        it("reorders consumer layers, leaving a built-in layer's absolute index unchanged", () => {
            const a = new VectorLayer({ source: new VectorSource() })
            const b = new VectorLayer({ source: new VectorSource() })
            service.addLayer(a, { name: 'a', position: 'top' })
            service.addLayer(b, { name: 'b', position: 'top' })

            service.setLayerOrder(['b', 'a'])

            const all = service.getAllLayers()
            // borders is still the built-in at its original index (1)
            expect(all[1].get('name')).to.equal('borders')
            expect(all.at(-2)?.get('name')).to.equal('b')
            expect(all.at(-1)?.get('name')).to.equal('a')
        })

        it('warns and skips unknown names in setLayerOrder', () => {
            const warnSpy = sinon.spy(console, 'warn')

            service.setLayerOrder(['nonexistent'])

            expect(warnSpy.called).to.be.true
        })

        it('fits to a layer with an extent-aware source', () => {
            const fitSpy = sinon.spy(View.prototype, 'fit')
            const source = new VectorSource()
            source.addFeature(new Feature(new Point([0, 0])))
            const customLayer = new VectorLayer({ source })
            service.addLayer(customLayer, { name: 'custom' })

            service.fitToLayer('custom')

            expect(fitSpy.calledOnce).to.be.true
        })

        it('warns and no-ops fitting to a layer with no extent', () => {
            const warnSpy = sinon.spy(console, 'warn')
            const customLayer = new VectorLayer({ source: new VectorSource() })
            service.addLayer(customLayer, { name: 'custom' })

            service.fitToLayer('custom')

            expect(warnSpy.called).to.be.true
        })

        it('warns fitting to an unknown layer name', () => {
            const warnSpy = sinon.spy(console, 'warn')

            service.fitToLayer('nonexistent')

            expect(warnSpy.called).to.be.true
        })

        it('clearLayers() removes only consumer-added layers', () => {
            const removeLayerSpy = sinon.spy(Map.prototype, 'removeLayer')
            const customLayer = new VectorLayer({ source: new VectorSource() })
            service.addLayer(customLayer, { name: 'custom' })

            service.clearLayers()

            expect(removeLayerSpy.calledOnceWith(customLayer)).to.be.true
            expect(service.getLayers()).to.have.lengthOf(0)
            expect(service.getLayer('graticule')).to.exist
        })

        it("refreshLayer() calls the source's refresh()", () => {
            const source = new VectorSource()
            const refreshSpy = sinon.spy(source, 'refresh')
            const customLayer = new VectorLayer({ source })
            service.addLayer(customLayer, { name: 'custom' })

            service.refreshLayer('custom')

            expect(refreshSpy.calledOnce).to.be.true
        })
    })

    describe('refresh / renderComplete', () => {
        it('refresh() updates the map size and re-renders', () => {
            const updateSizeSpy = sinon.spy(Map.prototype, 'updateSize')
            const renderSpy = sinon.spy(Map.prototype, 'render')

            service.refresh()

            expect(updateSizeSpy.calledOnce).to.be.true
            expect(renderSpy.calledOnce).to.be.true
        })

        it('renderComplete() refreshes and resolves once rendering completes', async () => {
            const updateSizeSpy = sinon.spy(Map.prototype, 'updateSize')

            await service.renderComplete()

            expect(updateSizeSpy.called).to.be.true
        })
    })

    describe('events', () => {
        it('fires onReady once synchronously during construction', () => {
            expect(onReady.calledOnce).to.be.true
        })

        it('fires onMoveEnd and onZoomChange after setCenter/setZoom settle', async () => {
            service.setCenter(10, 20)
            service.setZoom(8)

            await waitUntil(() => onMoveEnd.called)
            await waitUntil(() => onZoomChange.called)

            expect(onMoveEnd.called).to.be.true
            expect(onZoomChange.called).to.be.true
        })

        it('fires onClick/onDoubleClick/onLayerClick from real DOM events on the viewport', async () => {
            // OL's Map ignores every browser event until it has rendered at
            // least one frame (`frameState_` is null until then) - force and
            // await a render before dispatching synthetic pointer events.
            await service.renderComplete()

            // a point feature placed exactly at the view's center (the pixel
            // we're about to click) so hit-detection reliably finds it
            const source = new VectorSource()
            source.addFeature(new Feature(new Point([0, 0])))
            const customLayer = new VectorLayer({ source })
            service.addLayer(customLayer, { name: 'custom' })

            // re-render now that the layer/feature exist, so the new
            // layer's renderer is in place for hit-detection
            await service.renderComplete()

            const viewport = el.querySelector('.ol-viewport') as HTMLElement
            const rect = viewport.getBoundingClientRect()
            const options = {
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2,
                bubbles: true,
                button: 0,
                pointerId: 1,
                isPrimary: true,
            }

            // OL synthesizes click/dblclick itself from real pointerdown/up
            // sequences fired on the viewport (it doesn't listen for native
            // 'click'/'dblclick' at all) - a second down/up pair within its
            // 250ms window is what produces a dblclick.
            const tap = () => {
                viewport.dispatchEvent(new PointerEvent('pointerdown', options))
                document.dispatchEvent(new PointerEvent('pointerup', options))
            }

            tap()
            await waitUntil(() => onClick.called)
            expect(onClick.called).to.be.true
            await waitUntil(() => onLayerClick.called)
            expect(onLayerClick.calledWith(sinon.match.any, 'custom')).to.be.true

            tap()
            await waitUntil(() => onDoubleClick.called)
            expect(onDoubleClick.called).to.be.true
        })

        it('wires onLayerError via tileloaderror/imageloaderror on a consumer layer source', () => {
            const source = new VectorSource()
            const onSpy = sinon.spy(source, 'on')
            const customLayer = new VectorLayer({ source })

            service.addLayer(customLayer, { name: 'custom' })

            expect(
                (onSpy.calledWith as unknown as (type: string) => boolean)(
                    'tileloaderror'
                )
            ).to.be.true
            expect(
                (onSpy.calledWith as unknown as (type: string) => boolean)(
                    'imageloaderror'
                )
            ).to.be.true
        })
    })
})
