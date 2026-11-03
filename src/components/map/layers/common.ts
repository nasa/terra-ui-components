export type CommonConfig = {
    /** Unique name for this layer, used for add/remove/update diffing and `getLayer()`. */
    name: string
    /** Human-readable display label shown in controls such as the layer picker. Defaults to `name`. */
    title?: string
    /** Where to place the layer relative to the borders/labels layers. Defaults to 'below-borders'. */
    position?: 'below-borders' | 'top'
    /** Whether the layer appears or not */
    visible?: boolean
}
