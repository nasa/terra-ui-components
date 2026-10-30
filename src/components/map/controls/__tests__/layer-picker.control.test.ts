import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { Map as OlMap, View } from 'ol'
import TileLayer from 'ol/layer/Tile.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import { LayerPickerControl, prepareGibsSvg } from '../layer-picker.control.js'

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

        it('sanitizes GIBS SVG via prepareGibsSvg, enhances bins with data-value, and only emits onLegendClick on bin click', () => {
            const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg">
                <script>alert('xss')</script>
                <g id="figure_1">
                    <g id="tooltip_0" visibility="hidden"><!-- 0.1 - 0.2 --><text>0.1 - 0.2</text></g>
                    <rect onmouseover="ShowTooltip(0)" onmouseout="HideTooltip(0)" width="10" height="10"/>
                    <text class="axis-label">AOD</text>
                </g>
            </svg>`
            const preparedSvg = prepareGibsSvg(rawSvg)

            const gibsLayer = new VectorLayer({
                source: new VectorSource(),
                visible: true,
            })
            gibsLayer.set('name', 'modis-aod')
            gibsLayer.set('title', 'MODIS Aerosol Optical Depth')
            gibsLayer.set('type', 'visualization')
            gibsLayer.set('legend', Promise.resolve({ horizontal: 'dummy.svg' }))
            gibsLayer.set('__gibsLegendSvg', preparedSvg)
            map.addLayer(gibsLayer)

            const panel = pickerControl.element.querySelector(
                '.layer-picker-panel'
            ) as HTMLElement
            const gibsLegend = panel.querySelector(
                '.layer-picker-legend-gibs'
            ) as HTMLElement
            expect(gibsLegend).to.exist
            expect(gibsLegend.getAttribute('role')).to.equal('figure')
            expect(gibsLegend.querySelector('script')).to.not.exist

            const rect = gibsLegend.querySelector('rect') as SVGElement
            expect(rect.getAttribute('onmouseover')).to.be.null
            expect(rect.getAttribute('onmouseout')).to.be.null
            expect(rect.getAttribute('data-tooltip-idx')).to.equal('0')
            expect(rect.getAttribute('data-value')).to.equal('0.1 - 0.2')
            expect(rect.getAttribute('title')).to.equal('0.1 - 0.2')
            expect(rect.getAttribute('aria-label')).to.equal('0.1 - 0.2')
            expect(rect.hasAttribute('tabindex')).to.be.false

            // Clicking non-bin element inside legend does not emit onLegendClick
            const axisLabel = gibsLegend.querySelector('.axis-label') as SVGElement
            axisLabel.dispatchEvent(new MouseEvent('click', { bubbles: true }))
            expect(legendSpy.called).to.be.false

            // Clicking bin emits onLegendClick with valueChosen
            rect.dispatchEvent(new MouseEvent('click', { bubbles: true }))
            expect(legendSpy.calledOnce).to.be.true
            expect(legendSpy.firstCall.args[0].valueChosen).to.equal('0.1 - 0.2')
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

            const handle = items[0].querySelector(
                '.layer-picker-drag-handle'
            ) as HTMLButtonElement
            expect(handle).to.exist
            expect(handle.getAttribute('draggable')).to.equal('true')
            expect(handle.getAttribute('aria-roledescription')).to.equal(
                'sortable layer'
            )
            expect(handle.getAttribute('title')).to.include('Drag to reorder')

            // Press ArrowDown on the first layer handle to move it below
            handle.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
            )

            expect(reorderSpy.calledOnce).to.be.true
            expect(reorderSpy.firstCall.args[0].names).to.deep.equal([
                'second-viz',
                'temp-anomaly',
            ])

            // Verify DOM order updated
            const reorderedItems = panel.querySelectorAll(
                '.layer-picker-visualization-item'
            )
            expect(reorderedItems[0].getAttribute('data-layer-name')).to.equal(
                'second-viz'
            )
            expect(reorderedItems[1].getAttribute('data-layer-name')).to.equal(
                'temp-anomaly'
            )

            // Press ArrowUp on temp-anomaly handle to move it back up
            const tempAnomalyHandle = reorderedItems[1].querySelector(
                '.layer-picker-drag-handle'
            ) as HTMLButtonElement
            tempAnomalyHandle.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
            )

            expect(reorderSpy.calledTwice).to.be.true
            expect(reorderSpy.secondCall.args[0].names).to.deep.equal([
                'temp-anomaly',
                'second-viz',
            ])
        })
    })
})
