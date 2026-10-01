import type { UmmResponse, UmmResult } from '../apis/cmr.api.js'
import type { UmmVar } from '../apis/types/cmr/umm-var.js'

class CmrVariableService {
    /**
     * given a name and a list of variables, return the variable with the matching name
     */
    getVariableByName(name: string, variables?: UmmResponse<UmmVar> | null) {
        if (!variables || !variables.items?.length) {
            return
        }

        return variables.items.find(variable => variable.umm.Name === name)
    }

    /**
     * given a variable, return the variable's display label
     * ex: Shortname = LongName (Units)
     */
    getVariableDisplayLabel(variable: UmmResult<UmmVar>) {
        const { Name = '', LongName = '', Units = '' } = variable.umm

        return `${Name}${Name && LongName && Name !== LongName ? ` = ${LongName}` : ''}${Units ? ` (${Units})` : ''}`
    }
}

const cmrVariableService = new CmrVariableService()

export default cmrVariableService
