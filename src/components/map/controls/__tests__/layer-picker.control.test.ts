import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { Map as OlMap, View } from 'ol'
import TileLayer from 'ol/layer/Tile.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import { LayerPickerControl } from '../layer-picker.control.js'

describe('LayerPickerControl', () => {
    let mapTarget: HTMLElement
    let map: OlMap
    let worldImagery: TileLayer
    let osmLayer: TileLayer
    let bordersOverlay: VectorLayer
    let graticuleOverlay: VectorLayer
    let internalUntitledLayer: VectorLayer
    let onLayerToggle: sinon.SinonSpy
    let pickerControl: LayerPickerControl

    beforeEach(() => {
        mapTarget = document.createElement('div')
        mapTarget.style.width = '300px'
        mapTarget.style.height = '300px'
        document.body.appendChild(mapTarget)

        worldImagery = new TileLayer({ visible: true })
        worldImagery.set('name', 'base')
        worldImagery.set('title', 'World Imagery')
        worldImagery.set('type', 'base')

        osmLayer = new TileLayer({ visible: false })
        osmLayer.set('name', 'osm')
        osmLayer.set('title', 'OpenStreetMap')
        osmLayer.set('type', 'base')

        bordersOverlay = new VectorLayer({
            source: new VectorSource(),
            visible: true,
        })
        bordersOverlay.set('name', 'borders')
        bordersOverlay.set('title', 'International Boundaries')
        bordersOverlay.set('type', 'overlay')

        graticuleOverlay = new VectorLayer({
            source: new VectorSource(),
            visible: false,
        })
        graticuleOverlay.set('name', 'graticule')
        graticuleOverlay.set('title', 'Graticule')
        graticuleOverlay.set('type', 'overlay')

        internalUntitledLayer = new VectorLayer({
            source: new VectorSource(),
            visible: true,
        })
        internalUntitledLayer.set('name', 'drawLayer')

        onLayerToggle = sinon.spy()
        pickerControl = new LayerPickerControl({
            showLayerPicker: true,
            onLayerToggle,
        })

        map = new OlMap({
            target: mapTarget,
            layers: [
                worldImagery,
                osmLayer,
                bordersOverlay,
                graticuleOverlay,
                internalUntitledLayer,
            ],
            view: new View({ center: [0, 0], zoom: 2 }),
            controls: [pickerControl],
        })
    })

    afterEach(() => {
        map.setTarget(undefined)
        mapTarget.remove()
        sinon.restore()
    })

    it('creates an instance with a DOM element', () => {
        expect(pickerControl).to.be.instanceOf(LayerPickerControl)
        expect(pickerControl.element).to.exist
        expect(pickerControl.element.className).to.include('layer-picker-control')
    })

    it('toggles button visibility, panel display, and aria-expanded state', () => {
        const defaultCtrl = new LayerPickerControl()
        const defaultBtn = defaultCtrl.element.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        expect(defaultBtn.style.display).to.equal('none')

        const element = pickerControl.element
        const toggleBtn = element.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        const panel = element.querySelector('.layer-picker-panel') as HTMLElement

        expect(toggleBtn.style.display).to.equal('flex')
        expect(toggleBtn.getAttribute('aria-expanded')).to.equal('false')
        expect(panel.classList.contains('open')).to.be.false

        toggleBtn.click()
        expect(toggleBtn.getAttribute('aria-expanded')).to.equal('true')
        expect(toggleBtn.classList.contains('active')).to.be.true
        expect(panel.classList.contains('open')).to.be.true

        // Hiding the layer picker while open closes the panel automatically
        pickerControl.setOptions({ showLayerPicker: false })
        expect(toggleBtn.style.display).to.equal('none')
        expect(toggleBtn.getAttribute('aria-expanded')).to.equal('false')
        expect(panel.classList.contains('open')).to.be.false
    })

    it('groups titled layers into Base Maps and top-down Overlays while excluding untitled layers', () => {
        const element = pickerControl.element
        const toggleBtn = element.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        toggleBtn.click()

        const sections = element.querySelectorAll('.layer-picker-section')
        expect(sections.length).to.equal(2)

        const baseHeading = sections[0].querySelector(
            '.layer-picker-heading'
        )?.textContent
        const baseLabels = Array.from(
            sections[0].querySelectorAll('.layer-picker-item span')
        ).map(s => s.textContent)
        const baseInputs = Array.from(
            sections[0].querySelectorAll('input')
        ) as HTMLInputElement[]

        expect(baseHeading).to.equal('Base Maps')
        expect(baseLabels).to.deep.equal(['World Imagery', 'OpenStreetMap'])
        expect(baseInputs.map(i => i.type)).to.deep.equal(['radio', 'radio'])
        expect(baseInputs.map(i => i.checked)).to.deep.equal([true, false])

        const overlayHeading = sections[1].querySelector(
            '.layer-picker-heading'
        )?.textContent
        // Overlays are listed top-down (reversed from map layer order)
        const overlayLabels = Array.from(
            sections[1].querySelectorAll('.layer-picker-item span')
        ).map(s => s.textContent)
        const overlayInputs = Array.from(
            sections[1].querySelectorAll('input')
        ) as HTMLInputElement[]

        expect(overlayHeading).to.equal('Overlays')
        expect(overlayLabels).to.deep.equal(['Graticule', 'International Boundaries'])
        expect(overlayInputs.map(i => i.type)).to.deep.equal(['checkbox', 'checkbox'])
        expect(overlayInputs.map(i => i.checked)).to.deep.equal([false, true])
    })

    it('enforces mutual exclusion on base layers and notifies onLayerToggle', () => {
        const element = pickerControl.element
        const toggleBtn = element.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        toggleBtn.click()

        const radios = element.querySelectorAll(
            'input[type="radio"]'
        ) as NodeListOf<HTMLInputElement>
        radios[1].checked = true
        radios[1].dispatchEvent(new Event('change'))

        expect(worldImagery.getVisible()).to.be.false
        expect(osmLayer.getVisible()).to.be.true
        expect(onLayerToggle.calledOnce).to.be.true
        expect(onLayerToggle.firstCall.args[0]).to.deep.equal({
            name: 'osm',
            title: 'OpenStreetMap',
            type: 'base',
            visible: true,
            layer: osmLayer,
        })
    })

    it('toggles overlay visibility independently and notifies onLayerToggle', () => {
        const element = pickerControl.element
        const toggleBtn = element.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        toggleBtn.click()

        const checkboxes = element.querySelectorAll(
            'input[type="checkbox"]'
        ) as NodeListOf<HTMLInputElement>
        // First checkbox is Graticule (topmost overlay)
        checkboxes[0].checked = true
        checkboxes[0].dispatchEvent(new Event('change'))

        expect(graticuleOverlay.getVisible()).to.be.true
        expect(bordersOverlay.getVisible()).to.be.true
        expect(onLayerToggle.calledOnce).to.be.true
        expect(onLayerToggle.firstCall.args[0]).to.deep.equal({
            name: 'graticule',
            title: 'Graticule',
            type: 'overlay',
            visible: true,
            layer: graticuleOverlay,
        })
    })

    it('closes panel when clicking outside or clicking map', () => {
        const element = pickerControl.element
        const toggleBtn = element.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        const panel = element.querySelector('.layer-picker-panel') as HTMLElement

        toggleBtn.click()
        expect(panel.classList.contains('open')).to.be.true

        // Clicking outside
        document.body.click()
        expect(panel.classList.contains('open')).to.be.false

        // Re-open and click map
        toggleBtn.click()
        expect(panel.classList.contains('open')).to.be.true
        map.dispatchEvent('click')
        expect(panel.classList.contains('open')).to.be.false
    })

    it('updates panel when layers are added or removed dynamically', () => {
        const element = pickerControl.element
        const toggleBtn = element.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        toggleBtn.click()

        const newOverlay = new VectorLayer({
            source: new VectorSource(),
            visible: true,
        })
        newOverlay.set('name', 'custom-overlay')
        newOverlay.set('title', 'Custom Overlay')
        newOverlay.set('type', 'overlay')

        map.addLayer(newOverlay)

        const labels = Array.from(
            element.querySelectorAll('.layer-picker-item span')
        ).map(s => s.textContent)
        expect(labels).to.include('Custom Overlay')

        map.removeLayer(newOverlay)
        const updatedLabels = Array.from(
            element.querySelectorAll('.layer-picker-item span')
        ).map(s => s.textContent)
        expect(updatedLabels).to.not.include('Custom Overlay')
    })

    it('supports target element option in constructor', () => {
        const customTarget = document.createElement('div')
        const ctrl = new LayerPickerControl({ target: customTarget })
        const testMap = new OlMap({
            target: mapTarget,
            controls: [ctrl],
        })

        expect(customTarget.contains(ctrl.element)).to.be.true
        testMap.setTarget(undefined)
    })

    it('preserves panel scrollTop when a layer visibility change triggers a re-render', () => {
        const element = pickerControl.element
        const toggleBtn = element.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        const panel = element.querySelector('.layer-picker-panel') as HTMLElement

        // Add enough layers to make the panel scrollable
        for (let i = 0; i < 20; i++) {
            const layer = new VectorLayer({
                source: new VectorSource(),
                visible: false,
            })
            layer.set('name', `extra-${i}`)
            layer.set('title', `Extra Layer ${i}`)
            layer.set('type', 'overlay')
            map.addLayer(layer)
        }

        panel.style.maxHeight = '100px'
        panel.style.overflowY = 'auto'

        toggleBtn.click()
        panel.scrollTop = 60
        expect(panel.scrollTop).to.equal(60)

        const checkboxes = panel.querySelectorAll(
            'input[type="checkbox"]'
        ) as NodeListOf<HTMLInputElement>
        checkboxes[10].checked = true
        checkboxes[10].dispatchEvent(new Event('change'))

        expect(panel.scrollTop).to.equal(60)
    })
})
