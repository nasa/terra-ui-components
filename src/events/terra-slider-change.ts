export type TerraSliderChangeEvent =
    | CustomEvent<{ value: number }>
    | CustomEvent<{ startValue: number; endValue: number }>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-slider-change': TerraSliderChangeEvent
    }
}
