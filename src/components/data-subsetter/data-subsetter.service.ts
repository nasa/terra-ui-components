import type TerraDataSubsetter from './data-subsetter.component.js'

export default class DataSubsetterService {
    #host: TerraDataSubsetter

    constructor(host: TerraDataSubsetter) {
        this.#host = host
    }
}
