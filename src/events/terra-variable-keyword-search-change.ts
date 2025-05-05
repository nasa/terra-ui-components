export type TerraVariableKeywordSearchChangeEvent = CustomEvent<string>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-variable-keyword-search-change': TerraVariableKeywordSearchChangeEvent
    }
}
