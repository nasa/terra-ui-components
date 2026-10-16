export type CommonConfig = {
    /** Unique name for this layer, used for add/remove/update diffing and `getLayer()`. */
    name: string
    /** Where to place the layer relative to the borders/labels layers. Defaults to 'below-borders'. */
    position?: 'below-borders' | 'top'
}
