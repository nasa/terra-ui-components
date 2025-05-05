import importlib.metadata
import traitlets
from ..base import TerraBaseWidget

try:
    __version__ = importlib.metadata.version("terra_variable_keyword_search")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class TerraVariableKeywordSearch(TerraBaseWidget):
    _esm = TerraBaseWidget.get_autoloader() + """
    function render({ model, el }) {
        // create an instance of the component
        let component = document.createElement('terra-variable-keyword-search')
        
        /**
         * Set initial property values
         * NOTE: In reality, we won't need to have the ability to set EVERY property in a Jupyter Notebook, feel free to remove the ones that don't make sense
         *
         * model.get() pulls from the Jupyter notebooks state. We'll use the state to set the initial value for each property
         */
        component.label = model.get('label')
        component.placeholder = model.get('placeholder')
        component.hideLabel = model.get('hideLabel')
        component.searchConfig = model.get('searchConfig')
        component.value = model.get('value')

        /**
         * add the component to the cell
         * it should now be visible in the notebook!
         */
        el.appendChild(component)

        /**
         * Add event listeners.
         * These are used to communicate back to the Jupyter notebook
         */
        component.addEventListener('terra-variable-keyword-search-change', (e) => {
            // Placeholder for event handling, you'll need to provide your own functionality here
            // model.set('terra-variable-keyword-search-change_triggered', true)
            // model.save_changes()
        })
        component.addEventListener('terra-search', (e) => {
            // Placeholder for event handling, you'll need to provide your own functionality here
            // model.set('terra-search_triggered', true)
            // model.save_changes()
        })
        component.addEventListener('terra-search', (e) => {
            // Placeholder for event handling, you'll need to provide your own functionality here
            // model.set('terra-search_triggered', true)
            // model.save_changes()
        })

        /**
         * Set up property change handlers
         * This way if someone in the Jupyter Notebook changes the property externally, we reflect the change
         * back to the component.
         * 
         * If this isn't here, the component can't be changed after it's initial render
         */
        model.on('change:label', () => {
            component.label = model.get('label')
        })
        model.on('change:placeholder', () => {
            component.placeholder = model.get('placeholder')
        })
        model.on('change:hideLabel', () => {
            component.hideLabel = model.get('hideLabel')
        })
        model.on('change:searchConfig', () => {
            component.searchConfig = model.get('searchConfig')
        })
        model.on('change:value', () => {
            component.value = model.get('value')
        })
    }

    export default { render };
    """

    # Component properties
    # While we have properties in the component, we also need to tell Python about them as well. 
    # Again, you don't technically need all these. If Jupyter Notebooks don't need access to them, you can remove them from here
    label = traitlets.Unicode('').tag(sync=True)
    placeholder = traitlets.Unicode('').tag(sync=True)
    hideLabel = traitlets.Unicode('').tag(sync=True)
    searchConfig = traitlets.Unicode('').tag(sync=True)
    value = traitlets.Unicode('').tag(sync=True)
