import { property, query } from 'lit/decorators.js'
import { html } from 'lit'
import componentStyles from '../../styles/component.styles.js'
import TerraElement, {
    undefinedStringConverter,
} from '../../internal/terra-element.js'
import { QueryClientMixin } from '../../mixins/query-client.mixin.js'
import { GibsVisualizationController } from '../../controllers/gibs-visualization.controller.js'
import TerraMap from '../map/map.component.js'
import TerraLoader from '../loader/loader.component.js'
import TerraAlert from '../alert/alert.component.js'
import TerraIcon from '../icon/icon.component.js'
import styles from './collection-visualization.styles.js'
import type { CSSResultGroup } from 'lit'
import type { GibsLayerConfig } from '../map/layers/gibs.layer.js'

/**
 * @summary Renders the top layer of a CMR collection's GIBS imagery stack on a map, given only a collection id.
 * @documentation https://terra-ui.netlify.app/components/collection-visualization
 * @status experimental
 * @since 1.0
 *
 * @dependency terra-map
 * @dependency terra-loader
 * @dependency terra-alert
 * @dependency terra-icon
 *
 * @event terra-collection-visualization-layer-change - Emitted once a GIBS layer has been resolved for the collection.
 *
 * @csspart base - The component's base wrapper.
 */
export default class TerraCollectionVisualization extends QueryClientMixin(
    TerraElement
) {
    static styles: CSSResultGroup = [componentStyles, styles]
    static dependencies = {
        'terra-map': TerraMap,
        'terra-loader': TerraLoader,
        'terra-alert': TerraAlert,
        'terra-icon': TerraIcon,
    }

    /**
     * A CMR collection entry-id (e.g. `M2T1NXAER_5_12_4`) or concept-id
     * (e.g. `C1234567890-PROVIDER`). Either is accepted — entry-ids are
     * resolved to a concept-id via CMR automatically.
     */
    @property({ attribute: 'collection-id', converter: undefinedStringConverter })
    collectionId?: string

    /**
     * ISO date (YYYY-MM-DD) to request from GIBS. Defaults to the layer's
     * latest available date.
     */
    @property({ converter: undefinedStringConverter })
    date?: string

    #controller = new GibsVisualizationController(this, {
        getCollectionId: () => this.collectionId,
        getDate: () => this.date,
    })

    // Tracks the last GibsLayerConfig we reacted to, by reference. The
    // controller memoizes this, so a stable reference here really does mean
    // "the same resolved layer" — not just "the same collection-id."
    #lastHandledLayer?: GibsLayerConfig

    @query('terra-map') innerMap?: TerraMap

    updated(changedProps: globalThis.Map<string, unknown>) {
        super.updated(changedProps)

        const gibsLayer = this.#controller.gibsLayerConfig
        if (!gibsLayer || gibsLayer === this.#lastHandledLayer) {
            return
        }
        this.#lastHandledLayer = gibsLayer

        const conceptId = this.#controller.conceptId
        if (conceptId && this.collectionId) {
            this.emit('terra-collection-visualization-layer-change', {
                detail: {
                    collectionId: this.collectionId,
                    conceptId,
                    gibsLayer,
                    visualization: this.#controller.resolvedVisualization,
                },
            })
        }

        if (gibsLayer.extent) {
            this.innerMap?.fitToExtent(gibsLayer.extent, {
                projection: 'EPSG:4326',
                padding: [50, 50, 50, 50],
            })
        }
    }

    render() {
        if (!this.collectionId) {
            return html`
                <terra-alert variant="warning" open>
                    <terra-icon
                        slot="icon"
                        name="outline-exclamation-triangle"
                        library="heroicons"
                    ></terra-icon>
                    A "collection-id" is required.
                </terra-alert>
            `
        }

        if (this.#controller.isLoading) {
            return html`<terra-loader indeterminate></terra-loader>`
        }

        if (this.#controller.hasError) {
            return html`
                <terra-alert variant="danger" open>
                    <terra-icon
                        slot="icon"
                        name="outline-exclamation-triangle"
                        library="heroicons"
                    ></terra-icon>
                    Failed to look up GIBS imagery for "${this.collectionId}".
                </terra-alert>
            `
        }

        if (this.#controller.notFound) {
            return html`
                <terra-alert variant="warning" open>
                    <terra-icon
                        slot="icon"
                        name="outline-exclamation-triangle"
                        library="heroicons"
                    ></terra-icon>
                    No GIBS imagery is available for "${this.collectionId}".
                </terra-alert>
            `
        }

        const gibsLayer = this.#controller.gibsLayerConfig
        // the service only ever builds raster (non-vector) configs, which are
        // the only variant that carries a `projection`
        const projection =
            gibsLayer && 'projection' in gibsLayer ? gibsLayer.projection : undefined

        return html`
            <terra-map
                fill
                projection=${projection ?? 'EPSG:3857'}
                .layers=${gibsLayer ? [gibsLayer] : []}
            ></terra-map>
        `
    }
}
