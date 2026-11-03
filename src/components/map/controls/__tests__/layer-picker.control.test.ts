import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { Map as OlMap, View } from 'ol'
import TileLayer from 'ol/layer/Tile.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import {
    LayerPickerControl,
    extractGibsBins,
    extractGibsLegendData,
} from '../layer-picker.control.js'

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

    it('groups titled layers into Base Maps and Overlays while excluding untitled layers', () => {
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
        const overlayLabels = Array.from(
            sections[1].querySelectorAll('.layer-picker-item span')
        ).map(s => s.textContent)
        const overlayInputs = Array.from(
            sections[1].querySelectorAll('input')
        ) as HTMLInputElement[]

        expect(overlayHeading).to.equal('Overlays')
        expect(overlayLabels).to.deep.equal(['International Boundaries', 'Graticule'])
        expect(overlayInputs.map(i => i.type)).to.deep.equal(['checkbox', 'checkbox'])
        expect(overlayInputs.map(i => i.checked)).to.deep.equal([true, false])
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
        // Second checkbox is Graticule
        checkboxes[1].checked = true
        checkboxes[1].dispatchEvent(new Event('change'))

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

    it('does not accumulate duplicate change:visible listeners when a layer is removed and re-added', () => {
        // simulate map.service's setLayerOrder: it rebuilds the collection by
        // clearing it and pushing the *same* layer instances back on, which
        // fires `remove` then `add` for each one without creating new objects
        const layers = map.getLayers()
        layers.remove(graticuleOverlay)
        layers.push(graticuleOverlay)
        layers.remove(graticuleOverlay)
        layers.push(graticuleOverlay)

        expect(graticuleOverlay.getListeners('change:visible')).to.have.lengthOf(1)
    })

    it('still reacts to visibility changes after a layer is removed and re-added', () => {
        const toggleBtn = pickerControl.element.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        toggleBtn.click()

        const layers = map.getLayers()
        layers.remove(graticuleOverlay)
        layers.push(graticuleOverlay)

        const checkbox = Array.from(
            pickerControl.element.querySelectorAll('.layer-picker-item')
        )
            .find(item => item.querySelector('span')?.textContent === 'Graticule')
            ?.querySelector('input') as HTMLInputElement

        expect(checkbox.checked).to.be.false

        graticuleOverlay.setVisible(true)

        const updatedCheckbox = Array.from(
            pickerControl.element.querySelectorAll('.layer-picker-item')
        )
            .find(item => item.querySelector('span')?.textContent === 'Graticule')
            ?.querySelector('input') as HTMLInputElement

        expect(updatedCheckbox.checked).to.be.true
    })

    it('stops reacting to a removed layer after it is taken out of the collection for good', () => {
        const toggleBtn = pickerControl.element.querySelector(
            '.layer-picker-toggle'
        ) as HTMLButtonElement
        toggleBtn.click()

        map.removeLayer(graticuleOverlay)

        const labelsBeforeChange = Array.from(
            pickerControl.element.querySelectorAll('.layer-picker-item span')
        ).map(s => s.textContent)
        expect(labelsBeforeChange).to.not.include('Graticule')

        // changing visibility on a layer no longer in the map must not
        // re-render stale markup back in (it also must not throw)
        expect(() => graticuleOverlay.setVisible(true)).to.not.throw()

        const labelsAfterChange = Array.from(
            pickerControl.element.querySelectorAll('.layer-picker-item span')
        ).map(s => s.textContent)
        expect(labelsAfterChange).to.not.include('Graticule')
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

    describe('visualizations and accessibility', () => {
        let vizLayer: VectorLayer
        let legendSpy: sinon.SinonSpy

        beforeEach(() => {
            legendSpy = sinon.spy()
            pickerControl.setOptions({ onLegendClick: legendSpy })

            vizLayer = new VectorLayer({
                source: new VectorSource(),
                visible: true,
            })
            vizLayer.set('name', 'temp-anomaly')
            vizLayer.set('title', 'Temperature Anomaly')
            vizLayer.set('type', 'visualization')
            vizLayer.set('info', {
                min: 0,
                max: 100,
                legendValues: [
                    { value: '0', rgb: [0, 0, 255] },
                    { value: '100', rgb: [255, 0, 0] },
                ],
            })
            map.addLayer(vizLayer)

            const toggleBtn = pickerControl.element.querySelector(
                '.layer-picker-toggle'
            ) as HTMLButtonElement
            toggleBtn.click()
        })

        it('renders visualization layers with accessible settings gear and drawer', () => {
            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const headings = Array.from(
                panel.querySelectorAll('.layer-picker-heading')
            ).map(h => h.textContent)
            expect(headings).to.include('Visualizations')

            const gearBtn = panel.querySelector(
                '.layer-picker-settings-btn'
            ) as HTMLButtonElement
            expect(gearBtn).to.exist
            expect(gearBtn.getAttribute('aria-expanded')).to.equal('false')
            expect(gearBtn.getAttribute('aria-controls')).to.equal(
                'layer-settings-temp-anomaly'
            )
            expect(gearBtn.getAttribute('aria-label')).to.equal(
                'Adjust opacity for Temperature Anomaly'
            )

            const drawer = panel.querySelector(
                '#layer-settings-temp-anomaly'
            ) as HTMLElement
            expect(drawer).to.exist
            expect(drawer.hasAttribute('hidden')).to.be.true
            expect(drawer.getAttribute('aria-label')).to.equal(
                'Temperature Anomaly opacity'
            )

            // Click gear to open drawer
            gearBtn.click()
            expect(gearBtn.getAttribute('aria-expanded')).to.equal('true')
            const openedDrawer = panel.querySelector(
                '#layer-settings-temp-anomaly'
            ) as HTMLElement
            expect(openedDrawer.hasAttribute('hidden')).to.be.false
        })

        it('auto-enables layer and emits onLayerToggle when opening opacity drawer for an unchecked layer', () => {
            vizLayer.setVisible(false)
            onLayerToggle.resetHistory()

            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const gearBtn = panel.querySelector(
                '.layer-picker-settings-btn'
            ) as HTMLButtonElement

            gearBtn.click()

            expect(vizLayer.getVisible()).to.be.true
            expect(
                onLayerToggle.calledWithMatch({
                    name: 'temp-anomaly',
                    visible: true,
                    type: 'visualization',
                })
            ).to.be.true
        })

        it('updates opacity on input and announces aria-valuenow and aria-valuetext', () => {
            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const gearBtn = panel.querySelector(
                '.layer-picker-settings-btn'
            ) as HTMLButtonElement
            gearBtn.click()

            const slider = panel.querySelector(
                '#opacity-input-temp-anomaly'
            ) as HTMLInputElement
            expect(slider).to.exist
            expect(slider.getAttribute('aria-label')).to.equal(
                'Temperature Anomaly opacity'
            )
            expect(slider.getAttribute('aria-valuenow')).to.equal('100')
            expect(slider.getAttribute('aria-valuetext')).to.equal('100%')

            slider.value = '42'
            slider.dispatchEvent(new Event('input'))

            expect(vizLayer.getOpacity()).to.be.closeTo(0.42, 0.001)
            expect(slider.getAttribute('aria-valuenow')).to.equal('42')
            expect(slider.getAttribute('aria-valuetext')).to.equal('42%')

            const valueSpan = panel.querySelector('.layer-picker-opacity-value')
            expect(valueSpan?.textContent).to.equal('42%')
        })

        it('closes settings drawer and restores focus on Escape key', () => {
            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const gearBtn = panel.querySelector(
                '.layer-picker-settings-btn'
            ) as HTMLButtonElement
            gearBtn.click()

            const drawer = panel.querySelector(
                '#layer-settings-temp-anomaly'
            ) as HTMLElement
            drawer.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
            )

            const closedDrawer = panel.querySelector(
                '#layer-settings-temp-anomaly'
            ) as HTMLElement
            expect(closedDrawer.hasAttribute('hidden')).to.be.true
            expect(gearBtn.getAttribute('aria-expanded')).to.equal('false')
        })

        it('reacts to external layer opacity changes and updates slider value', () => {
            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const gearBtn = panel.querySelector(
                '.layer-picker-settings-btn'
            ) as HTMLButtonElement
            gearBtn.click()

            vizLayer.setOpacity(0.65)

            const slider = panel.querySelector(
                '#opacity-input-temp-anomaly'
            ) as HTMLInputElement
            expect(slider.value).to.equal('65')
            expect(slider.getAttribute('aria-valuenow')).to.equal('65')
            expect(slider.getAttribute('aria-valuetext')).to.equal('65%')
        })

        it('adjusts layer opacity via keyboard keys and prevents default/propagation so the map does not capture them', () => {
            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const gearBtn = panel.querySelector(
                '.layer-picker-settings-btn'
            ) as HTMLButtonElement
            gearBtn.click()

            const drawer = panel.querySelector(
                '#layer-settings-temp-anomaly'
            ) as HTMLElement
            const drawerKeydownSpy = sinon.spy()
            drawer.addEventListener('keydown', drawerKeydownSpy)

            const slider = panel.querySelector(
                '#opacity-input-temp-anomaly'
            ) as HTMLInputElement

            const dispatchKey = (key: string) => {
                const evt = new KeyboardEvent('keydown', {
                    key,
                    bubbles: true,
                    cancelable: true,
                })
                slider.dispatchEvent(evt)
                return evt
            }

            const leftEvt = dispatchKey('ArrowLeft')
            expect(leftEvt.defaultPrevented).to.be.true
            expect(drawerKeydownSpy.called).to.be.false
            expect(vizLayer.getOpacity()).to.equal(0.99)

            const pageDownEvt = dispatchKey('PageDown')
            expect(pageDownEvt.defaultPrevented).to.be.true
            expect(vizLayer.getOpacity()).to.equal(0.89)

            const rightEvt = dispatchKey('ArrowRight')
            expect(rightEvt.defaultPrevented).to.be.true
            expect(vizLayer.getOpacity()).to.equal(0.9)

            const homeEvt = dispatchKey('Home')
            expect(homeEvt.defaultPrevented).to.be.true
            expect(vizLayer.getOpacity()).to.equal(0)

            const pageUpEvt = dispatchKey('PageUp')
            expect(pageUpEvt.defaultPrevented).to.be.true
            expect(vizLayer.getOpacity()).to.equal(0.1)

            const endEvt = dispatchKey('End')
            expect(endEvt.defaultPrevented).to.be.true
            expect(vizLayer.getOpacity()).to.equal(1)
        })

        it('allows activating GeoTIFF legend bar via Enter key with onLegendClick callback', () => {
            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const legendBar = panel.querySelector(
                '.layer-picker-legend-bar'
            ) as HTMLElement
            expect(legendBar).to.exist
            expect(legendBar.getAttribute('role')).to.equal('button')
            expect(legendBar.getAttribute('tabindex')).to.equal('0')

            legendBar.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
            )
            expect(legendSpy.calledOnce).to.be.true
            const call = legendSpy.firstCall.args[0]
            expect(call.name).to.equal('temp-anomaly')
            expect(call.type).to.equal('visualization')
            expect(call.valueChosen).to.exist
        })

        it('extracts GIBS bin values and decodes entities in-memory via extractGibsBins', () => {
            const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg">
                <g id="tooltip_0"><!-- &lt; 200.00 K --></g>
                <g id="tooltip_1"><!-- 200.00 - 200.56 K --></g>
                <g id="tooltip_2"><text>200.56 - 201.12 K</text></g>
                <g id="tooltip_3"><!-- &#8805; 350.0 ppbv --></g>
            </svg>`
            const bins = extractGibsBins(rawSvg)
            expect(bins).to.deep.equal([
                '< 200.00 K',
                '200.00 - 200.56 K',
                '200.56 - 201.12 K',
                '≥ 350.0 ppbv',
            ])
        })

        it('extracts GIBS legend ramp bounds and bins via extractGibsLegendData', () => {
            const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 302.4 68.4">
                <image transform="scale(1 -1) translate(0 -13.68)" x="23.04" y="-23.76" width="257.04" height="13.68" />
                <g id="tooltip_0"><!-- 0.0 ppbv --></g>
                <g id="tooltip_1"><!-- &#8805; 350.0 ppbv --></g>
            </svg>`
            const data = extractGibsLegendData(rawSvg)
            expect(data.bins).to.deep.equal(['0.0 ppbv', '≥ 350.0 ppbv'])
            expect(data.rampStartPct).to.be.closeTo(23.04 / 302.4, 0.0001)
            expect(data.rampEndPct).to.be.closeTo(280.08 / 302.4, 0.0001)
            expect(data.rampTopPct).to.be.closeTo(23.76 / 68.4, 0.0001)
            expect(data.rampBottomPct).to.be.closeTo(37.44 / 68.4, 0.0001)
        })

        it('extracts multi-axis GIBS legend ramps, titles, and bins via extractGibsLegendData', () => {
            const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
                <g id="axes_1">
                    <image transform="scale(1 -1) translate(0 -20)" x="30" y="-30" width="240" height="20" />
                    <rect onmouseover="ShowTooltip(0)" />
                    <rect onmouseover="ShowTooltip(1)" />
                </g>
                <g id="axes_2">
                    <image transform="scale(1 -1) translate(0 -120)" x="30" y="-30" width="240" height="20" />
                    <rect onmouseover="ShowTooltip(2)" />
                    <rect onmouseover="ShowTooltip(3)" />
                </g>
                <g id="text_1"><g transform="translate(100 10)"><!-- Rain Rate --></g></g>
                <g id="text_2"><g transform="translate(100 110)"><!-- Snow Rate --></g></g>
                <g id="tooltip_0"><!-- 0.1 mm/hr --></g>
                <g id="tooltip_1"><!-- 5.0 mm/hr --></g>
                <g id="tooltip_2"><!-- 0.05 mm/hr --></g>
                <g id="tooltip_3"><!-- 2.5 mm/hr --></g>
            </svg>`
            const data = extractGibsLegendData(rawSvg)
            expect(data.ramps).to.have.lengthOf(2)
            expect(data.ramps[0].title).to.equal('Rain Rate')
            expect(data.ramps[0].bins).to.deep.equal(['0.1 mm/hr', '5.0 mm/hr'])
            expect(data.ramps[0].rampStartPct).to.equal(0.1)
            expect(data.ramps[0].rampEndPct).to.equal(0.9)

            expect(data.ramps[1].title).to.equal('Snow Rate')
            expect(data.ramps[1].bins).to.deep.equal(['0.05 mm/hr', '2.5 mm/hr'])
            expect(data.ramps[1].rampStartPct).to.equal(0.1)
            expect(data.ramps[1].rampEndPct).to.equal(0.9)
        })

        it('renders GIBS legend as a sandboxed img within an accessible single-tab-stop slider and emits onLegendClick on click', async () => {
            const gibsLayer = new VectorLayer({
                source: new VectorSource(),
                visible: true,
            })
            gibsLayer.set('name', 'modis-aod')
            gibsLayer.set('title', 'MODIS Aerosol Optical Depth')
            gibsLayer.set('type', 'visualization')
            gibsLayer.set('__gibsBins', ['0.0 ppbv', '100.0 ppbv', '200.0 ppbv'])
            gibsLayer.set(
                'legend',
                Promise.resolve({ horizontal: 'https://example.com/airs-temp.svg' })
            )
            map.addLayer(gibsLayer)

            await new Promise(r => setTimeout(r, 50))

            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const gibsLegend = panel.querySelector(
                '.layer-picker-legend-gibs'
            ) as HTMLElement
            expect(gibsLegend).to.exist
            expect(gibsLegend.getAttribute('role')).to.equal('slider')
            expect(gibsLegend.getAttribute('tabindex')).to.equal('0')
            expect(gibsLegend.getAttribute('aria-label')).to.equal(
                'MODIS Aerosol Optical Depth color map legend'
            )
            expect(gibsLegend.getAttribute('aria-valuenow')).to.equal('1')

            // Image is sandboxed by browser engine
            const img = gibsLegend.querySelector(
                '.layer-picker-legend-img'
            ) as HTMLImageElement
            expect(img).to.exist
            expect(img.src).to.equal('https://example.com/airs-temp.svg')
            expect(img.alt).to.equal('MODIS Aerosol Optical Depth color map legend')
            expect(img.loading).to.equal('lazy')

            // Clicking emits onLegendClick with value
            gibsLegend.dispatchEvent(new MouseEvent('click', { bubbles: true }))
            expect(legendSpy.calledOnce).to.be.true
            const call = legendSpy.firstCall.args[0]
            expect(call.name).to.equal('modis-aod')
            expect(call.title).to.equal('MODIS Aerosol Optical Depth')
            expect(call.type).to.equal('visualization')
            expect(call.valueChosen).to.exist
        })

        it('gracefully degrades GIBS legend to a static visual legend without slider role or tabindex when bins are absent', async () => {
            const gibsLayer = new VectorLayer({
                source: new VectorSource(),
                visible: true,
            })
            gibsLayer.set('name', 'modis-fallback')
            gibsLayer.set('title', 'MODIS Fallback Layer')
            gibsLayer.set('type', 'visualization')
            gibsLayer.set(
                'legend',
                Promise.resolve({ horizontal: 'https://example.com/fallback.svg' })
            )
            map.addLayer(gibsLayer)

            await new Promise(r => setTimeout(r, 50))

            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const gibsLegend = panel.querySelector(
                '.layer-picker-legend-static'
            ) as HTMLElement
            expect(gibsLegend).to.exist
            expect(gibsLegend.getAttribute('role')).to.be.null
            expect(gibsLegend.getAttribute('tabindex')).to.be.null
            expect(gibsLegend.classList.contains('layer-picker-legend-static')).to.be
                .true

            const img = gibsLegend.querySelector(
                '.layer-picker-legend-img'
            ) as HTMLImageElement
            expect(img).to.exist
            expect(img.src).to.equal('https://example.com/fallback.svg')
            expect(img.alt).to.equal('MODIS Fallback Layer color map legend')
            expect(img.loading).to.equal('lazy')

            expect(gibsLegend.querySelector('terra-popup')).to.be.null
        })

        it('supports keyboard slider navigation and popover on GIBS legend with bins', async () => {
            const gibsLayer = new VectorLayer({
                source: new VectorSource(),
                visible: true,
            })
            gibsLayer.set('name', 'modis-aod')
            gibsLayer.set('title', 'MODIS Aerosol Optical Depth')
            gibsLayer.set('type', 'visualization')
            gibsLayer.set('__gibsLegendUrl', 'https://example.com/legend.svg')
            gibsLayer.set('__gibsBins', ['< 0.1', '0.1 - 0.2', '0.2 - 0.3'])
            gibsLayer.set(
                'legend',
                Promise.resolve({ horizontal: 'https://example.com/legend.svg' })
            )
            map.addLayer(gibsLayer)

            await new Promise(r => setTimeout(r, 50))

            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const gibsLegend = panel.querySelector(
                '.layer-picker-legend-gibs'
            ) as HTMLElement
            expect(gibsLegend).to.exist
            expect(gibsLegend.getAttribute('aria-valuenow')).to.equal('1')
            expect(gibsLegend.getAttribute('aria-valuetext')).to.equal('0.1 - 0.2')

            // Focusin activates popover
            gibsLegend.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
            const popup = gibsLegend.querySelector('terra-popup') as any
            expect(popup).to.exist
            expect(popup.active).to.be.true
            expect(popup.textContent).to.include('0.1 - 0.2')

            // ArrowLeft decreases index
            const arrowLeftEvent = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
                bubbles: true,
                cancelable: true,
            })
            gibsLegend.dispatchEvent(arrowLeftEvent)
            expect(arrowLeftEvent.defaultPrevented).to.be.true
            expect(gibsLegend.getAttribute('aria-valuenow')).to.equal('0')
            expect(gibsLegend.getAttribute('aria-valuetext')).to.equal('< 0.1')
            expect(popup.textContent).to.include('< 0.1')

            // ArrowRight increases index
            const arrowRightEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                bubbles: true,
                cancelable: true,
            })
            gibsLegend.dispatchEvent(arrowRightEvent)
            expect(arrowRightEvent.defaultPrevented).to.be.true
            expect(gibsLegend.getAttribute('aria-valuenow')).to.equal('1')
            expect(gibsLegend.getAttribute('aria-valuetext')).to.equal('0.1 - 0.2')

            // Enter activates selection with exact scientific bin string
            gibsLegend.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true,
                    cancelable: true,
                })
            )
            expect(legendSpy.calledOnce).to.be.true
            expect(legendSpy.firstCall.args[0].valueChosen).to.equal('0.1 - 0.2')

            // Space activates selection
            gibsLegend.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: ' ',
                    bubbles: true,
                    cancelable: true,
                })
            )
            expect(legendSpy.calledTwice).to.be.true
            expect(legendSpy.secondCall.args[0].valueChosen).to.equal('0.1 - 0.2')
        })

        it('supports keyboard ArrowUp/ArrowDown scale switching and emits scale on Enter for multi-ramp GIBS legends', async () => {
            const gibsLayer = new VectorLayer({
                source: new VectorSource(),
                visible: true,
            })
            gibsLayer.set('name', 'precipitation')
            gibsLayer.set('title', 'Precipitation')
            gibsLayer.set('type', 'visualization')
            gibsLayer.set('__gibsLegendUrl', 'https://example.com/precip.svg')
            gibsLayer.set('__gibsRamps', [
                {
                    title: 'Rain Rate',
                    bins: ['0.1 mm/hr', '1.0 mm/hr', '10.0 mm/hr'],
                    rampStartPct: 0.1,
                    rampEndPct: 0.9,
                    rampTopPct: 0.1,
                    rampBottomPct: 0.4,
                },
                {
                    title: 'Snow Rate',
                    bins: ['0.01 mm/hr', '0.5 mm/hr', '5.0 mm/hr'],
                    rampStartPct: 0.1,
                    rampEndPct: 0.9,
                    rampTopPct: 0.6,
                    rampBottomPct: 0.9,
                },
            ])
            gibsLayer.set(
                'legend',
                Promise.resolve({ horizontal: 'https://example.com/precip.svg' })
            )
            map.addLayer(gibsLayer)

            await new Promise(r => setTimeout(r, 50))

            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const gibsLegend = panel.querySelector(
                '.layer-picker-legend-gibs'
            ) as HTMLElement
            expect(gibsLegend).to.exist

            // Focusin activates popover on initial scale (Rain Rate)
            gibsLegend.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
            const popup = pickerControl.element.querySelector(
                'terra-popup'
            ) as HTMLElement
            expect(popup).to.exist
            expect(popup.textContent).to.include('Rain Rate: 1.0 mm/hr')

            // ArrowRight advances bin on Rain Rate
            gibsLegend.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'ArrowRight',
                    bubbles: true,
                    cancelable: true,
                })
            )
            expect(popup.textContent).to.include('Rain Rate: 10.0 mm/hr')

            // ArrowDown switches scale to Snow Rate
            const arrowDown = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
                bubbles: true,
                cancelable: true,
            })
            gibsLegend.dispatchEvent(arrowDown)
            expect(arrowDown.defaultPrevented).to.be.true
            expect(popup.textContent).to.include('Snow Rate: 0.5 mm/hr')

            // Enter emits selection with Snow Rate scale
            gibsLegend.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true,
                    cancelable: true,
                })
            )
            expect(legendSpy.calledOnce).to.be.true
            expect(legendSpy.firstCall.args[0].scale).to.equal('Snow Rate')
            expect(legendSpy.firstCall.args[0].valueChosen).to.equal('0.5 mm/hr')

            // ArrowUp switches scale back to Rain Rate and restores its bin index
            const arrowUp = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
                bubbles: true,
                cancelable: true,
            })
            gibsLegend.dispatchEvent(arrowUp)
            expect(arrowUp.defaultPrevented).to.be.true
            expect(popup.textContent).to.include('Rain Rate: 10.0 mm/hr')

            // Space emits selection with Rain Rate scale
            gibsLegend.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: ' ',
                    bubbles: true,
                    cancelable: true,
                })
            )
            expect(legendSpy.calledTwice).to.be.true
            expect(legendSpy.secondCall.args[0].scale).to.equal('Rain Rate')
            expect(legendSpy.secondCall.args[0].valueChosen).to.equal('10.0 mm/hr')
        })

        it('handles special characters and quotes in layer names via CSS.escape() without throwing', async () => {
            const specialLayer = new VectorLayer({
                source: new VectorSource(),
                visible: true,
            })
            specialLayer.set('name', 'temperature "day" / 3km')
            specialLayer.set('title', 'Temperature "Day" (3km)')
            specialLayer.set('type', 'visualization')
            map.addLayer(specialLayer)

            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement

            const items = panel.querySelectorAll('.layer-picker-visualization-item')
            const specialItem = Array.from(items).find(
                el => el.getAttribute('data-layer-name') === 'temperature "day" / 3km'
            ) as HTMLElement
            expect(specialItem).to.exist

            // Click settings button to open drawer (tests CSS.escape(inputId))
            const settingsBtn = specialItem.querySelector(
                '.layer-picker-settings-btn'
            ) as HTMLButtonElement
            expect(settingsBtn).to.exist
            settingsBtn.click()

            await new Promise(r => setTimeout(r, 50))

            const drawer = specialItem.querySelector(
                '.layer-picker-settings-drawer'
            ) as HTMLElement
            expect(drawer).to.exist
            expect(drawer.hidden).to.be.false

            // Press Escape to close drawer (tests CSS.escape(drawerId))
            drawer.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
            )
            expect(drawer.hidden).to.be.true

            // Keyboard navigation on drag handle (tests CSS.escape(name))
            const handle = specialItem.querySelector(
                '.layer-picker-drag-handle'
            ) as HTMLButtonElement
            expect(handle).to.exist
            handle.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
            )
            await new Promise(r => setTimeout(r, 50))
        })

        it('prefetches GIBS legend on pointerenter or focusin over layer-picker-viz-header', async () => {
            const hiddenGibsLayer = new VectorLayer({
                source: new VectorSource(),
                visible: false,
            })
            hiddenGibsLayer.set('name', 'hidden-gibs')
            hiddenGibsLayer.set('title', 'Hidden GIBS')
            hiddenGibsLayer.set('type', 'visualization')
            hiddenGibsLayer.set(
                'legend',
                Promise.resolve({ horizontal: 'https://example.com/hidden.svg' })
            )

            const ctrl = new LayerPickerControl({
                showLayerPicker: true,
            })
            const localMap = new OlMap({
                target: mapTarget,
                layers: [hiddenGibsLayer],
                controls: [ctrl],
            })

            const toggle = ctrl.element.querySelector(
                '.layer-picker-toggle'
            ) as HTMLButtonElement
            toggle.click()

            const header = ctrl.element.querySelector(
                '.layer-picker-viz-header'
            ) as HTMLElement
            expect(header).to.exist
            expect(hiddenGibsLayer.get('__gibsLegendUrl')).to.be.undefined

            header.dispatchEvent(new Event('pointerenter', { bubbles: false }))
            await new Promise(r => setTimeout(r, 50))

            expect(hiddenGibsLayer.get('__gibsLegendUrl')).to.equal(
                'https://example.com/hidden.svg'
            )

            localMap.setTarget(undefined)
        })

        it('renders a skeleton placeholder while GIBS legend is loading', () => {
            const pendingGibsLayer = new VectorLayer({
                source: new VectorSource(),
                visible: true,
            })
            pendingGibsLayer.set('name', 'pending-gibs')
            pendingGibsLayer.set('title', 'Pending GIBS Layer')
            pendingGibsLayer.set('type', 'visualization')
            pendingGibsLayer.set('legend', new Promise(() => {}))

            map.addLayer(pendingGibsLayer)

            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const skeleton = panel.querySelector(
                '.layer-picker-legend-skeleton'
            ) as HTMLElement
            expect(skeleton).to.exist
            expect(skeleton.getAttribute('role')).to.equal('status')
            expect(skeleton.getAttribute('aria-label')).to.equal(
                'Loading Pending GIBS Layer color map legend'
            )
            expect(skeleton.querySelector('terra-skeleton')).to.exist
        })

        it('renders accessible drag handle and supports keyboard layer reordering', () => {
            const reorderSpy = sinon.spy()
            pickerControl.setOptions({ onLayerOrderChange: reorderSpy })

            // Add a second visualization layer
            const secondViz = new TileLayer({ visible: true })
            secondViz.set('name', 'second-viz')
            secondViz.set('title', 'Second Visualization')
            secondViz.set('type', 'visualization')
            map.addLayer(secondViz)

            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement

            const items = panel.querySelectorAll('.layer-picker-visualization-item')
            expect(items.length).to.equal(2)

            // Because the list is presented in topmost-rendered-first order (.toReversed()),
            // items[0] is second-viz (top of render stack) and items[1] is temp-anomaly.
            expect(items[0].getAttribute('data-layer-name')).to.equal('second-viz')
            expect(items[1].getAttribute('data-layer-name')).to.equal('temp-anomaly')

            const handle = items[0].querySelector(
                '.layer-picker-drag-handle'
            ) as HTMLButtonElement
            expect(handle).to.exist
            expect(handle.getAttribute('draggable')).to.equal('true')
            expect(handle.getAttribute('aria-roledescription')).to.equal(
                'sortable layer'
            )
            expect(handle.getAttribute('title')).to.include(
                'Reorder Second Visualization (Layer 1 of 2)'
            )
            expect(handle.getAttribute('aria-label')).to.include('Layer 1 of 2')
            expect(handle.getAttribute('aria-label')).to.include(
                'Press Up Arrow to move up, Down Arrow to move down'
            )

            // Press ArrowDown on the second-viz handle (top item) to move it down visually
            handle.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
            )

            expect(reorderSpy.calledOnce).to.be.true
            // Names emitted are bottom-to-top matching the map render stack order
            expect(reorderSpy.firstCall.args[0].names).to.deep.equal([
                'second-viz',
                'temp-anomaly',
            ])

            // Status message announced for screen readers
            const statusEl = panel.querySelector('.sr-only[role="status"]')
            expect(statusEl?.textContent).to.include(
                'Moved Second Visualization to layer 2 of 2'
            )

            // Verify DOM order updated: temp-anomaly is now top, second-viz is bottom
            const reorderedItems = panel.querySelectorAll(
                '.layer-picker-visualization-item'
            )
            expect(reorderedItems[0].getAttribute('data-layer-name')).to.equal(
                'temp-anomaly'
            )
            expect(reorderedItems[1].getAttribute('data-layer-name')).to.equal(
                'second-viz'
            )

            // Press ArrowUp on second-viz handle to move it back up
            const secondVizHandle = reorderedItems[1].querySelector(
                '.layer-picker-drag-handle'
            ) as HTMLButtonElement
            expect(secondVizHandle.getAttribute('aria-label')).to.include(
                'Layer 2 of 2'
            )
            secondVizHandle.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
            )

            expect(reorderSpy.calledTwice).to.be.true
            expect(reorderSpy.secondCall.args[0].names).to.deep.equal([
                'temp-anomaly',
                'second-viz',
            ])
            expect(statusEl?.textContent).to.include(
                'Moved Second Visualization to layer 1 of 2'
            )
        })

        it('stops propagation of wheel events on the panel so map does not scroll/zoom', () => {
            const element = pickerControl.element
            const panel = element.querySelector('.layer-picker-panel') as HTMLElement
            const wheelEvent = new WheelEvent('wheel', {
                bubbles: true,
                cancelable: true,
            })
            const stopPropagationSpy = sinon.spy(wheelEvent, 'stopPropagation')

            panel.dispatchEvent(wheelEvent)

            expect(stopPropagationSpy.calledOnce).to.be.true
        })

        it('stops propagation of keydown events on the panel and supports arrow-key selection on Base Maps radio buttons', () => {
            const toggleSpy = sinon.spy()
            pickerControl.setOptions({ onLayerToggle: toggleSpy })

            const element = pickerControl.element
            const panel = element.querySelector('.layer-picker-panel') as HTMLElement
            const toggleBtn = element.querySelector(
                '.layer-picker-toggle'
            ) as HTMLButtonElement

            // Ensure the panel is open (beforeEach in this suite already opens it)
            if (!panel.classList.contains('open')) {
                toggleBtn.click()
            }
            expect(panel.classList.contains('open')).to.be.true

            // Any keydown inside the panel should not bubble up to pickerControl.element / map viewport
            const elementKeydownSpy = sinon.spy()
            element.addEventListener('keydown', elementKeydownSpy)

            const radios = panel.querySelectorAll<HTMLInputElement>(
                'input[name="terra-map-base-layer"]'
            )
            expect(radios.length).to.equal(2)
            expect(worldImagery.getVisible()).to.be.true
            expect(osmLayer.getVisible()).to.be.false

            // ArrowDown on first radio selects second base layer, prevents default, and stops propagation
            const arrowDown = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
                bubbles: true,
                cancelable: true,
            })
            radios[0].dispatchEvent(arrowDown)

            expect(arrowDown.defaultPrevented).to.be.true
            expect(elementKeydownSpy.called).to.be.false
            expect(worldImagery.getVisible()).to.be.false
            expect(osmLayer.getVisible()).to.be.true
            expect(toggleSpy.calledOnce).to.be.true
            expect(toggleSpy.firstCall.args[0].name).to.equal('osm')
            expect(toggleSpy.firstCall.args[0].visible).to.be.true

            // Re-query radios after panel render and verify focus moved to second radio
            const updatedRadios = panel.querySelectorAll<HTMLInputElement>(
                'input[name="terra-map-base-layer"]'
            )
            expect(document.activeElement).to.equal(updatedRadios[1])

            // ArrowUp on second radio wraps back to first base layer
            const arrowUp = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
                bubbles: true,
                cancelable: true,
            })
            updatedRadios[1].dispatchEvent(arrowUp)

            expect(arrowUp.defaultPrevented).to.be.true
            expect(elementKeydownSpy.called).to.be.false
            expect(worldImagery.getVisible()).to.be.true
            expect(osmLayer.getVisible()).to.be.false
            expect(toggleSpy.calledTwice).to.be.true
            expect(toggleSpy.secondCall.args[0].name).to.equal('base')

            // Escape on the panel closes the popover and returns focus to toggleBtn
            const escapeEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true,
                cancelable: true,
            })
            panel.dispatchEvent(escapeEvent)
            expect(escapeEvent.defaultPrevented).to.be.true
            expect(panel.classList.contains('open')).to.be.false
            expect(document.activeElement).to.equal(toggleBtn)

            element.removeEventListener('keydown', elementKeydownSpy)
        })

        it('keeps the panel wide (has-legends) when all visualization layers with colormap legends are unchecked', () => {
            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement

            // Initially vizLayer is visible and has a colormap legend
            expect(vizLayer.getVisible()).to.be.true
            expect(panel.classList.contains('has-legends')).to.be.true
            expect(panel.querySelector('.layer-picker-legend')).to.exist

            // Uncheck the visualization layer so no .layer-picker-legend is rendered
            const vizCheckbox = panel.querySelector(
                '.layer-picker-visualization-item input[type="checkbox"]'
            ) as HTMLInputElement
            vizCheckbox.checked = false
            vizCheckbox.dispatchEvent(new Event('change'))

            expect(vizLayer.getVisible()).to.be.false
            expect(panel.querySelector('.layer-picker-legend')).to.be.null
            expect(panel.classList.contains('has-legends')).to.be.true
        })

        it('scrolls to the first selected layer upon opening the panel and re-scrolls on legend image load', async () => {
            const element = pickerControl.element
            const panel = element.querySelector('.layer-picker-panel') as HTMLElement

            const layer1 = new VectorLayer({
                source: new VectorSource(),
                visible: false,
            })
            layer1.set('name', 'l1')
            layer1.set('title', 'Layer 1')
            layer1.set('type', 'visualization')
            map.addLayer(layer1)

            const layer2 = new VectorLayer({
                source: new VectorSource(),
                visible: true,
            })
            layer2.set('name', 'l2')
            layer2.set('title', 'Layer 2')
            layer2.set('type', 'visualization')
            layer2.set('__gibsLegendUrl', 'https://example.com/airs-temp.svg')
            layer2.set(
                'legend',
                Promise.resolve({ horizontal: 'https://example.com/airs-temp.svg' })
            )
            map.addLayer(layer2)

            const toggleBtn = element.querySelector(
                '.layer-picker-toggle'
            ) as HTMLButtonElement
            toggleBtn.click()

            await new Promise(r => setTimeout(r, 50))

            const selectedCard = panel.querySelector(
                '[data-layer-name="l2"]'
            ) as HTMLElement
            expect(selectedCard).to.exist

            const img = selectedCard.querySelector(
                '.layer-picker-legend-img'
            ) as HTMLImageElement
            expect(img).to.exist
            expect(img.getAttribute('loading')).to.equal('lazy')

            // Dispatch load to exercise @load handler without throwing
            img.dispatchEvent(new Event('load'))
            await new Promise(r => setTimeout(r, 50))
            expect(selectedCard.isConnected).to.be.true
        })
    })
})
