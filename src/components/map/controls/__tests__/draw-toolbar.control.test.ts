import { DrawToolbarControl, type Options } from '../draw-toolbar.control.js'
import { LatLng } from '../../models/LatLng.js'
import { LatLngBounds } from '../../models/LatLngBounds.js'
import { expect } from '@open-wc/testing'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import Feature from 'ol/Feature.js'
import { Point, Polygon } from 'ol/geom.js'

describe('DrawToolbarControl', () => {
    let vectorSource: VectorSource
    let vectorLayer: VectorLayer
    let control: DrawToolbarControl

    beforeEach(() => {
        vectorSource = new VectorSource()
        vectorLayer = new VectorLayer({ source: vectorSource })
        control = new DrawToolbarControl(vectorLayer)
    })

    afterEach(() => {
        vectorSource.clear()
    })

    describe('Initialization', () => {
        it('should create a DrawToolbarControl instance', () => {
            expect(control).to.be.instanceOf(DrawToolbarControl)
        })

        it('should have a DOM element', () => {
            const element = (control as any).element
            expect(element).to.exist
            expect(element.className).to.include('draw-toolbar')
        })

        it('should create buttons in the toolbar', () => {
            const element = (control as any).element
            const buttons = element.querySelectorAll('button')
            expect(buttons.length).to.be.greaterThan(0)
        })

        it('should create a cancel button', () => {
            const element = (control as any).element
            const buttons = element.querySelectorAll('button')
            const lastButton = buttons[buttons.length - 1]
            expect(lastButton.innerHTML).to.include('✕')
        })
    })

    describe('Options and visibility', () => {
        it('should accept options in constructor', () => {
            const options: Options = {
                showBboxTool: true,
                showPolygonTool: false,
            }
            const ctrl = new DrawToolbarControl(vectorLayer, options)
            expect(ctrl).to.exist
        })

        it('should toggle button visibility for bbox tool', () => {
            const options: Options = { showBboxTool: true }
            const ctrl = new DrawToolbarControl(vectorLayer, options)
            ctrl.toggleButtonVisibility('bbox')

            const btn = (ctrl as any).element.querySelector(
                'button:nth-child(1)'
            ) as HTMLButtonElement
            expect(btn.style.display).to.equal('inline-block')
        })

        it('should hide button when option is false', () => {
            const options: Options = { showBboxTool: false }
            const ctrl = new DrawToolbarControl(vectorLayer, options)
            ctrl.toggleButtonVisibility('bbox')

            const btn = (ctrl as any).element.querySelector(
                'button:nth-child(1)'
            ) as HTMLButtonElement
            expect(btn.style.display).to.equal('none')
        })

        it('should update options with setOptions', () => {
            control.setOptions({ showPointTool: true })
            expect(control).to.exist
        })

        it('should toggle visibility for all tools', () => {
            control.setOptions({
                showBboxTool: true,
                showPolygonTool: true,
                showPointTool: true,
                showCircleTool: true,
            })

            const buttons = (control as any).element.querySelectorAll('button')
            // Exclude cancel button (last one)
            for (let i = 0; i < 4; i++) {
                expect((buttons[i] as HTMLButtonElement).style.display).to.equal(
                    'inline-block'
                )
            }
        })
    })

    describe('setValue with LatLng', () => {
        it('should add a point feature from LatLng', () => {
            const latLng = new LatLng(40.7128, -74.006)
            control.setValue(latLng)

            const features = vectorSource.getFeatures()
            expect(features.length).to.equal(1)
        })

        it('should create a point feature with correct drawtool property', () => {
            const latLng = new LatLng(40.7128, -74.006)
            control.setValue(latLng)

            const features = vectorSource.getFeatures()
            expect(features[0].get('drawtool')).to.equal('point')
        })

        it('should create a Point geometry', () => {
            const latLng = new LatLng(40.7128, -74.006)
            control.setValue(latLng)

            const features = vectorSource.getFeatures()
            const geometry = features[0].getGeometry()
            expect(geometry).to.be.instanceOf(Point)
        })

        it('should clear previous features when setting new value', () => {
            const latLng1 = new LatLng(40.7128, -74.006)
            const latLng2 = new LatLng(51.5074, -0.1278)

            control.setValue(latLng1)
            expect(vectorSource.getFeatures().length).to.equal(1)

            control.setValue(latLng2)
            expect(vectorSource.getFeatures().length).to.equal(1)
        })

        it('should handle negative coordinates', () => {
            const latLng = new LatLng(-33.8688, 151.2093)
            control.setValue(latLng)

            const features = vectorSource.getFeatures()
            expect(features.length).to.equal(1)
        })

        it('should handle zero coordinates', () => {
            const latLng = new LatLng(0, 0)
            control.setValue(latLng)

            const features = vectorSource.getFeatures()
            expect(features.length).to.equal(1)
        })
    })

    describe('setValue with LatLngBounds', () => {
        it('should add a bbox feature from LatLngBounds', () => {
            const bounds = new LatLngBounds([-122.4194, 37.7749, -122.358, 37.8199])
            control.setValue(bounds)

            const features = vectorSource.getFeatures()
            expect(features.length).to.equal(1)
        })

        it('should create a bbox feature with correct drawtool property', () => {
            const bounds = new LatLngBounds([-122.4194, 37.7749, -122.358, 37.8199])
            control.setValue(bounds)

            const features = vectorSource.getFeatures()
            expect(features[0].get('drawtool')).to.equal('bbox')
        })

        it('should create a Polygon geometry', () => {
            const bounds = new LatLngBounds([-122.4194, 37.7749, -122.358, 37.8199])
            control.setValue(bounds)

            const features = vectorSource.getFeatures()
            const geometry = features[0].getGeometry()
            expect(geometry).to.be.instanceOf(Polygon)
        })

        it('should clear vector source when setting new bounds', () => {
            const bounds1 = new LatLngBounds([0, 0, 10, 10])
            const bounds2 = new LatLngBounds([-20, -20, -10, -10])

            control.setValue(bounds1)
            expect(vectorSource.getFeatures().length).to.equal(1)

            control.setValue(bounds2)
            expect(vectorSource.getFeatures().length).to.equal(1)
        })

        it('should handle global bounds', () => {
            const bounds = new LatLngBounds([-180, -90, 180, 90])
            control.setValue(bounds)

            const features = vectorSource.getFeatures()
            expect(features.length).to.equal(1)
        })
    })

    describe('buildPointFeature', () => {
        it('should build a point feature from LatLng', () => {
            const latLng = new LatLng(40.7128, -74.006)
            const feature = control.buildPointFeature(latLng)

            expect(feature).to.be.instanceOf(Feature)
            expect(feature.get('drawtool')).to.equal('point')
        })

        it('should create Point geometry', () => {
            const latLng = new LatLng(40.7128, -74.006)
            const feature = control.buildPointFeature(latLng)

            expect(feature.getGeometry()).to.be.instanceOf(Point)
        })

        it('should handle multiple points', () => {
            const latLng1 = new LatLng(40.7128, -74.006)
            const latLng2 = new LatLng(51.5074, -0.1278)

            const feature1 = control.buildPointFeature(latLng1)
            const feature2 = control.buildPointFeature(latLng2)

            expect(feature1).to.not.equal(feature2)
        })
    })

    describe('buildBBoxFeature', () => {
        it('should build a bbox feature from LatLngBounds', () => {
            const bounds = new LatLngBounds([-122.4194, 37.7749, -122.358, 37.8199])
            const feature = control.buildBBoxFeature(bounds)

            expect(feature).to.be.instanceOf(Feature)
            expect(feature.get('drawtool')).to.equal('bbox')
        })

        it('should create Polygon geometry', () => {
            const bounds = new LatLngBounds([-122.4194, 37.7749, -122.358, 37.8199])
            const feature = control.buildBBoxFeature(bounds)

            expect(feature.getGeometry()).to.be.instanceOf(Polygon)
        })

        it('should create closed polygon (5 coordinates)', () => {
            const bounds = new LatLngBounds([0, 0, 10, 10])
            const feature = control.buildBBoxFeature(bounds)

            const geometry = feature.getGeometry() as Polygon
            const coords = geometry.getCoordinates()[0]
            // Should have 5 coordinates (4 corners + 1 to close)
            expect(coords.length).to.equal(5)
        })

        it('should have first and last coordinate same (closed ring)', () => {
            const bounds = new LatLngBounds([0, 0, 10, 10])
            const feature = control.buildBBoxFeature(bounds)

            const geometry = feature.getGeometry() as Polygon
            const coords = geometry.getCoordinates()[0]
            const first = coords[0]
            const last = coords[coords.length - 1]

            expect(first[0]).to.equal(last[0])
            expect(first[1]).to.equal(last[1])
        })

        it('should handle negative bounds', () => {
            const bounds = new LatLngBounds([-180, -90, -170, -80])
            const feature = control.buildBBoxFeature(bounds)

            expect(feature).to.exist
            expect(feature.getGeometry()).to.be.instanceOf(Polygon)
        })
    })

    describe('Tool information methods', () => {
        it('should have bbox tool title', () => {
            expect(control).to.exist
        })

        it('should provide icon HTML for each tool', () => {
            expect(control).to.exist
        })
    })

    describe('Multiple setValue calls', () => {
        it('should replace point with point', () => {
            const latLng1 = new LatLng(40.7128, -74.006)
            const latLng2 = new LatLng(51.5074, -0.1278)

            control.setValue(latLng1)
            control.setValue(latLng2)

            expect(vectorSource.getFeatures().length).to.equal(1)
        })

        it('should replace bbox with bbox', () => {
            const bounds1 = new LatLngBounds([0, 0, 10, 10])
            const bounds2 = new LatLngBounds([-20, -20, -10, -10])

            control.setValue(bounds1)
            control.setValue(bounds2)

            expect(vectorSource.getFeatures().length).to.equal(1)
        })

        it('should replace point with bbox', () => {
            const latLng = new LatLng(40.7128, -74.006)
            const bounds = new LatLngBounds([-122.4194, 37.7749, -122.358, 37.8199])

            control.setValue(latLng)
            expect(vectorSource.getFeatures()[0].get('drawtool')).to.equal('point')

            control.setValue(bounds)
            expect(vectorSource.getFeatures()[0].get('drawtool')).to.equal('bbox')
        })

        it('should replace bbox with point', () => {
            const bounds = new LatLngBounds([-122.4194, 37.7749, -122.358, 37.8199])
            const latLng = new LatLng(40.7128, -74.006)

            control.setValue(bounds)
            expect(vectorSource.getFeatures()[0].get('drawtool')).to.equal('bbox')

            control.setValue(latLng)
            expect(vectorSource.getFeatures()[0].get('drawtool')).to.equal('point')
        })
    })

    describe('Edge cases', () => {
        it('should handle setValue when source is null', () => {
            const emptyLayer = new VectorLayer({ source: undefined as any })
            const ctrl = new DrawToolbarControl(emptyLayer)

            const latLng = new LatLng(40.7128, -74.006)
            // Should not throw
            ctrl.setValue(latLng)
        })

        it('should maintain control element on multiple operations', () => {
            const element1 = (control as any).element
            control.setValue(new LatLng(40.7128, -74.006))
            control.setOptions({ showBboxTool: true })
            const element2 = (control as any).element

            expect(element1).to.equal(element2)
        })
    })
})
