export const KnownFeatureFlags = {
    DIMENSION_SUBSET: 'dimension-subset',
} as const

export type KnownFeatureFlag =
    (typeof KnownFeatureFlags)[keyof typeof KnownFeatureFlags]

/**
 * Returns true if the given feature flag is enabled.
 *
 * Checks two sources in order:
 * 1. The `?terra-features=flag1,flag2` URL parameter
 * 2. The component's `features` attribute (comma-separated string)
 *
 * @example
 * // In a component:
 * isFeatureEnabled(KnownFeatureFlags.DIMENSION_SUBSET, this.features)
 *
 * // Enabled via HTML attribute:
 * <terra-data-subsetter features="dimension-subset"></terra-data-subsetter>
 *
 * // Enabled via URL:
 * https://example.com?terra-features=dimension-subset
 */
export function isFeatureEnabled(
    flag: string,
    featuresAttr: string | undefined,
): boolean {
    const urlFeatures = new URLSearchParams(window.location.search).get(
        'terra-features',
    )
    const allFeatures = [featuresAttr, urlFeatures].filter(Boolean).join(',')

    return allFeatures
        .split(',')
        .map((f) => f.trim())
        .includes(flag)
}
