import { expect } from '@open-wc/testing'
import { MapService } from '../map.service.js'
import sinon, { type SinonSpy } from 'sinon'
import { LatLng } from '../models/LatLng.js'
import { LatLngBounds } from '../models/LatLngBounds.js'
import { View } from 'ol'
import { DrawToolbarControl } from '../controls/draw-toolbar.control.js'
import { Layer } from 'ol/layer.js'

describe('Map Service', () => {
    let el: HTMLElement
    let service: MapService
    let onMouseMove: SinonSpy
    let onDraw: SinonSpy

    beforeEach(() => {
        el = document.createElement('div')
        el.style.width = '100px'
        el.style.height = '100px'
        document.body.appendChild(el)

        onMouseMove = sinon.spy()
        onDraw = sinon.spy()

        service = new MapService(el, {
            onMouseMove,
            onDraw,
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

    it('toggles the layer visibility', () => {
        const setVisibleSpy = sinon.spy(Layer.prototype, 'setVisible')

        service.toggleLayerVisibility('graticule', true)

        expect(setVisibleSpy.calledOnce).to.be.true
        expect(setVisibleSpy.calledWith(true)).to.be.true
    })

    it('does nothing when layer name does not exist', () => {
        const setVisibleSpy = sinon.spy(Layer.prototype, 'setVisible')

        service.toggleLayerVisibility('nonexistent', true)

        expect(setVisibleSpy.called).to.be.false
    })

    it('hides a layer', () => {
        const setVisibleSpy = sinon.spy(Layer.prototype, 'setVisible')

        service.toggleLayerVisibility('graticule', false)

        expect(setVisibleSpy.calledWith(false)).to.be.true
    })

    it.skip('calls onMouseMove when pointer moves', () => {
        // TODO
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
})
