import importlib.metadata

import anywidget
import traitlets

try:
    __version__ = importlib.metadata.version("terra-button")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"


class TerraButton(anywidget.AnyWidget):
    _esm = """
    function render({ model, el }) {
        let terraAutoloader = document.createElement('script')
        terraAutoloader.src = "https://cdn.jsdelivr.net/npm/@nasa-terra/components@0.0.7/cdn/terra-ui-components-autoloader.js"
        terraAutoloader.type = 'module'
        document.querySelector('head').appendChild(terraAutoloader)

        let component = document.createElement('terra-button')
        component.innerText = model.get('value')
        el.appendChild(component)

        model.on('change:value', () => {
            console.log('model has changed to ', model.get('value'))
            component.innerText = model.get('value')
        })
    }

    export default { render };
    """
    value = traitlets.Unicode('Button').tag(sync=True)
