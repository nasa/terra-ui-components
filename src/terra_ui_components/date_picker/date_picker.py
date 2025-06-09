import importlib.metadata
import traitlets
from ..base import TerraBaseWidget

try:
    __version__ = importlib.metadata.version("terra_date_picker")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class TerraDatePicker(TerraBaseWidget):
    _esm = TerraBaseWidget.get_autoloader() + """
    function render({ model, el }) {
        // create an instance of the component
        let component = document.createElement('terra-date-picker')
        
        /**
         * Set initial property values
         */
        component.id = model.get('id')
        component.range = model.get('range')
        component.minDate = model.get('minDate')
        component.maxDate = model.get('maxDate')
        component.startDate = model.get('startDate')
        component.endDate = model.get('endDate')
        component.allowInput = model.get('allowInput')
        component.altFormat = model.get('altFormat')
        component.altInput = model.get('altInput')
        component.altInputClass = model.get('altInputClass')
        component.dateFormat = model.get('dateFormat')
        component.enableTime = model.get('enableTime')
        component.time24hr = model.get('time24hr')
        component.weekNumbers = model.get('weekNumbers')
        component.static = model.get('static')
        component.position = model.get('position')
        component.theme = model.get('theme')
        component.showMonths = model.get('showMonths')

        /**
         * add the component to the cell
         */
        el.appendChild(component)

        /**
         * Add event listeners.
         */
        component.addEventListener('change', (e) => {
            model.set('selectedDates', e.detail.selectedDates)
            model.save_changes()
        })

        /**
         * Set up property change handlers
         */
        model.on('change:id', () => {
            component.id = model.get('id')
        })
        model.on('change:range', () => {
            component.range = model.get('range')
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
        model.on('change:allowInput', () => {
            component.allowInput = model.get('allowInput')
        })
        model.on('change:altFormat', () => {
            component.altFormat = model.get('altFormat')
        })
        model.on('change:altInput', () => {
            component.altInput = model.get('altInput')
        })
        model.on('change:altInputClass', () => {
            component.altInputClass = model.get('altInputClass')
        })
        model.on('change:dateFormat', () => {
            component.dateFormat = model.get('dateFormat')
        })
        model.on('change:enableTime', () => {
            component.enableTime = model.get('enableTime')
        })
        model.on('change:time24hr', () => {
            component.time24hr = model.get('time24hr')
        })
        model.on('change:weekNumbers', () => {
            component.weekNumbers = model.get('weekNumbers')
        })
        model.on('change:static', () => {
            component.static = model.get('static')
        })
        model.on('change:position', () => {
            component.position = model.get('position')
        })
        model.on('change:theme', () => {
            component.theme = model.get('theme')
        })
        model.on('change:showMonths', () => {
            component.showMonths = model.get('showMonths')
        })
    }

    export default { render };
    """

    # Component properties
    id = traitlets.Unicode('').tag(sync=True)
    range = traitlets.Bool(False).tag(sync=True)
    minDate = traitlets.Unicode('').tag(sync=True)
    maxDate = traitlets.Unicode('').tag(sync=True)
    startDate = traitlets.Unicode('').tag(sync=True)
    endDate = traitlets.Unicode('').tag(sync=True)
    allowInput = traitlets.Bool(False).tag(sync=True)
    altFormat = traitlets.Unicode('F j, Y').tag(sync=True)
    altInput = traitlets.Bool(False).tag(sync=True)
    altInputClass = traitlets.Unicode('').tag(sync=True)
    dateFormat = traitlets.Unicode('Y-m-d').tag(sync=True)
    enableTime = traitlets.Bool(False).tag(sync=True)
    time24hr = traitlets.Bool(False).tag(sync=True)
    weekNumbers = traitlets.Bool(False).tag(sync=True)
    static = traitlets.Bool(False).tag(sync=True)
    position = traitlets.Unicode('auto').tag(sync=True)
    theme = traitlets.Unicode('light').tag(sync=True)
    showMonths = traitlets.Int(1).tag(sync=True)
    selectedDates = traitlets.List(trait=traitlets.Unicode(), default_value=[]).tag(sync=True)
