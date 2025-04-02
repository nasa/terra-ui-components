import importlib.metadata
import traitlets
from ..base import TerraBaseWidget

try:
    __version__ = importlib.metadata.version("terra_date_range_slider")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class TerraDateRangeSlider(TerraBaseWidget):
    _esm = TerraBaseWidget.get_autoloader() + """
    function render({ model, el }) {
        // create an instance of the component
        let component = document.createElement('terra-date-range-slider')
        
        /**
         * Set initial property values
         * NOTE: In reality, we won't need to have the ability to set EVERY property in a Jupyter Notebook, feel free to remove the ones that don't make sense
         *
         * model.get() pulls from the Jupyter notebooks state. We'll use the state to set the initial value for each property
         */
        component.timeScale = model.get('timeScale')
        component.minDate = model.get('minDate')
        component.maxDate = model.get('maxDate')
        component.startDate = model.get('startDate')
        component.endDate = model.get('endDate')
        component.disabled = model.get('disabled')
        component.hasPips = model.get('hasPips')

        /**
         * add the component to the cell
         * it should now be visible in the notebook!
         */
        el.appendChild(component)

        /**
         * Add event listeners.
         * These are used to communicate back to the Jupyter notebook
         */
        component.addEventListener('terra-date-range-change', (e) => {
            // Placeholder for event handling, you'll need to provide your own functionality here
            // model.set('terra-date-range-change_triggered', true)
            // model.save_changes()
        })

        /**
         * Set up property change handlers
         * This way if someone in the Jupyter Notebook changes the property externally, we reflect the change
         * back to the component.
         * 
         * If this isn't here, the component can't be changed after it's initial render
         */
        model.on('change:timeScale', () => {
            component.timeScale = model.get('timeScale')
        })
        model.on('change:minDate', () => {
            component.minDate = model.get('minDate')
        })
        model.on('change:maxDate', () => {
            component.maxDate = model.get('maxDate')
        })
        model.on('change:startDate', () => {
            component.startDate = model.get('startDate')
        })
        model.on('change:endDate', () => {
            component.endDate = model.get('endDate')
        })
        model.on('change:disabled', () => {
            component.disabled = model.get('disabled')
        })
        model.on('change:hasPips', () => {
            component.hasPips = model.get('hasPips')
        })
    }

    export default { render };
    """

    # Component properties
    # While we have properties in the component, we also need to tell Python about them as well. 
    # Again, you don't technically need all these. If Jupyter Notebooks don't need access to them, you can remove them from here
    timeScale = traitlets.Unicode('').tag(sync=True)
    minDate = traitlets.Unicode('').tag(sync=True)
    maxDate = traitlets.Unicode('').tag(sync=True)
    startDate = traitlets.Unicode('').tag(sync=True)
    endDate = traitlets.Unicode('').tag(sync=True)
    disabled = traitlets.Bool(False).tag(sync=True)
    hasPips = traitlets.Bool(False).tag(sync=True)
