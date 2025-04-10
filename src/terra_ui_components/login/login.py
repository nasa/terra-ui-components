import importlib.metadata
from ..base import TerraBaseWidget

try:
    __version__ = importlib.metadata.version("terra_login")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class TerraLogin(TerraBaseWidget):
    _esm = (
        TerraBaseWidget.get_autoloader()
        + """
    function render({ model, el }) {
        // create an instance of the component
        let component = document.createElement('terra-login')

        /**
         * Set initial property values
         * NOTE: In reality, we won't need to have the ability to set EVERY property in a Jupyter Notebook, feel free to remove the ones that don't make sense
         *
         * model.get() pulls from the Jupyter notebooks state. We'll use the state to set the initial value for each property
         */
        component.attr = model.get('attr')

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
        model.on('change:attr', () => {
            component.attr = model.get('attr')
        })

        /**
         * Add event listeners.
         * These are used to communicate back to the Jupyter notebook
         */
        component.addEventListener('terra-login', (e) => {
            // Placeholder for event handling, you'll need to provide your own functionality here
            model.set('terra-login_triggered', true)
            model.save_changes()
        })
    }

    export default { render };
    """
    )
