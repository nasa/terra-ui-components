import type { API } from 'nouislider'

/**
 * copied mostly verbatim from the NoUI Slider docs: https://refreshless.com/nouislider/examples/#section-merging-tooltips
 * TODO: refactor this, it's a bit of a mess
 */
export function mergeTooltips(
    slider: HTMLElement & { noUiSlider: API }, // HtmlElement with an initialized slider
    threshold = 15, // minimum proximity (in percentages) to merge tooltips
    separator = ' - ' // string joining tooltips
) {
    const textIsRtl = getComputedStyle(slider).direction === 'rtl'
    const isRtl = slider.noUiSlider.options.direction === 'rtl'
    const isVertical = slider.noUiSlider.options.orientation === 'vertical'
    const tooltips = slider.noUiSlider.getTooltips()
    const origins = slider.noUiSlider.getOrigins()

    // Move tooltips into the origin element. The default stylesheet handles this.
    // @ts-expect-error
    tooltips.forEach(function (tooltip, index) {
        if (tooltip) {
            origins[index].appendChild(tooltip)
        }
    })

    slider.noUiSlider.on(
        'update',
        function (values, _handle, _unencoded, _tap, positions) {
            var pools: Array<Array<number>> = [[]]
            var poolPositions: Array<Array<number>> = [[]]
            var poolValues: Array<Array<string | number>> = [[]]
            var atPool = 0

            // Assign the first tooltip to the first pool, if the tooltip is configured
            if (tooltips[0]) {
                pools[0][0] = 0
                poolPositions[0][0] = positions[0]
                poolValues[0][0] = values[0]
            }

            for (var i = 1; i < positions.length; i++) {
                if (!tooltips[i] || positions[i] - positions[i - 1] > threshold) {
                    atPool++
                    pools[atPool] = []
                    poolValues[atPool] = []
                    poolPositions[atPool] = []
                }

                if (tooltips[i]) {
                    pools[atPool].push(i)
                    poolValues[atPool].push(values[i])
                    poolPositions[atPool].push(positions[i])
                }
            }

            pools.forEach(function (pool, poolIndex) {
                var handlesInPool = pool.length

                for (var j = 0; j < handlesInPool; j++) {
                    var handleNumber = pool[j]

                    if (j === handlesInPool - 1) {
                        var offset = 0

                        poolPositions[poolIndex].forEach(function (value) {
                            offset += 1000 - value
                        })

                        var direction = isVertical ? 'bottom' : 'right'
                        var last = isRtl ? 0 : handlesInPool - 1
                        var lastOffset = 1000 - poolPositions[poolIndex][last]
                        offset =
                            (textIsRtl && !isVertical ? 100 : 0) +
                            offset / handlesInPool -
                            lastOffset

                        // @ts-expect-error
                        tooltips[handleNumber].innerHTML =
                            poolValues[poolIndex].join(separator)
                        // @ts-expect-error
                        tooltips[handleNumber].style.display = 'block'
                        // @ts-expect-error
                        tooltips[handleNumber].style[direction] = offset + '%'
                    } else {
                        // hide the tooltip
                        // @ts-expect-error
                        tooltips[handleNumber].style.display = 'none'
                    }
                }
            })
        }
    )
}
