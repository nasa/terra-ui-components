export type CommonConfig = {
    /** Unique name for this layer, used for add/remove/update diffing and `getLayer()`. */
    name: string
    /** Where to place the layer relative to the borders/labels layers. Defaults to 'below-borders'. */
    position?: 'below-borders' | 'top'
    /**
     * Whether the layer renders immediately once built. Defaults to `true`.
     * A hidden layer is still added to the map (and addressable via
     * `getLayer()`/`removeLayer()`) — just not drawn — so it can be toggled
     * on later with `getLayer(name).setVisible(true)`.
     */
    visible?: boolean
}
