import type { UmmResult } from '../apis/cmr.api.js'
import type { UmmVis } from '../apis/types/cmr/umm-vis.js'
import type { GibsLayerConfig } from '../components/map/layers/gibs.layer.js'

export interface TerraCollectionVisualizationLayerChangeEvent extends CustomEvent {
    detail: {
        collectionId: string
        conceptId: string
        gibsLayer: GibsLayerConfig
        /**
         * The CMR UMM-Vis record backing `gibsLayer`, when one was matched.
         * Undefined when the layer came from a curated Worldview link with no
         * corresponding UMM-Vis association (see `resolveGibsLayer`).
         */
        visualization?: UmmResult<UmmVis>
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-collection-visualization-layer-change': TerraCollectionVisualizationLayerChangeEvent
    }
}
