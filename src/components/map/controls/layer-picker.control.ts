import type { Map as OlMap } from 'ol'
import type { CollectionEvent } from 'ol/Collection.js'
import { Control } from 'ol/control.js'
import type BaseLayer from 'ol/layer/Base.js'
import type { MapLayerToggleDetail } from '../type.js'

export type LayerPickerControlOptions = {
    showLayerPicker?: boolean
    onLayerToggle?: (detail: MapLayerToggleDetail) => void
    target?: HTMLElement | string
}

const LAYERS_ICON = `<svg viewBox="0 0 30 30" width="18" height="18" fill="currentColor" aria-hidden="true">
  <path d="M 15,4 27,10.5 15,17 3,10.5 Z" />
  <path d="M 5.4,14.8 15,20 24.6,14.8 27,16.1 15,22.6 3,16.1 Z" />
  <path d="M 5.4,19.2 15,24.4 24.6,19.2 27,20.5 15,27 3,20.5 Z" />
</svg>`

export class LayerPickerControl extends Control {
    public declare element: HTMLElement

    #options?: LayerPickerControlOptions
    #toggleBtn: HTMLButtonElement
    #panel: HTMLElement
    #isOpen: boolean = false
    #documentClickHandler: (event: MouseEvent) => void

    constructor(options?: LayerPickerControlOptions) {
        const element = document.createElement('div')
        element.className = 'layer-picker-control ol-unselectable ol-control'

        super({ element, target: options?.target })

        this.#options = options

        const toggleBtn = document.createElement('button')
        toggleBtn.type = 'button'
        toggleBtn.className = 'layer-picker-toggle'
        toggleBtn.innerHTML = LAYERS_ICON
        toggleBtn.title = 'Choose layers'
        toggleBtn.setAttribute('aria-label', 'Choose layers')
        toggleBtn.setAttribute('aria-expanded', 'false')
        toggleBtn.setAttribute('aria-haspopup', 'true')
        toggleBtn.style.display = 'none'

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            this.#togglePanel()
        })
        element.appendChild(toggleBtn)

        const panel = document.createElement('div')
        panel.className = 'layer-picker-panel'
        panel.addEventListener('click', (e) => e.stopPropagation())
        element.appendChild(panel)

        this.#toggleBtn = toggleBtn
        this.#panel = panel

        this.toggleVisibility()

        this.#documentClickHandler = (event: MouseEvent) => {
            if (this.#isOpen && !event.composedPath().includes(element)) {
                this.#togglePanel(false)
            }
        }
        document.addEventListener('click', this.#documentClickHandler)
    }

    setMap(map: OlMap | null) {
        super.setMap(map)

        // clean up old renders
        if (!map) {
            document.removeEventListener('click', this.#documentClickHandler)

            return
        }

        if (map) {
            const layers = map.getLayers()
            layers.forEach((layer: BaseLayer) => {
                this.#watchLayer(layer)
            })
            layers.on('add', (e: CollectionEvent<BaseLayer>) => {
                this.#watchLayer(e.element)
                this.#renderPanel()
            })
            layers.on('remove', () => {
                this.#renderPanel()
            })

            map.on('click', () => {
                if (this.#isOpen) {
                    this.#togglePanel(false)
                }
            })

            this.#renderPanel()
        }
    }

    #watchLayer(layer: BaseLayer) {
        layer.on('change:visible', () => this.#renderPanel())
    }

    setOptions(options: Partial<LayerPickerControlOptions>) {
        this.#options = { ...this.#options, ...options }
        this.toggleVisibility()
    }

    toggleVisibility() {
        const show = this.#options?.showLayerPicker ?? false

        if (this.#toggleBtn) {
            this.#toggleBtn.style.display = show ? 'flex' : 'none'
        }
        if (this.element) {
            this.element.style.display = show ? '' : 'none'
        }

        if (!show && this.#isOpen) {
            this.#togglePanel(false)
        }
    }

    #togglePanel(force?: boolean) {
        this.#isOpen = force ?? !this.#isOpen
        this.#panel.classList.toggle('open', this.#isOpen)
        this.#toggleBtn.classList.toggle('active', this.#isOpen)
        this.#toggleBtn.setAttribute('aria-expanded', String(this.#isOpen))

        if (this.#isOpen) {
            this.#renderPanel()
        }
    }

    #renderPanel() {
        const map = this.getMap()

        if (!map || !this.#panel) {
            return
        }

        this.#panel.innerHTML = ''

        const titledLayers = map
            .getLayers()
            .getArray()
            .filter((layer: BaseLayer) => Boolean(layer.get('title')))

        const baseLayers = titledLayers.filter(
            (layer: BaseLayer) => layer.get('type') === 'base',
        )
        // Reverse overlays so topmost rendered layer appears at the top of the list
        const overlayLayers = titledLayers
            .filter((layer: BaseLayer) => layer.get('type') !== 'base')
            .slice()
            .reverse()

        if (baseLayers.length > 0) {
            const section = this.#buildSection('Base Maps', baseLayers, 'base')
            this.#panel.appendChild(section)
        }

        if (overlayLayers.length > 0) {
            const section = this.#buildSection(
                'Overlays',
                overlayLayers,
                'overlay',
            )
            this.#panel.appendChild(section)
        }
    }

    #buildSection(
        heading: string,
        layers: BaseLayer[],
        type: 'base' | 'overlay',
    ) {
        const section = document.createElement('div')
        section.className = 'layer-picker-section'

        const titleEl = document.createElement('div')
        titleEl.className = 'layer-picker-heading'
        titleEl.textContent = heading
        section.appendChild(titleEl)

        layers.forEach((layer) => {
            const label = document.createElement('label')
            label.className = 'layer-picker-item'

            const input = document.createElement('input')
            input.type = type === 'base' ? 'radio' : 'checkbox'

            if (type === 'base') {
                input.name = 'terra-map-base-layer'
            }

            input.checked = layer.getVisible()

            input.addEventListener('change', () => {
                if (type === 'base') {
                    layers.forEach((bLayer) => {
                        bLayer.setVisible(bLayer === layer)
                    })
                } else {
                    layer.setVisible(input.checked)
                }

                this.#options?.onLayerToggle?.({
                    name: layer.get('name') ?? '',
                    title: layer.get('title') ?? '',
                    type,
                    visible: layer.getVisible(),
                    layer,
                })
            })

            const span = document.createElement('span')
            span.textContent = layer.get('title')

            label.appendChild(input)
            label.appendChild(span)
            section.appendChild(label)
        })

        return section
    }
}
