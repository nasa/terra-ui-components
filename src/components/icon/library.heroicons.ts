import { getBasePath } from '../../utilities/base-path.js'
import type { IconLibrary } from './library.js'

const library: IconLibrary = {
    name: 'heroicons',
    resolver: name => getBasePath(`assets/icons/${name}.svg`),
}

export default library
