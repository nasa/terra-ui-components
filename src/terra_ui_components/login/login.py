import importlib.metadata
import traitlets
from ..base import TerraBaseWidget

try:
    __version__ = importlib.metadata.version("terra_login")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class TerraLogin(TerraBaseWidget):
    _esm = TerraBaseWidget.get_autoloader() + """
    function render({ model, el }) {
        // create an instance of the component
        let component = document.createElement('terra-login')
        
        /**
         * Set initial property values
         * NOTE: In reality, we won't need to have the ability to set EVERY property in a Jupyter Notebook, feel free to remove the ones that don't make sense
         *
         * model.get() pulls from the Jupyter notebooks state. We'll use the state to set the initial value for each property
         */
        component.buttonLabel = model.get('buttonLabel')
        component.loggedInMessage = model.get('loggedInMessage')
        component.loggedOutMessage = model.get('loggedOutMessage')
        component.loadingMessage = model.get('loadingMessage')

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
        model.on('change:buttonLabel', () => {
            component.buttonLabel = model.get('buttonLabel')
        })
        model.on('change:loggedInMessage', () => {
            component.loggedInMessage = model.get('loggedInMessage')
        })
        model.on('change:loggedOutMessage', () => {
            component.loggedOutMessage = model.get('loggedOutMessage')
        })
        model.on('change:loadingMessage', () => {
            component.loadingMessage = model.get('loadingMessage')
        })
    }

    export default { render };
    """

    # Component properties
    # While we have properties in the component, we also need to tell Python about them as well.
    # Again, you don't technically need all these. If Jupyter Notebooks don't need access to them, you can remove them from here
    buttonLabel = traitlets.Unicode('').tag(sync=True)
    loggedInMessage = traitlets.Unicode(
        'You are logged in as {username}').tag(sync=True)
    loggedOutMessage = traitlets.Unicode('').tag(sync=True)
    loadingMessage = traitlets.Unicode(
        'Please wait while we check if you are logged in...').tag(sync=True)
