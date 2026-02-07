import type { ReactiveControllerHost } from 'lit'
import type TerraElement from '../internal/terra-element.js'

export enum Environment {
    UAT = 'uat',
    PROD = 'prod',
}

export function getEnvironment(
    host?: ReactiveControllerHost & TerraElement
): Environment {
    if (host?.environment) {
        return host.environment
    }

    return Environment.PROD
}
