import importlib.metadata
import base64
import traitlets
from ..base import TerraBaseWidget

try:
    __version__ = importlib.metadata.version("terra_time_average_map")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class TerraTimeAverageMap(TerraBaseWidget):
    _esm = TerraBaseWidget.get_autoloader() + """
    function render({ model, el }) {
        // create an instance of the component
        let component = document.createElement('terra-time-average-map')
        
        /**
         * Set initial property values
         * NOTE: In reality, we won't need to have the ability to set EVERY property in a Jupyter Notebook, feel free to remove the ones that don't make sense
         *
         * model.get() pulls from the Jupyter notebooks state. We'll use the state to set the initial value for each property
         */
        component.collection = model.get('collection')
        component.variable = model.get('variable')
        component.startDate = model.get('startDate')
        component.endDate = model.get('endDate')
        component.location = model.get('location')
        component.bearerToken = model.get('bearerToken')
        component.long_name = model.get('long_name')

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
        model.on('change:long_name', () => {
            component.long_name = model.get('long_name')
        })

        /**
         * Add event listeners.
         * These are used to communicate back to the Jupyter notebook
         */
        component.addEventListener('terra-time-average-map-data-change', async (e) => {
            // hide the loading overlay, if it exists
            const loadingOverlay = document.getElementById('jupyterlite-loading-overlay')

            if (loadingOverlay) {
                loadingOverlay.remove()
            }

            console.log('time-average-map: finished mapping GeoTIFF. Sending GeoTIFF to Python... ', e)

            // We can't send a JS Blob to Python, so we'll instead need to convert it to bytes
            const blob = e.detail.data

            if (blob instanceof Blob) {
                const arrayBuffer = await blob.arrayBuffer()
                const uint8Array = new Uint8Array(arrayBuffer)
                
                // Convert to base64 string for transmission to Python
                // Use chunked conversion to avoid "Maximum call stack size exceeded" for large files
                const chunkSize = 8192
                let binaryString = ''
                
                for (let i = 0; i < uint8Array.length; i += chunkSize) {
                    const chunk = uint8Array.subarray(i, i + chunkSize)
                    binaryString += String.fromCharCode(...chunk)
                }

                const base64String = btoa(binaryString)
                model.set('_data_base64', base64String)

                console.log('time-average-map: sent base64 encoded GeoTIFF to Python ', base64String)
            } else {
                console.error('time-average-map: failed to send GeoTIFF to Python. Unknown data type', blob)
                model.set('_data_base64', '')
            }
            
            model.save_changes()
        })
    }

    export default { render };
    """

    # Component properties
    # While we have properties in the component, we also need to tell Python about them as well.
    # Again, you don't technically need all these. If Jupyter Notebooks don't need access to them, you can remove them from here
    collection = traitlets.Unicode('').tag(sync=True)
    variable = traitlets.Unicode('').tag(sync=True)
    startDate = traitlets.Unicode('').tag(sync=True)
    endDate = traitlets.Unicode('').tag(sync=True)
    location = traitlets.Unicode('').tag(sync=True)
    bearerToken = traitlets.Unicode('').tag(sync=True)
    long_name = traitlets.Unicode('').tag(sync=True)
    _data_base64 = traitlets.Unicode('').tag(sync=True)

    @property
    def data(self):
        """Get the binary data as bytes, decoded from base64."""
        if not self._data_base64:
            return b''
        try:
            return base64.b64decode(self._data_base64)
        except Exception:
            return b''
