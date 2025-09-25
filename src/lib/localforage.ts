/**
 * This is a ESM shim to import localforage as a module.
 */
import type LocalForageType from 'localforage'
// @ts-ignore this explicit .js file has no typings
import localForageImport from 'localforage/src/localforage.js'

export const localforage: typeof LocalForageType = localForageImport
