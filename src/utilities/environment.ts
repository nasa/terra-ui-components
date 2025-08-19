export enum Environment {
    UAT = 'uat',
    PROD = 'prod',
}

export function getEnvironment(): Environment {
    // Check localStorage first (useful if an app wants to force a specific environment)
    const localStorageEnv = localStorage.getItem('terra-environment')

    if (localStorageEnv === 'uat') {
        return Environment.UAT
    }
    if (localStorageEnv === 'prod') {
        return Environment.PROD
    }

    // Otherwise, check URL for UAT indicators
    const url = window.location.href
    const isUatUrl =
        url.includes('https://uat.') || // e.g. https://uat.urs.earthdata.nasa.gov/
        url.includes('https://migrate.') || // e.g. https://migrate.earthdata.nasa.gov/
        url.includes('.uat.') || // e.g. https://cmr.uat.earthdata.nasa.gov/
        url.includes('-test.') // e.g. https://uui-test.gesdisc.eosdis.nasa.gov/

    return isUatUrl ? Environment.UAT : Environment.PROD
}
