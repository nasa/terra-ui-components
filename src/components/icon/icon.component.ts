import type { CSSResultGroup, HTMLTemplateResult } from 'lit'
import { property, state } from 'lit/decorators.js'
import { isTemplateResult } from 'lit/directive-helpers.js'
import TerraElement from '../../internal/terra-element.js'
import { watch } from '../../internal/watch.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './icon.styles.js'
import { getIconLibrary, unwatchIcon, watchIcon } from './library.js'

const CACHEABLE_ERROR = Symbol()
const RETRYABLE_ERROR = Symbol()
type SVGResult =
    | HTMLTemplateResult
    | SVGSVGElement
    | typeof RETRYABLE_ERROR
    | typeof CACHEABLE_ERROR

let parser: DOMParser
const iconCache = new Map<string, Promise<SVGResult>>()

interface IconSource {
    url?: string
    fromLibrary: boolean
}

/**
 * @summary Icons are symbols that can be used to represent various options within an application.
 * @documentation https://disc.gsfc.nasa.gov/components/icon
 * @status experimental
 * @since 1.0
 *
 * @event terra-load - Emitted when the icon has loaded.
 * @event terra-error - Emitted when the icon fails to load due to an error.
 *
 * @csspart svg - The internal SVG element.
 */
export default class TerraIcon extends TerraElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    #initialRender = false

    @state() svg: SVGElement | HTMLTemplateResult | null = null

    /** The name of the icon to draw. Available names depend on the icon library being used. */
    @property({ reflect: true }) name?: string

    /**
     * An external URL of an SVG file. Be sure you trust the content you are including, as it will be executed as code and
     * can result in XSS attacks.
     */
    @property() src?: string

    /**
     * An alternate description to use for assistive devices. If omitted, the icon will be considered presentational and
     * ignored by assistive devices.
     */
    @property() label = ''

    /** The name of a registered custom icon library. */
    @property({ reflect: true }) library: 'default' | 'heroicons' | string = 'default'

    /** The CSS color to assign to the SVG. */
    @property() color: string | null = null

    /** The CSS font-size to assign to the SVG. */
    @property({ attribute: 'font-size' }) fontSize: string | null = null

    connectedCallback() {
        super.connectedCallback()
        watchIcon(this)
    }

    firstUpdated() {
        this.#initialRender = true
        this.setIcon()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        unwatchIcon(this)
    }

    /** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
    async #resolveIcon(url: string): Promise<SVGResult> {
        let fileData: Response

        try {
            fileData = await fetch(url, { mode: 'cors' })

            if (!fileData.ok) {
                return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR
            }
        } catch {
            return RETRYABLE_ERROR
        }

        try {
            const div = document.createElement('div')
            div.innerHTML = await fileData.text()

            const svg = div.firstElementChild
            if (svg?.tagName?.toLowerCase() !== 'svg') {
                return CACHEABLE_ERROR
            }

            if (!parser) {
                parser = new DOMParser()
            }
            const doc = parser.parseFromString(svg.outerHTML, 'text/html')

            const svgEl = doc.body.querySelector('svg')
            if (!svgEl) {
                return CACHEABLE_ERROR
            }

            svgEl.part.add('svg')
            return document.adoptNode(svgEl)
        } catch {
            return CACHEABLE_ERROR
        }
    }

    #getIconSource(): IconSource {
        const library = getIconLibrary(this.library)
        if (this.name && library) {
            return {
                url: library.resolver(this.name),
                fromLibrary: true,
            }
        }

        return {
            url: this.src,
            fromLibrary: false,
        }
    }

    /**
     * SVG takes a few presentation attributes. Since we're using a template for SVG and our host element isn't an SVG, we can pass those presentational attributes into a style attribute to affect the underlying SVG.
     * Merge select attributes with existing inline style attribute to forward values to underlying SVG.
     */
    #styleFromAttributes() {
        const svgAttributes = [
            { attribute: 'color', property: this.color },
            { attribute: 'font-size', property: this.fontSize },
        ]

        const style = svgAttributes.reduce((accumulator, { attribute, property }) => {
            if (typeof property === 'string' && property.length > 0) {
                accumulator += ` ${attribute}: ${property};`
            }

            this.removeAttribute(attribute)

            return accumulator
        }, `${this.style.cssText}`)

        if (style.length > 0) {
            this.setAttribute('style', style)
        }
    }

    @watch('label')
    handleLabelChange() {
        const hasLabel = typeof this.label === 'string' && this.label.length > 0

        if (hasLabel) {
            this.setAttribute('role', 'img')
            this.setAttribute('aria-label', this.label)
            this.removeAttribute('aria-hidden')
        } else {
            this.removeAttribute('role')
            this.removeAttribute('aria-label')
            this.setAttribute('aria-hidden', 'true')
        }
    }

    @watch(['name', 'src', 'library'])
    async setIcon() {
        const { url, fromLibrary } = this.#getIconSource()
        const library = fromLibrary ? getIconLibrary(this.library) : undefined

        if (!url) {
            this.svg = null
            return
        }

        let iconResolver = iconCache.get(url)
        if (!iconResolver) {
            iconResolver = this.#resolveIcon(url)
            iconCache.set(url, iconResolver)
        }

        // If we haven't rendered yet, exit early. This avoids unnecessary work due to watching multiple props.
        if (!this.#initialRender) {
            return
        }

        const svg = await iconResolver

        if (svg === RETRYABLE_ERROR) {
            iconCache.delete(url)
        }

        if (url !== this.#getIconSource().url) {
            // If the url has changed while fetching the icon, ignore this request
            return
        }

        if (isTemplateResult(svg)) {
            this.svg = svg
            return
        }

        switch (svg) {
            case RETRYABLE_ERROR:
            case CACHEABLE_ERROR:
                this.svg = null
                this.emit('terra-error')
                break
            default:
                this.svg = svg.cloneNode(true) as SVGElement
                library?.mutator?.(this.svg)
                this.emit('terra-load')
        }
    }

    render() {
        this.#styleFromAttributes()

        return this.svg
    }
}
