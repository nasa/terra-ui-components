import type { Variable } from '../components/browse-variables/browse-variables.types.js'

export interface TerraVariablesChangeEvent extends CustomEvent {
    detail: {
        selectedVariables: Variable[]
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-variables-change': TerraVariablesChangeEvent
    }
}
