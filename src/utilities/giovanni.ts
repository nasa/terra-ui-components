export function convertVariableEntryIdToGiovanniFormat(
    collectionShortName: string,
    version: string,
    variableEntryId: string
): string {
    const versionWithUnderscores = version.replace(/\./g, '_') // replace dots with underscores in version (e.g. "5.12.4" -> "5_12_4")
    const variableNameNoGroups = variableEntryId.split('/').pop() // for variables containing groups, take only the variable name (e.g. "Grid/Intermediate/precipitationUncal" -> "precipitationUncal")

    return `${collectionShortName}_${versionWithUnderscores}_${variableNameNoGroups}`
}
