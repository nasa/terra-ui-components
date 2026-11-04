import { _testing } from '../mixins/query-client.mixin.js'

/**
 * Resets the one-time persistence restore state so tests can simulate a cold-start
 * IndexedDB restoration cycle without polluting production code exports.
 */
export function resetQueryClientPersistence(): void {
    _testing.resetPersistence()
}
