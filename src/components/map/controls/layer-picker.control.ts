import { html, nothing, render } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import type { Map as OlMap } from 'ol'
import type { CollectionEvent } from 'ol/Collection.js'
import { Control } from 'ol/control.js'
import type BaseLayer from 'ol/layer/Base.js'
import gibsApi from '../../../apis/gibs.api.js'
import type { MapLayerToggleDetail, MapLegendClickDetail } from '../type.js'

export type LayerPickerControlOptions = {
    showLayerPicker?: boolean
    onLayerToggle?: (detail: MapLayerToggleDetail) => void
    onLegendClick?: (detail: MapLegendClickDetail) => void
    onLayerOrderChange?: (detail: { names: string[] }) => void
    fetchLegendSvg?: (url: string) => Promise<string | null>
    target?: HTMLElement | string
}

const LAYERS_ICON = `<svg viewBox="0 0 30 30" width="18" height="18" fill="currentColor" aria-hidden="true">
  <path d="M 15,4 27,10.5 15,17 3,10.5 Z" />
  <path d="M 5.4,14.8 15,20 24.6,14.8 27,16.1 15,22.6 3,16.1 Z" />
  <path d="M 5.4,19.2 15,24.4 24.6,19.2 27,20.5 15,27 3,20.5 Z" />
</svg>`

const ELLIPSIS_ICON_SVG = html`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
</svg>`

const ARROWS_UP_DOWN_ICON_SVG = html`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"/>
</svg>`

function decodeXmlEntities(str: string): string {
    const doc = new DOMParser().parseFromString(str, 'text/html')
    return doc.body.textContent ?? str
}

export type GibsRamp = {
    title?: string
    bins: string[]
    rampStartPct: number
    rampEndPct: number
    rampTopPct: number
    rampBottomPct: number
}

export type GibsLegendData = {
    ramps: GibsRamp[]
    bins: string[]
    rampStartPct: number
    rampEndPct: number
    rampTopPct: number
    rampBottomPct: number
}

function parseTransformedY(
    el: Element,
    viewBoxHeight: number
): { topPct: number; bottomPct: number } {
    const rawY = Number(el.getAttribute('y')) || 0
    const rawH = Number(el.getAttribute('height')) || 0
    const transform = el.getAttribute('transform') || ''

    const scaleMatch = transform.match(
        /scale\s*\(\s*([-\d.]+)(?:[\s,]+([-\d.]+))?\s*\)/
    )
    const transMatch = transform.match(
        /translate\s*\(\s*([-\d.]+)(?:[\s,]+([-\d.]+))?\s*\)/
    )

    let y1 = rawY
    let y2 = rawY + rawH
    if (transMatch) {
        const ty = Number(transMatch[2]) || 0
        y1 += ty
        y2 += ty
    }
    if (scaleMatch) {
        const sy = Number(scaleMatch[2] ?? scaleMatch[1]) || 1
        y1 *= sy
        y2 *= sy
    }
    const top = Math.min(y1, y2)
    const bottom = Math.max(y1, y2)
    return {
        topPct: Math.max(0, Math.min(1, top / viewBoxHeight)),
        bottomPct: Math.max(0, Math.min(1, bottom / viewBoxHeight)),
    }
}

function findCommentText(node: Node): string {
    for (const child of node.childNodes) {
        if (child.nodeType === 8 && child.textContent?.trim()) {
            return child.textContent.trim()
        }
        const found = findCommentText(child)
        if (found) {
            return found
        }
    }
    return ''
}

function extractCandidateTitles(doc: Document): Array<{ text: string; y: number }> {
    const candidateTitles: Array<{ text: string; y: number }> = []
    doc.querySelectorAll('g[id^="text_"]').forEach(el => {
        let text = findCommentText(el)
        if (!text) {
            const textEl = el.querySelector('text')
            text = textEl?.textContent?.trim() ?? el.textContent?.trim() ?? ''
        }
        if (text) {
            const decoded = decodeXmlEntities(text)
            // Exclude numeric ticks and common unit strings
            const isTick = /^[\d.\s&#;≥\-><+%/]+$/.test(decoded)
            const isCommonUnit = /^(mm\/hr|K|%|degC|m|m\/s|hPa|kg\/m\^2)$/i.test(
                decoded
            )
            if (!isTick && !isCommonUnit) {
                const transform =
                    el.getAttribute('transform') ??
                    el.querySelector('g')?.getAttribute('transform') ??
                    el.parentElement?.getAttribute('transform') ??
                    ''
                const transMatch = transform.match(
                    /translate\s*\(\s*([-\d.]+)(?:[\s,]+([-\d.]+))?\s*\)/
                )
                const y = transMatch ? Number(transMatch[2]) || 0 : 0
                candidateTitles.push({ text: decoded, y })
            }
        }
    })
    return candidateTitles
}

/**
 * Extracts raw scientific bin values and horizontal ramp boundaries from NASA GIBS SVGs.
 * Supports multi-axis SVGs (such as GPM IMERG Precipitation Rate with Rain Rate & Snow Rate).
 *
 * GIBS Matplotlib SVGs store colormap bin ranges in hidden `<g id="tooltip_i">` groups
 * and place the color gradient inside embedded `<image>` or `<rect>` strips inset
 * from the SVG's viewBox edges by left/right tick label margins.
 * This parser operates purely in-memory and never injects or executes the SVG in the DOM.
 */
export function extractGibsLegendData(rawSvg: string): GibsLegendData {
    const defaultRamp: GibsRamp = {
        bins: [],
        rampStartPct: 0,
        rampEndPct: 1,
        rampTopPct: 0.3474,
        rampBottomPct: 0.5474,
    }

    let doc: Document
    try {
        doc = new DOMParser().parseFromString(rawSvg, 'image/svg+xml')
        if (doc.querySelector('parsererror')) {
            return {
                ramps: [defaultRamp],
                ...defaultRamp,
            }
        }
    } catch {
        return {
            ramps: [defaultRamp],
            ...defaultRamp,
        }
    }

    const viewBoxAttr = doc.querySelector('svg')?.getAttribute('viewBox')
    let viewBoxWidth = 0
    let viewBoxHeight = 0
    if (viewBoxAttr) {
        const parts = viewBoxAttr
            .trim()
            .split(/[\s,]+/)
            .map(Number)
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            viewBoxWidth = parts[2]
            viewBoxHeight = parts[3]
        }
    }

    const allTips: string[] = []
    let idx = 0
    while (true) {
        const tooltip = doc.getElementById(`tooltip_${idx}`)
        if (!tooltip) {
            break
        }

        let val: string | undefined
        for (const node of tooltip.childNodes) {
            if (node.nodeType === 8) {
                const text = node.textContent?.trim()
                if (text) {
                    val = text
                    break
                }
            }
        }
        if (!val) {
            const textEl = tooltip.querySelector('text')
            if (textEl?.textContent?.trim()) {
                val = textEl.textContent.trim()
            }
        }
        if (val) {
            allTips.push(decodeXmlEntities(val))
        }
        idx++
    }

    // Fallback for standard SVGs with <rect><title> elements
    if (allTips.length === 0) {
        doc.querySelectorAll('rect').forEach(rect => {
            const title =
                rect.querySelector('title')?.textContent?.trim() ??
                rect.getAttribute('title')
            if (title) {
                allTips.push(decodeXmlEntities(title))
            }
        })
    }

    const candidateTitles = extractCandidateTitles(doc)
    const axes = Array.from(doc.querySelectorAll('g[id^="axes_"]'))
    const ramps: GibsRamp[] = []

    if (axes.length > 0) {
        axes.forEach((axis, axisIdx) => {
            const img = axis.querySelector('image')
            const rects = Array.from(axis.querySelectorAll('rect[onmouseover]'))
            let rampStartPct = 0
            let rampEndPct = 1
            let rampTopPct = 0.3474
            let rampBottomPct = 0.5474

            if (img && viewBoxWidth > 0 && viewBoxHeight > 0) {
                const x = Number(img.getAttribute('x')) || 0
                const width = Number(img.getAttribute('width')) || 0
                if (width > 0) {
                    rampStartPct = Math.max(0, Math.min(1, x / viewBoxWidth))
                    rampEndPct = Math.max(
                        rampStartPct,
                        Math.min(1, (x + width) / viewBoxWidth)
                    )
                }
                const yBounds = parseTransformedY(img, viewBoxHeight)
                rampTopPct = yBounds.topPct
                rampBottomPct = yBounds.bottomPct
            } else if (rects.length > 0 && viewBoxWidth > 0 && viewBoxHeight > 0) {
                const first = rects[0]
                const last = rects[rects.length - 1]
                const firstX = Number(first.getAttribute('x')) || 0
                const lastX = Number(last.getAttribute('x')) || 0
                const lastWidth = Number(last.getAttribute('width')) || 0
                rampStartPct = Math.max(0, Math.min(1, firstX / viewBoxWidth))
                rampEndPct = Math.max(
                    rampStartPct,
                    Math.min(1, (lastX + lastWidth) / viewBoxWidth)
                )
                const yBounds = parseTransformedY(first, viewBoxHeight)
                rampTopPct = yBounds.topPct
                rampBottomPct = yBounds.bottomPct
            }

            const bins: string[] = []
            rects.forEach(rect => {
                const match = rect
                    .getAttribute('onmouseover')
                    ?.match(/ShowTooltip\((\d+)\)/)
                if (match) {
                    const tipIdx = Number(match[1])
                    if (allTips[tipIdx]) {
                        bins.push(allTips[tipIdx])
                    }
                }
            })

            let finalBins = bins
            if (finalBins.length === 0) {
                if (axes.length > 1 && allTips.length > 0) {
                    const sliceSize = Math.floor(allTips.length / axes.length)
                    const start = axisIdx * sliceSize
                    const end =
                        axisIdx === axes.length - 1
                            ? allTips.length
                            : start + sliceSize
                    finalBins = allTips.slice(start, end)
                } else {
                    finalBins = allTips
                }
            }

            const rampY = rampTopPct * viewBoxHeight
            let bestTitle: string | undefined
            let bestDist = Infinity
            candidateTitles.forEach(c => {
                const dist = Math.abs(c.y - rampY)
                if (dist < bestDist) {
                    bestDist = dist
                    bestTitle = c.text
                }
            })

            ramps.push({
                title: bestTitle,
                bins: finalBins,
                rampStartPct,
                rampEndPct,
                rampTopPct,
                rampBottomPct,
            })
        })
    } else {
        const images = Array.from(doc.querySelectorAll('image'))
        if (images.length > 1 && viewBoxWidth > 0 && viewBoxHeight > 0) {
            images.forEach((img, imgIdx) => {
                const x = Number(img.getAttribute('x')) || 0
                const width = Number(img.getAttribute('width')) || 0
                let rampStartPct = 0
                let rampEndPct = 1
                if (width > 0) {
                    rampStartPct = Math.max(0, Math.min(1, x / viewBoxWidth))
                    rampEndPct = Math.max(
                        rampStartPct,
                        Math.min(1, (x + width) / viewBoxWidth)
                    )
                }
                const yBounds = parseTransformedY(img, viewBoxHeight)
                const sliceSize = Math.floor(allTips.length / images.length)
                const start = imgIdx * sliceSize
                const end =
                    imgIdx === images.length - 1 ? allTips.length : start + sliceSize
                const bins = allTips.slice(start, end)

                const rampY = yBounds.topPct * viewBoxHeight
                let bestTitle: string | undefined
                let bestDist = Infinity
                candidateTitles.forEach(c => {
                    const dist = Math.abs(c.y - rampY)
                    if (dist < bestDist) {
                        bestDist = dist
                        bestTitle = c.text
                    }
                })

                ramps.push({
                    title: bestTitle,
                    bins,
                    rampStartPct,
                    rampEndPct,
                    rampTopPct: yBounds.topPct,
                    rampBottomPct: yBounds.bottomPct,
                })
            })
        } else {
            let rampStartPct = 0
            let rampEndPct = 1
            let rampTopPct = 0.3474
            let rampBottomPct = 0.5474

            const img = doc.querySelector('image')
            if (img && viewBoxWidth > 0 && viewBoxHeight > 0) {
                const x = Number(img.getAttribute('x')) || 0
                const width = Number(img.getAttribute('width')) || 0
                if (width > 0) {
                    rampStartPct = Math.max(0, Math.min(1, x / viewBoxWidth))
                    rampEndPct = Math.max(
                        rampStartPct,
                        Math.min(1, (x + width) / viewBoxWidth)
                    )
                }
                const yBounds = parseTransformedY(img, viewBoxHeight)
                rampTopPct = yBounds.topPct
                rampBottomPct = yBounds.bottomPct
            } else if (viewBoxWidth > 0 && viewBoxHeight > 0) {
                const rects = doc.querySelectorAll('rect[onmouseover]')
                if (rects.length > 0) {
                    const first = rects[0]
                    const last = rects[rects.length - 1]
                    const firstX = Number(first.getAttribute('x')) || 0
                    const lastX = Number(last.getAttribute('x')) || 0
                    const lastWidth = Number(last.getAttribute('width')) || 0
                    rampStartPct = Math.max(0, Math.min(1, firstX / viewBoxWidth))
                    rampEndPct = Math.max(
                        rampStartPct,
                        Math.min(1, (lastX + lastWidth) / viewBoxWidth)
                    )
                    const yBounds = parseTransformedY(first, viewBoxHeight)
                    rampTopPct = yBounds.topPct
                    rampBottomPct = yBounds.bottomPct
                }
            }

            let bestTitle: string | undefined
            if (candidateTitles.length > 0) {
                bestTitle = candidateTitles[0].text
            }

            ramps.push({
                title: bestTitle,
                bins: allTips,
                rampStartPct,
                rampEndPct,
                rampTopPct,
                rampBottomPct,
            })
        }
    }

    const primaryRamp = ramps[0] ?? defaultRamp
    return {
        ramps,
        bins: primaryRamp.bins,
        rampStartPct: primaryRamp.rampStartPct,
        rampEndPct: primaryRamp.rampEndPct,
        rampTopPct: primaryRamp.rampTopPct,
        rampBottomPct: primaryRamp.rampBottomPct,
    }
}

export function extractGibsBins(rawSvg: string): string[] {
    return extractGibsLegendData(rawSvg).bins
}

export class LayerPickerControl extends Control {
    declare public element: HTMLElement

    #activeSettingsLayerName: string | null = null
    #draggedLayerName: string | null = null
    #isReorderingLayers = false
    #options?: LayerPickerControlOptions
    #toggleBtn: HTMLButtonElement
    #panel: HTMLElement
    #isOpen: boolean = false
    #documentClickHandler: (event: MouseEvent) => void
    #visibilityListeners = new Map<BaseLayer, () => void>()
    #statusMessage: string = ''
    #activePopover: {
        layerName: string | null
        active: boolean
        value: string
        x: number
        y: number
        rampIdx?: number
    } = {
        layerName: null,
        active: false,
        value: '',
        x: 0,
        y: 0,
        rampIdx: 0,
    }

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

        toggleBtn.addEventListener('click', e => {
            e.stopPropagation()
            this.#togglePanel()
        })
        element.appendChild(toggleBtn)

        const panel = document.createElement('div')
        panel.className = 'layer-picker-panel'
        panel.addEventListener('click', e => e.stopPropagation())
        panel.addEventListener('wheel', e => e.stopPropagation())
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

        const layers = map.getLayers()
        layers.forEach((layer: BaseLayer) => {
            this.#watchLayer(layer)
        })
        layers.on('add', (e: CollectionEvent<BaseLayer>) => {
            if (this.#isReorderingLayers) {
                return
            }
            this.#watchLayer(e.element)
            this.#renderPanel()
        })
        layers.on('remove', (e: CollectionEvent<BaseLayer>) => {
            if (this.#isReorderingLayers) {
                return
            }
            this.#unwatchLayer(e.element)
            this.#renderPanel()
        })

        map.on('click', () => {
            if (this.#isOpen) {
                this.#togglePanel(false)
            }
        })

        this.#renderPanel()
    }

    #loadGibsLegend(layer: BaseLayer) {
        const legend = layer.get('legend')
        if (!legend) {
            return
        }

        const legendUrl = layer.get('__gibsLegendUrl') ?? layer.get('__gibsLegendSvg')
        if (legendUrl !== undefined) {
            return
        }

        layer.set('__gibsLegendUrl', 'loading')

        const handleResolved = async (url: string | null) => {
            layer.set('__gibsLegendUrl', url)
            if (layer.getVisible()) {
                this.#renderPanel()
            }
            if (url) {
                // Pre-download and decode image asset in browser memory
                const preloadImg = new Image()
                preloadImg.src = url

                try {
                    const fetchSvg =
                        this.#options?.fetchLegendSvg ??
                        ((targetUrl: string) => gibsApi.getLegendSvg(targetUrl))
                    const rawSvg = await fetchSvg(url)
                    if (rawSvg) {
                        const legendData = extractGibsLegendData(rawSvg)
                        layer.set('__gibsRamps', legendData.ramps)
                        layer.set('__gibsBins', legendData.bins)
                        layer.set('__gibsRampStartPct', legendData.rampStartPct)
                        layer.set('__gibsRampEndPct', legendData.rampEndPct)
                        layer.set('__gibsRampTopPct', legendData.rampTopPct)
                        layer.set('__gibsRampBottomPct', legendData.rampBottomPct)
                        if (layer.getVisible()) {
                            this.#renderPanel()
                        }
                    }
                } catch {
                    // graceful degradation: bins remain empty, slider uses percentage fallback
                }
            }
        }

        if (typeof legend.then === 'function') {
            legend
                .then((resolvedUrls: { horizontal?: string } | undefined) => {
                    void handleResolved(resolvedUrls?.horizontal ?? null)
                })
                .catch(() => {
                    void handleResolved(null)
                })
        } else if (
            typeof legend === 'object' &&
            typeof legend.horizontal === 'string'
        ) {
            void handleResolved(legend.horizontal)
        } else {
            void handleResolved(null)
        }
    }

    #watchLayer(layer: BaseLayer) {
        if (this.#visibilityListeners.has(layer)) {
            return
        }

        const listener = () => {
            if (this.#isReorderingLayers) {
                return
            }
            this.#renderPanel()
        }
        layer.on('change:visible', listener)
        layer.on('change:opacity', listener)
        this.#visibilityListeners.set(layer, listener)
    }

    #unwatchLayer(layer: BaseLayer) {
        const listener = this.#visibilityListeners.get(layer)

        if (listener) {
            layer.un('change:visible', listener)
            layer.un('change:opacity', listener)
            this.#visibilityListeners.delete(layer)
        }
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
            this.#scrollToFirstSelectedLayer()
        }
    }

    #scrollToFirstSelectedLayer() {
        requestAnimationFrame(() => {
            if (!this.#isOpen || !this.#panel) {
                return
            }

            const selectedViz = this.#panel.querySelector<HTMLElement>(
                '.layer-picker-visualization-item input[type="checkbox"]:checked'
            )
            const target = selectedViz?.closest<HTMLElement>(
                '.layer-picker-visualization-item'
            )
            const body = this.#panel.querySelector<HTMLElement>('.layer-picker-body')
            const isBodyScrollable = Boolean(
                body && body.scrollHeight > body.clientHeight
            )
            const isPanelScrollable =
                this.#panel.scrollHeight > this.#panel.clientHeight
            // In tall viewports, .layer-picker-body scrolls; in compact viewports, .layer-picker-panel scrolls
            const scrollContainer =
                isPanelScrollable && !isBodyScrollable
                    ? this.#panel
                    : (body ?? this.#panel)

            // Only scroll the internal visualization list container; never scroll the outer page
            if (!target || !scrollContainer) {
                return
            }

            const containerRect = scrollContainer.getBoundingClientRect()
            const targetRect = target.getBoundingClientRect()

            const targetRelativeTop =
                targetRect.top - containerRect.top + scrollContainer.scrollTop
            const targetRelativeBottom = targetRelativeTop + targetRect.height

            const visibleTop = scrollContainer.scrollTop
            const visibleBottom = visibleTop + scrollContainer.clientHeight

            // Comfortable clearance so the entire colormap and labels stay in view
            const offset = 16

            if (targetRelativeTop < visibleTop + offset) {
                scrollContainer.scrollTo({
                    top: Math.max(0, targetRelativeTop - offset),
                    behavior: 'smooth',
                })
            } else if (targetRelativeBottom > visibleBottom - offset) {
                scrollContainer.scrollTo({
                    top: Math.max(
                        0,
                        targetRelativeBottom - scrollContainer.clientHeight + offset
                    ),
                    behavior: 'smooth',
                })
            }
        })
    }

    #renderPanel() {
        const map = this.getMap()

        if (!map || !this.#panel) {
            return
        }

        const titledLayers = map
            .getLayers()
            .getArray()
            .filter((layer: BaseLayer) => Boolean(layer.get('title')))

        const visualizationLayers = titledLayers.filter(
            (layer: BaseLayer) => layer.get('type') === 'visualization'
        )

        const baseLayers = titledLayers.filter(
            (layer: BaseLayer) => layer.get('type') === 'base'
        )

        const overlayLayers = titledLayers.filter(
            (layer: BaseLayer) =>
                layer.get('type') !== 'base' && layer.get('type') !== 'visualization'
        )

        render(
            html`
                <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
                    ${this.#statusMessage}
                </div>
                ${
                    visualizationLayers.length > 0
                        ? html`
                          <div class="layer-picker-body">
                              <div
                                  class="layer-picker-section layer-picker-section--visualizations"
                              >
                                  <div class="layer-picker-heading">Visualizations</div>
                                  ${visualizationLayers
                                      .toReversed()
                                      .map((layer, idx, arr) =>
                                          this.#renderVizItem(layer, idx, arr.length)
                                      )}
                              </div>
                          </div>
                      `
                        : nothing
                }
                ${
                    baseLayers.length > 0 || overlayLayers.length > 0
                        ? html`
                          <div class="layer-picker-footer">
                              ${
                                  baseLayers.length > 0
                                      ? this.#renderSection(
                                            'Base Maps',
                                            baseLayers,
                                            'base'
                                        )
                                      : nothing
                              }
                              ${
                                  overlayLayers.length > 0
                                      ? this.#renderSection(
                                            'Overlays',
                                            overlayLayers,
                                            'overlay'
                                        )
                                      : nothing
                              }
                          </div>
                      `
                        : nothing
                }
            `,
            this.#panel
        )
    }

    #renderVizItem(layer: BaseLayer, index: number, total: number) {
        const name = layer.get('name') ?? ''
        const title = layer.get('title') ?? ''
        const isSettingsOpen = this.#activeSettingsLayerName === name
        const drawerId = `layer-settings-${name}`
        const inputId = `opacity-input-${name}`
        const positionLabel = `Layer ${index + 1} of ${total}`

        return html`
            <div
                class="layer-picker-visualization-item"
                data-layer-name=${name}
                @dragover=${(e: DragEvent) => {
                    if (!this.#draggedLayerName || this.#draggedLayerName === name) {
                        return
                    }
                    e.preventDefault()
                    if (e.dataTransfer) {
                        e.dataTransfer.dropEffect = 'move'
                    }
                    const card = e.currentTarget as HTMLElement
                    this.#panel
                        .querySelectorAll('.layer-picker-visualization-item')
                        .forEach(el => {
                            if (el !== card) {
                                el.classList.remove(
                                    'drop-target-above',
                                    'drop-target-below'
                                )
                            }
                        })
                    const rect = card.getBoundingClientRect()
                    const isAbove = e.clientY < rect.top + rect.height / 2
                    card.classList.toggle('drop-target-above', isAbove)
                    card.classList.toggle('drop-target-below', !isAbove)
                }}
                @dragleave=${(e: DragEvent) => {
                    const card = e.currentTarget as HTMLElement
                    const related = e.relatedTarget as Node | null
                    // `dragleave` bubbles when moving between child elements (`<label>`, `<span>`,
                    // `<svg>`, `<button>`) inside the same card; only clear the drop indicator
                    // when the pointer actually leaves the card's subtree.
                    if (!related || !card.contains(related)) {
                        card.classList.remove(
                            'drop-target-above',
                            'drop-target-below'
                        )
                    }
                }}
                @drop=${(e: DragEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const card = e.currentTarget as HTMLElement
                    const isAbove = card.classList.contains('drop-target-above')
                    card.classList.remove('drop-target-above', 'drop-target-below')

                    const draggedName = this.#draggedLayerName
                    this.#draggedLayerName = null

                    if (draggedName && draggedName !== name) {
                        this.#reorderVisualizationLayers(
                            draggedName,
                            name,
                            isAbove ? 'above' : 'below'
                        )
                    }
                }}
            >
                <div
                      class="layer-picker-viz-header"
        @pointerenter=${() => {
            this.#loadGibsLegend(layer)
        }}
        @focusin=${() => {
            this.#loadGibsLegend(layer)
        }}
                    >
                    <label class="layer-picker-item">
                        <input
                            type="checkbox"
                            .checked=${layer.getVisible()}
                            @change=${(e: Event) => {
                                const input = e.target as HTMLInputElement
                                layer.setVisible(input.checked)
                                this.#options?.onLayerToggle?.({
                                    name,
                                    title,
                                    type: 'visualization',
                                    visible: layer.getVisible(),
                                    layer,
                                })
                                this.#renderPanel()
                            }}
                        />
                        <span title=${title}>${title}</span>
                    </label>

                    <div class="layer-picker-viz-actions">
                        <button
                            type="button"
                            class="layer-picker-settings-btn ${isSettingsOpen ? 'active' : ''}"
                            title="Adjust opacity for ${title}"
                            aria-label="Adjust opacity for ${title}"
                            aria-expanded="${String(isSettingsOpen)}"
                            aria-controls=${drawerId}
    @click=${(e: MouseEvent) => {
        e.stopPropagation()
        const opening = !isSettingsOpen
        this.#activeSettingsLayerName = opening ? name : null

        // If opening opacity controls for an unchecked layer, turn it on
        if (opening && !layer.getVisible()) {
            layer.setVisible(true)
            this.#options?.onLayerToggle?.({
                name,
                title,
                type: 'visualization',
                visible: true,
                layer,
            })
        }

        this.#renderPanel()

        if (opening) {
            setTimeout(() => {
                this.#panel
                    ?.querySelector<HTMLInputElement>(`[id="${CSS.escape(inputId)}"]`)
                    ?.focus()
            }, 0)
        }
    }}
                        >
                            ${ELLIPSIS_ICON_SVG}
                        </button>

                        <button
                            type="button"
                            class="layer-picker-drag-handle"
                            draggable="true"
                            data-drag-handle=${name}
                            title="Reorder ${title} (${positionLabel}). Use Up/Down arrow keys or drag."
                            aria-label="Reorder ${title}. ${positionLabel}. Press Up Arrow to move up, Down Arrow to move down."
                            aria-roledescription="sortable layer"
                            @dragstart=${(e: DragEvent) => {
                                e.stopPropagation()
                                this.#draggedLayerName = name
                                const handle = e.currentTarget as HTMLElement
                                const card = handle.closest(
                                    '.layer-picker-visualization-item'
                                ) as HTMLElement | null
                                const header = card?.querySelector(
                                    '.layer-picker-viz-header'
                                ) as HTMLElement | null

                                if (e.dataTransfer) {
                                    e.dataTransfer.setData('text/plain', name)
                                    e.dataTransfer.effectAllowed = 'move'
                                    // Snapshot only the compact `.layer-picker-viz-header` row (which has
                                    // a solid background) rather than the full card with an expanded SVG
                                    // legend, and anchor the drag image at the pointer's actual offset
                                    // within the header so the ghost stays aligned with the list instead
                                    // of jumping ~250px to the right when grabbed by the right-hand handle.
                                    if (header && e.dataTransfer.setDragImage) {
                                        const rect = header.getBoundingClientRect()
                                        const offsetX =
                                            rect.width > 0
                                                ? Math.min(
                                                      Math.max(
                                                          e.clientX - rect.left,
                                                          0
                                                      ),
                                                      rect.width
                                                  )
                                                : 20
                                        const offsetY =
                                            rect.height > 0
                                                ? Math.min(
                                                      Math.max(
                                                          e.clientY - rect.top,
                                                          0
                                                      ),
                                                      rect.height
                                                  )
                                                : 14
                                        e.dataTransfer.setDragImage(
                                            header,
                                            offsetX,
                                            offsetY
                                        )
                                    }
                                }
                                card?.classList.add('is-dragging')
                            }}
                            @dragend=${(e: DragEvent) => {
                                this.#draggedLayerName = null
                                const card = (e.currentTarget as HTMLElement).closest(
                                    '.layer-picker-visualization-item'
                                )
                                card?.classList.remove('is-dragging')
                                this.#panel
                                    .querySelectorAll(
                                        '.layer-picker-visualization-item'
                                    )
                                    .forEach(el =>
                                        el.classList.remove(
                                            'drop-target-above',
                                            'drop-target-below',
                                            'is-dragging'
                                        )
                                    )
                            }}
                            @keydown=${(e: KeyboardEvent) => {
                                switch (e.key) {
                                    case 'ArrowUp': {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        this.#moveLayerByOffset(name, -1)
                                        break
                                    }
                                    case 'ArrowDown': {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        this.#moveLayerByOffset(name, 1)
                                        break
                                    }
                                    default:
                                        break
                                }
                            }}
                        >
                            ${ARROWS_UP_DOWN_ICON_SVG}
                        </button>
                    </div>
                </div>

                ${this.#renderSettingsDrawer(layer)}
                ${layer.getVisible() ? this.#renderLegend(layer) : nothing}
            </div>
        `
    }

    #moveLayerByOffset(name: string, offset: number) {
        const map = this.getMap()
        if (!map) {
            return
        }

        const layersCollection = map.getLayers()
        const allLayers = layersCollection.getArray().slice()

        const vizLayers = allLayers.filter(
            (l: BaseLayer) =>
                l.get('type') === 'visualization' && Boolean(l.get('title'))
        )
        const uiLayers = vizLayers.toReversed()

        const currentIndex = uiLayers.findIndex(
            (l: BaseLayer) => (l.get('name') ?? '') === name
        )
        if (currentIndex === -1) {
            return
        }

        const targetIndex = currentIndex + offset
        if (targetIndex < 0 || targetIndex >= uiLayers.length) {
            return
        }

        const targetLayer = uiLayers[targetIndex]
        const targetName = targetLayer.get('name') ?? ''

        this.#reorderVisualizationLayers(
            name,
            targetName,
            offset < 0 ? 'above' : 'below'
        )

        setTimeout(() => {
            this.#panel
                ?.querySelector<HTMLButtonElement>(
                    `[data-drag-handle="${CSS.escape(name)}"]`
                )
                ?.focus()
        }, 0)
    }

    #reorderVisualizationLayers(
        draggedName: string,
        targetName: string,
        position: 'above' | 'below'
    ) {
        const map = this.getMap()
        if (!map) {
            return
        }

        const layersCollection = map.getLayers()
        const allLayers = layersCollection.getArray().slice()

        const vizIndices: number[] = []
        const vizLayers: BaseLayer[] = []

        allLayers.forEach((l, idx) => {
            if (l.get('type') === 'visualization' && l.get('title')) {
                vizIndices.push(idx)
                vizLayers.push(l)
            }
        })

        const uiLayers = vizLayers.toReversed()
        const draggedLayer = uiLayers.find(l => (l.get('name') ?? '') === draggedName)
        const targetLayer = uiLayers.find(l => (l.get('name') ?? '') === targetName)

        if (!draggedLayer || !targetLayer || draggedLayer === targetLayer) {
            return
        }

        const remainingUi = uiLayers.filter(l => l !== draggedLayer)
        const targetIdxInRemaining = remainingUi.indexOf(targetLayer)
        const insertIdx =
            position === 'below' ? targetIdxInRemaining + 1 : targetIdxInRemaining
        remainingUi.splice(insertIdx, 0, draggedLayer)

        const remainingOl = remainingUi.toReversed()
        const updatedAllLayers = allLayers.slice()
        vizIndices.forEach((layerIdx, i) => {
            updatedAllLayers[layerIdx] = remainingOl[i]
        })

        this.#isReorderingLayers = true
        try {
            layersCollection.clear()
            updatedAllLayers.forEach(l => layersCollection.push(l))
        } finally {
            this.#isReorderingLayers = false
        }

        const newIndex = remainingUi.indexOf(draggedLayer)
        const title = draggedLayer.get('title') ?? draggedName
        this.#statusMessage = `Moved ${title} to layer ${newIndex + 1} of ${remainingUi.length}`

        this.#options?.onLayerOrderChange?.({
            names: remainingOl.map(l => l.get('name') ?? ''),
        })

        this.#renderPanel()
    }

    #renderSettingsDrawer(layer: BaseLayer) {
        const name = layer.get('name') ?? ''
        const title = layer.get('title') ?? ''
        const isSettingsOpen = this.#activeSettingsLayerName === name
        const drawerId = `layer-settings-${name}`
        const labelId = `opacity-label-${name}`
        const inputId = `opacity-input-${name}`
        const currentPercent = Math.round((layer.getOpacity() ?? 1) * 100)

        const handleInput = (e: Event) => {
            const input = e.target as HTMLInputElement
            const percent = Number(input.value)
            layer.setOpacity(percent / 100)
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation()
                this.#activeSettingsLayerName = null
                this.#renderPanel()
                this.#panel
                    .querySelector<HTMLButtonElement>(
                        `[aria-controls="${CSS.escape(drawerId)}"]`
                    )
                    ?.focus()
            }
        }

        return html`
            <div
                id=${drawerId}
                class="layer-picker-settings-drawer"
                role="region"
                aria-label="${title} opacity"
                ?hidden=${!isSettingsOpen}
                aria-hidden="${!isSettingsOpen}"
                @keydown=${handleKeyDown}
            >
                <div class="layer-picker-opacity-header">
                    <label id=${labelId} for=${inputId}>Opacity</label>
                    <span class="layer-picker-opacity-value" aria-hidden="true">${`${currentPercent}%`}</span>
                </div>
                <input
                    id=${inputId}
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    .value=${String(currentPercent)}
                    style="--slider-percent: ${currentPercent}%;"
                    aria-label="${title} opacity"
                    aria-labelledby=${labelId}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow="${currentPercent}"
                    aria-valuetext="${currentPercent}%"
                    class="layer-picker-opacity-slider"
                    @input=${handleInput}
                />
            </div>
        `
    }

    #renderLegend(layer: BaseLayer) {
        const info = layer.get('info')
        const name = layer.get('name') ?? ''
        const title = layer.get('title') ?? ''

        if (
            info &&
            Array.isArray(info.legendValues) &&
            info.legendValues.length > 0
        ) {
            const stops = info.legendValues
                .toReversed()
                .map((e: { rgb: number[] }) => `rgb(${e.rgb.slice(0, 3).join(',')})`)
            const background = `linear-gradient(to right, ${stops.join(', ')})`

            const handleMouseMove = (e: MouseEvent) => {
                const bar = e.currentTarget as HTMLElement
                const rect = bar.getBoundingClientRect()
                const pct = Math.max(
                    0,
                    Math.min(1, (e.clientX - rect.left) / rect.width)
                )
                const val = info.min + pct * (info.max - info.min)
                bar.title = `Value: ${val.toFixed(2)}`
            }

            const handleClick = (e: MouseEvent) => {
                e.stopPropagation()
                const bar = e.currentTarget as HTMLElement
                const rect = bar.getBoundingClientRect()
                const pct = Math.max(
                    0,
                    Math.min(1, (e.clientX - rect.left) / rect.width)
                )
                const val = info.min + pct * (info.max - info.min)
                this.#options?.onLegendClick?.({
                    name,
                    title,
                    type: 'visualization',
                    valueChosen: val,
                    min: info.min,
                    max: info.max,
                    legendValues: info.legendValues,
                    layer,
                })
            }

            return html`
                <div class="layer-picker-legend">
                    <div
                        class="layer-picker-legend-bar"
                        style="background: ${background}"
                        role="button"
                        tabindex="0"
                        aria-label="${title} color scale from ${info.min} to ${info.max}"
                        @mousemove=${handleMouseMove}
                        @click=${handleClick}
                        @keydown=${(e: KeyboardEvent) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                const bar = e.currentTarget as HTMLElement | null
                                const rect = bar?.getBoundingClientRect()
                                const clientX = rect ? rect.left + rect.width / 2 : 0
                                bar?.dispatchEvent(
                                    new MouseEvent('click', {
                                        bubbles: true,
                                        clientX,
                                    })
                                )
                            }
                        }}
                    ></div>
                    <div class="layer-picker-legend-labels" aria-hidden="true">
                        <span>${info.min}</span>
                        <span>${info.max}</span>
                    </div>
                </div>
            `
        }

        const legend = layer.get('legend')
        if (legend) {
            const legendUrl =
                layer.get('__gibsLegendUrl') ?? layer.get('__gibsLegendSvg')

            if (legendUrl && legendUrl !== 'loading') {
                const url =
                    typeof legendUrl === 'object' && 'fallbackImgUrl' in legendUrl
                        ? legendUrl.fallbackImgUrl
                        : typeof legendUrl === 'string'
                          ? legendUrl
                          : null

                if (url) {
                    return this.#renderGibsImgLegend(layer, url)
                }
            }

            this.#loadGibsLegend(layer)

            if (
                layer.get('__gibsLegendUrl') === 'loading' ||
                layer.get('__gibsLegendSvg') === 'loading'
            ) {
                return this.#renderGibsLegendSkeleton(layer)
            }
        }

        return nothing
    }

    #renderGibsImgLegend(layer: BaseLayer, url: string) {
        const name = layer.get('name') ?? ''
        const title = layer.get('title') ?? ''
        const storedRamps: GibsRamp[] = layer.get('__gibsRamps') ?? []
        const defaultRamp: GibsRamp = {
            bins: layer.get('__gibsBins') ?? [],
            rampStartPct: layer.get('__gibsRampStartPct') ?? 0,
            rampEndPct: layer.get('__gibsRampEndPct') ?? 1,
            rampTopPct: layer.get('__gibsRampTopPct') ?? 0.3474,
            rampBottomPct: layer.get('__gibsRampBottomPct') ?? 0.5474,
        }
        const ramps: GibsRamp[] = storedRamps.length > 0 ? storedRamps : [defaultRamp]
        const activeRampIdx = Math.min(
            ramps.length - 1,
            Math.max(0, layer.get('__legendActiveRampIdx') ?? 0)
        )
        const currentRamp = ramps[activeRampIdx]
        const currentBins = currentRamp.bins
        const maxIdx = Math.max(0, currentBins.length - 1)
        const currentIdx = Math.min(
            maxIdx,
            Math.max(
                0,
                layer.get(`__legendBinIdx_${activeRampIdx}`) ??
                    (activeRampIdx === 0
                        ? (layer.get('__legendBinIdx') ??
                          Math.floor(currentBins.length / 2))
                        : Math.floor(currentBins.length / 2))
            )
        )
        const currentRawValue =
            currentBins.length > 0
                ? currentBins[currentIdx]
                : `${layer.get('__legendPercent') ?? 50}%`
        const currentDisplayValue =
            currentRamp.title && ramps.length > 1
                ? `${currentRamp.title}: ${currentRawValue}`
                : currentRawValue

        const getClosestRampIndex = (cursorYPct: number): number => {
            if (ramps.length <= 1) {
                return 0
            }
            let minDistance = Infinity
            let closestIdx = 0
            ramps.forEach((ramp, idx) => {
                const rampCenterY = (ramp.rampTopPct + ramp.rampBottomPct) / 2
                const dist = Math.abs(cursorYPct - rampCenterY)
                if (dist < minDistance) {
                    minDistance = dist
                    closestIdx = idx
                }
            })
            return closestIdx
        }

        const updateKeyboardPopover = (rampIdx: number, binIdx: number) => {
            const activeRamp = ramps[rampIdx] ?? ramps[0]
            const container = this.#panel?.querySelector<HTMLElement>(
                `[data-legend-container="${CSS.escape(name)}"]`
            )
            const rect = container?.getBoundingClientRect()
            const total = Math.max(1, activeRamp.bins.length - 1)
            const rampSpan = Math.max(
                0.001,
                activeRamp.rampEndPct - activeRamp.rampStartPct
            )
            const rampPct = activeRamp.rampStartPct + (binIdx / total) * rampSpan
            const x = rect && rect.width > 0 ? rect.left + rampPct * rect.width : 0
            const y = rect ? rect.top : 0
            const rawVal =
                activeRamp.bins.length > 0
                    ? activeRamp.bins[binIdx]
                    : `${Math.round(rampPct * 100)}%`
            const displayVal =
                activeRamp.title && ramps.length > 1
                    ? `${activeRamp.title}: ${rawVal}`
                    : rawVal

            this.#activePopover = {
                layerName: name,
                active: true,
                value: displayVal,
                x,
                y,
                rampIdx,
            }
            this.#renderPanel()
        }

        const handleFocusIn = () => {
            updateKeyboardPopover(activeRampIdx, currentIdx)
        }

        const handleFocusOut = () => {
            if (this.#activePopover.layerName === name) {
                this.#activePopover = {
                    layerName: null,
                    active: false,
                    value: '',
                    x: 0,
                    y: 0,
                    rampIdx: 0,
                }
                this.#renderPanel()
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            const container = e.currentTarget as HTMLElement
            const rect = container.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) {
                const cursorYPct = Math.max(
                    0,
                    Math.min(1, (e.clientY - rect.top) / rect.height)
                )
                const rampIdx = getClosestRampIndex(cursorYPct)
                const targetRamp = ramps[rampIdx]
                const rampSpan = Math.max(
                    0.001,
                    targetRamp.rampEndPct - targetRamp.rampStartPct
                )
                const rawPct = Math.max(
                    0,
                    Math.min(1, (e.clientX - rect.left) / rect.width)
                )
                const normalizedPct = Math.max(
                    0,
                    Math.min(1, (rawPct - targetRamp.rampStartPct) / rampSpan)
                )

                let value: string
                if (targetRamp.bins.length > 0) {
                    const idx = Math.min(
                        targetRamp.bins.length - 1,
                        Math.floor(normalizedPct * targetRamp.bins.length)
                    )
                    value = targetRamp.bins[idx]
                    layer.set(`__legendBinIdx_${rampIdx}`, idx)
                    if (rampIdx === 0) {
                        layer.set('__legendBinIdx', idx)
                    }
                } else {
                    const percent = Math.round(normalizedPct * 100)
                    value = `${percent}%`
                    layer.set(`__legendPercent_${rampIdx}`, percent)
                }

                layer.set('__legendActiveRampIdx', rampIdx)
                const displayVal =
                    targetRamp.title && ramps.length > 1
                        ? `${targetRamp.title}: ${value}`
                        : value

                this.#activePopover = {
                    layerName: name,
                    active: true,
                    value: displayVal,
                    x: Math.max(
                        rect.left + targetRamp.rampStartPct * rect.width,
                        Math.min(
                            rect.left + targetRamp.rampEndPct * rect.width,
                            e.clientX
                        )
                    ),
                    y: rect.top,
                    rampIdx,
                }
                this.#renderPanel()
            }
        }

        const handleMouseLeave = () => {
            const container = this.#panel?.querySelector<HTMLElement>(
                `[data-legend-container="${CSS.escape(name)}"]`
            )
            if (document.activeElement !== container) {
                if (this.#activePopover.layerName === name) {
                    this.#activePopover = {
                        layerName: null,
                        active: false,
                        value: '',
                        x: 0,
                        y: 0,
                        rampIdx: 0,
                    }
                    this.#renderPanel()
                }
            }
        }

        const handleClick = (e: MouseEvent) => {
            e.stopPropagation()
            const container = e.currentTarget as HTMLElement
            const rect = container.getBoundingClientRect()
            const cursorYPct =
                rect.height > 0
                    ? Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
                    : 0
            const rampIdx = getClosestRampIndex(cursorYPct)
            const targetRamp = ramps[rampIdx]
            const rampSpan = Math.max(
                0.001,
                targetRamp.rampEndPct - targetRamp.rampStartPct
            )
            const rawPct =
                rect.width > 0 && e.clientX >= rect.left
                    ? Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                    : 0.5
            const normalizedPct = Math.max(
                0,
                Math.min(1, (rawPct - targetRamp.rampStartPct) / rampSpan)
            )

            let valueChosen: string
            if (targetRamp.bins.length > 0) {
                const idx = Math.min(
                    targetRamp.bins.length - 1,
                    Math.floor(normalizedPct * targetRamp.bins.length)
                )
                valueChosen = targetRamp.bins[idx]
                layer.set(`__legendBinIdx_${rampIdx}`, idx)
                if (rampIdx === 0) {
                    layer.set('__legendBinIdx', idx)
                }
            } else {
                const percent = Math.round(normalizedPct * 100)
                valueChosen = `${percent}%`
                layer.set(`__legendPercent_${rampIdx}`, percent)
            }

            layer.set('__legendActiveRampIdx', rampIdx)

            this.#options?.onLegendClick?.({
                name,
                title,
                type: 'visualization',
                scale: targetRamp.title,
                valueChosen,
                layer,
            })
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft': {
                    e.preventDefault()
                    e.stopPropagation()
                    const nextIdx = Math.max(0, currentIdx - 1)
                    layer.set(`__legendBinIdx_${activeRampIdx}`, nextIdx)
                    if (activeRampIdx === 0) {
                        layer.set('__legendBinIdx', nextIdx)
                    }
                    updateKeyboardPopover(activeRampIdx, nextIdx)
                    break
                }
                case 'ArrowRight': {
                    e.preventDefault()
                    e.stopPropagation()
                    const nextIdx = Math.min(maxIdx, currentIdx + 1)
                    layer.set(`__legendBinIdx_${activeRampIdx}`, nextIdx)
                    if (activeRampIdx === 0) {
                        layer.set('__legendBinIdx', nextIdx)
                    }
                    updateKeyboardPopover(activeRampIdx, nextIdx)
                    break
                }
                case 'ArrowUp': {
                    if (ramps.length > 1) {
                        e.preventDefault()
                        e.stopPropagation()
                        const nextRampIdx = Math.max(0, activeRampIdx - 1)
                        layer.set('__legendActiveRampIdx', nextRampIdx)
                        const nextRampBins = ramps[nextRampIdx].bins
                        const binIdx = Math.min(
                            Math.max(0, nextRampBins.length - 1),
                            layer.get(`__legendBinIdx_${nextRampIdx}`) ??
                                Math.floor(nextRampBins.length / 2)
                        )
                        updateKeyboardPopover(nextRampIdx, binIdx)
                    }
                    break
                }
                case 'ArrowDown': {
                    if (ramps.length > 1) {
                        e.preventDefault()
                        e.stopPropagation()
                        const nextRampIdx = Math.min(
                            ramps.length - 1,
                            activeRampIdx + 1
                        )
                        layer.set('__legendActiveRampIdx', nextRampIdx)
                        const nextRampBins = ramps[nextRampIdx].bins
                        const binIdx = Math.min(
                            Math.max(0, nextRampBins.length - 1),
                            layer.get(`__legendBinIdx_${nextRampIdx}`) ??
                                Math.floor(nextRampBins.length / 2)
                        )
                        updateKeyboardPopover(nextRampIdx, binIdx)
                    }
                    break
                }
                case 'Home': {
                    e.preventDefault()
                    e.stopPropagation()
                    layer.set(`__legendBinIdx_${activeRampIdx}`, 0)
                    if (activeRampIdx === 0) {
                        layer.set('__legendBinIdx', 0)
                    }
                    updateKeyboardPopover(activeRampIdx, 0)
                    break
                }
                case 'End': {
                    e.preventDefault()
                    e.stopPropagation()
                    layer.set(`__legendBinIdx_${activeRampIdx}`, maxIdx)
                    if (activeRampIdx === 0) {
                        layer.set('__legendBinIdx', maxIdx)
                    }
                    updateKeyboardPopover(activeRampIdx, maxIdx)
                    break
                }
                case 'PageDown': {
                    e.preventDefault()
                    e.stopPropagation()
                    const step = Math.max(1, Math.round(currentBins.length * 0.1))
                    const nextIdx = Math.max(0, currentIdx - step)
                    layer.set(`__legendBinIdx_${activeRampIdx}`, nextIdx)
                    if (activeRampIdx === 0) {
                        layer.set('__legendBinIdx', nextIdx)
                    }
                    updateKeyboardPopover(activeRampIdx, nextIdx)
                    break
                }
                case 'PageUp': {
                    e.preventDefault()
                    e.stopPropagation()
                    const step = Math.max(1, Math.round(currentBins.length * 0.1))
                    const nextIdx = Math.min(maxIdx, currentIdx + step)
                    layer.set(`__legendBinIdx_${activeRampIdx}`, nextIdx)
                    if (activeRampIdx === 0) {
                        layer.set('__legendBinIdx', nextIdx)
                    }
                    updateKeyboardPopover(activeRampIdx, nextIdx)
                    break
                }
                case 'Escape': {
                    e.preventDefault()
                    e.stopPropagation()
                    this.#activePopover = {
                        layerName: null,
                        active: false,
                        value: '',
                        x: 0,
                        y: 0,
                        rampIdx: 0,
                    }
                    this.#renderPanel()
                    break
                }
                case 'Enter':
                case ' ': {
                    e.preventDefault()
                    e.stopPropagation()
                    const chosenValue =
                        currentBins.length > 0
                            ? currentBins[currentIdx]
                            : `${layer.get(`__legendPercent_${activeRampIdx}`) ?? 50}%`
                    this.#options?.onLegendClick?.({
                        name,
                        title,
                        type: 'visualization',
                        scale: currentRamp.title,
                        valueChosen: chosenValue,
                        layer,
                    })
                    break
                }
                default:
                    break
            }
        }

        const isPopoverActive =
            this.#activePopover.active && this.#activePopover.layerName === name
        const virtualAnchor = {
            getBoundingClientRect: () => {
                const container = this.#panel?.querySelector<HTMLElement>(
                    `[data-legend-container="${CSS.escape(name)}"]`
                )
                const rect = container?.getBoundingClientRect()
                if (!rect || rect.height === 0) {
                    return new DOMRect(
                        this.#activePopover.x,
                        this.#activePopover.y,
                        0,
                        0
                    )
                }
                const activeRamp =
                    ramps[this.#activePopover.rampIdx ?? activeRampIdx] ?? ramps[0]
                const top = rect.top + activeRamp.rampTopPct * rect.height
                const height = Math.max(
                    1,
                    (activeRamp.rampBottomPct - activeRamp.rampTopPct) * rect.height
                )
                return new DOMRect(this.#activePopover.x, top, 0, height)
            },
        }

        const sliderLabel =
            ramps.length > 1 && currentRamp.title
                ? `${title}: ${currentRamp.title} color map legend`
                : `${title} color map legend`

        return html`
            <div
                class="layer-picker-legend layer-picker-legend-gibs"
                data-legend-container=${name}
                role="slider"
                tabindex="0"
                aria-label="${sliderLabel}"
                aria-valuemin="0"
                aria-valuemax="${maxIdx}"
                aria-valuenow="${currentIdx}"
                aria-valuetext="${currentDisplayValue}"
                @mousemove=${handleMouseMove}
                @mouseleave=${handleMouseLeave}
                @focusin=${handleFocusIn}
                @focusout=${handleFocusOut}
                @click=${handleClick}
                @keydown=${handleKeyDown}
            >
                <img
                    class="layer-picker-legend-img"
                    src=${url}
                    alt="${title} color map legend"
                    loading="lazy"
                    @load=${() => {
                        if (this.#isOpen) {
                            this.#scrollToFirstSelectedLayer()
                        }
                    }}
                />

                <terra-popup
                    .active=${isPopoverActive}
                    placement="top"
                    strategy="fixed"
                    distance="4"
                    flip
                    shift
                    arrow
                    .anchor=${virtualAnchor}
                >
                    <div class="layer-picker-legend-popup-content">
                        ${this.#activePopover.value}
                    </div>
                </terra-popup>
            </div>
        `
    }

    #renderGibsLegendSkeleton(layer: BaseLayer) {
        const title = layer.get('title') ?? ''
        return html`
            <div
                class="layer-picker-legend layer-picker-legend-skeleton"
                role="status"
                aria-label="Loading ${title} color map legend"
            >
                <terra-skeleton
                    effect="sheen"
                    .variableWidths=${false}
                ></terra-skeleton>
            </div>
        `
    }
    #renderSection(heading: string, layers: BaseLayer[], type: 'base' | 'overlay') {
        return html`
            <div class="layer-picker-section">
                <div class="layer-picker-heading">${heading}</div>
                ${layers.map(
                    layer => html`
                        <label class="layer-picker-item">
                            <input
                                type=${type === 'base' ? 'radio' : 'checkbox'}
                                name=${ifDefined(
                                    type === 'base'
                                        ? 'terra-map-base-layer'
                                        : undefined
                                )}
                                .checked=${layer.getVisible()}
                                @change=${(e: Event) => {
                                    const input = e.target as HTMLInputElement
                                    if (type === 'base') {
                                        layers.forEach(bLayer => {
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
                                }}
                            />
                            <span>${layer.get('title')}</span>
                        </label>
                    `
                )}
            </div>
        `
    }
}
