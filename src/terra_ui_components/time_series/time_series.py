import importlib.metadata
import traitlets
from ..base import TerraBaseWidget

try:
    __version__ = importlib.metadata.version("terra_time_series")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class TerraTimeSeries(TerraBaseWidget):
    _esm = TerraBaseWidget.get_autoloader() + """
    function render({ model, el }) {
        // create an instance of the component
        let component = document.createElement('terra-time-series')
        
        /**
         * Set initial property values
         * NOTE: In reality, we won't need to have the ability to set EVERY property in a Jupyter Notebook, feel free to remove the ones that don't make sense
         *
         * model.get() pulls from the Jupyter notebooks state. We'll use the state to set the initial value for each property
         */
        component.variableEntryId = model.get('variableEntryId')
        component.collection = model.get('collection')
        component.variable = model.get('variable')
        component.startDate = model.get('startDate')
        component.endDate = model.get('endDate')
        component.location = model.get('location')
        component.bearerToken = model.get('bearerToken')

        /**
         * add the component to the cell
         * it should now be visible in the notebook!
         */
        el.appendChild(component)


        /**
         * Set up property change handlers
         * This way if someone in the Jupyter Notebook changes the property externally, we reflect the change
         * back to the component.
         * 
         * If this isn't here, the component can't be changed after it's initial render
         */
        model.on('change:variableEntryId', () => {
            component.variableEntryId = model.get('variableEntryId')
        })
        model.on('change:collection', () => {
            component.collection = model.get('collection')
        })
        model.on('change:variable', () => {
            component.variable = model.get('variable')
        })
        model.on('change:startDate', () => {
            component.startDate = model.get('startDate')
        })
        model.on('change:endDate', () => {
            component.endDate = model.get('endDate')
        })
        model.on('change:location', () => {
            component.location = model.get('location')
        })
        model.on('change:bearerToken', () => {
            component.bearerToken = model.get('bearerToken')
        })

        /**
         * Add event listeners.
         * These are used to communicate back to the Jupyter notebook
         */
        component.addEventListener('terra-time-series-data-change', (e) => {
            // hide the loading overlay, if it exists
            const loadingOverlay = document.getElementById('jupyterlite-loading-overlay')

            if (loadingOverlay) {
                loadingOverlay.remove()
            }

            console.log('caught the event!! ', e)

            model.set('data', e.detail.data.data)
            model.save_changes()
        })
    }

    export default { render };
    """

    # Component properties
    # While we have properties in the component, we also need to tell Python about them as well. 
    # Again, you don't technically need all these. If Jupyter Notebooks don't need access to them, you can remove them from here
    variableEntryId = traitlets.Unicode('').tag(sync=True)
    collection = traitlets.Unicode('').tag(sync=True)
    variable = traitlets.Unicode('').tag(sync=True)
    startDate = traitlets.Unicode('').tag(sync=True)
    endDate = traitlets.Unicode('').tag(sync=True)
    location = traitlets.Unicode('').tag(sync=True)
    bearerToken = traitlets.Unicode('').tag(sync=True)
    data = traitlets.List(trait=traitlets.Dict(), default_value=[]).tag(sync=True)